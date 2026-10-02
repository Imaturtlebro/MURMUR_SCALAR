#!/usr/bin/env python3
"""Build a MURMUR content pack into a .mcpack.

Staging is explicit: manifest.json + scripts/*.js and nothing else, so build
tooling (compile.py, compile.bat) and previously-built archives can never be
swept into the zip. That is the bug that produced a 1.1.35 nested inside the
published NOIR 1.1.36.

Usage: build_mcpack.py <pack_dir> <output_dir>
"""
import json
import os
import sys
import zipfile

CORE_UUID = "7f9a1b2c-3d4e-4f5a-6b7c-8d9e0f1a2b3c"


def main(pack_dir, out_dir):
    manifest_path = os.path.join(pack_dir, "manifest.json")
    if not os.path.exists(manifest_path):
        print("  ERROR: no manifest.json in %s" % pack_dir)
        return 1

    with open(manifest_path, "r", encoding="utf-8") as fh:
        manifest = json.load(fh)

    version = ".".join(str(x) for x in manifest["header"]["version"])
    mod_ver = ".".join(str(x) for x in manifest["modules"][0]["version"])
    if version != mod_ver:
        print("  ERROR: header %s != module %s" % (version, mod_ver))
        return 1

    entry = manifest["modules"][0]["entry"]
    if not os.path.exists(os.path.join(pack_dir, entry)):
        print("  ERROR: entry file missing: %s" % entry)
        return 1

    dep = [d for d in manifest.get("dependencies", []) if d.get("uuid")]
    if not dep or dep[0]["uuid"] != CORE_UUID:
        print("  ERROR: MURMUR CORE dependency missing or wrong")
        return 1

    # header.name already begins with "MURMUR", so prefixing again produced
    # "MURMUR - MURMUR_Uncanny_Pack_BP_...". Strip it and keep one prefix.
    name = manifest["header"]["name"]
    if name.upper().startswith("MURMUR"):
        name = name[len("MURMUR"):].strip()
    out_name = "MURMUR - %s_BP_%s.mcpack" % (name, version)
    out_path = os.path.join(out_dir, out_name)

    if os.path.exists(out_path):
        os.remove(out_path)

    scripts = os.path.join(pack_dir, "scripts")
    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as z:
        z.write(manifest_path, "manifest.json")
        for name in sorted(os.listdir(scripts)):
            if name.endswith(".js"):
                z.write(os.path.join(scripts, name), "scripts/" + name)

    # Verify what we just wrote.
    with zipfile.ZipFile(out_path) as z:
        names = z.namelist()
        nested = [n for n in names if n.lower().endswith(".mcpack")]
        internal = ".".join(str(x) for x in
                           json.loads(z.read("manifest.json"))["header"]["version"])
        if nested:
            print("  ERROR: nested archive inside build: %s" % nested)
            return 1
        if "manifest.json" not in names:
            print("  ERROR: manifest not at archive root")
            return 1
        if internal != version:
            print("  ERROR: internal version %s != %s" % (internal, version))
            return 1
        if "scripts/%s" % os.path.basename(entry) not in names:
            print("  ERROR: entry missing from archive")
            return 1

    print("  %-46s %7d bytes  %d entries  v%s" % (
        out_name, os.path.getsize(out_path), len(names), version))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1], sys.argv[2]))
