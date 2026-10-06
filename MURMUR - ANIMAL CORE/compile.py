import os
import zipfile
import json

# --- UNIVERSAL CONFIG ---
EXCLUDE_LIST = [
    "compile.py", "compile.bat", ".git", ".vscode", "CONCEPT.md",
    "README.md", ".gitignore", "implementation_plan.md", "task.md",
    "walkthrough.md", "universal_compiler_plan.md"
]

# Previous builds must never be packaged into the next one. Without this a
# stale .mcpack sitting in the pack root ends up nested inside the new build.
BUILD_ARTIFACT_SUFFIXES = (".mcpack", ".mcaddon")

# The pack this script belongs to. Resolved from __file__, never from the cwd,
# so the build can be launched from anywhere and still package the right folder.
PACK_ROOT = os.path.dirname(os.path.abspath(__file__))


def is_build_artifact(name):
    return name.lower().endswith(BUILD_ARTIFACT_SUFFIXES)


def get_mod_name():
    return os.path.basename(PACK_ROOT)


def _abs(rel):
    """Resolve a pack-relative path against PACK_ROOT."""
    return os.path.join(PACK_ROOT, rel)


def increment_version(manifest_path):
    if not os.path.exists(manifest_path):
        return None
    try:
        with open(manifest_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        version = [1, 0, 0]
        if "header" in data and "version" in data["header"]:
            version = data["header"]["version"]
            if isinstance(version, list) and len(version) >= 3:
                version[2] += 1

        data["header"]["version"] = version
        if "modules" in data:
            for module in data["modules"]:
                module["version"] = version

        with open(manifest_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
        return version
    except Exception as e:
        print(f"Error updating {manifest_path}: {e}")
        return None


def is_behavior_pack(manifest_data):
    if "modules" in manifest_data:
        for module in manifest_data["modules"]:
            if module.get("type") in ["data", "script"]:
                return True
    return False


def is_resource_pack(manifest_data):
    if "modules" in manifest_data:
        for module in manifest_data["modules"]:
            if module.get("type") == "resources":
                return True
    return False


def _should_skip_file(file):
    if file in EXCLUDE_LIST:
        return True
    return is_build_artifact(file)


def zip_pack(folder_path, output_name, is_root=False):
    """Zip a pack folder. output_name is a bare filename, resolved in PACK_ROOT."""
    base = _abs(folder_path)
    out_path = _abs(output_name)
    with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(base):
            dirs[:] = [d for d in dirs if d not in EXCLUDE_LIST]
            for file in files:
                if _should_skip_file(file):
                    continue
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, base)
                zipf.write(abs_path, rel_path)


def main():
    mod_name = get_mod_name()
    print(f"--- Compiling Mod: {mod_name} ---")

    packs = []

    # Check root for manifest
    if os.path.exists(_abs("manifest.json")):
        with open(_abs("manifest.json"), 'r', encoding='utf-8') as f:
            data = json.load(f)
        pack_type = "BP" if is_behavior_pack(data) else ("RP" if is_resource_pack(data) else "Pack")
        packs.append({"path": ".", "type": pack_type, "is_root": True, "manifest": _abs("manifest.json")})

    # Check subfolders for manifest
    for entry in sorted(os.scandir(PACK_ROOT), key=lambda e: e.name):
        if not entry.is_dir():
            continue
        if entry.name in EXCLUDE_LIST or is_build_artifact(entry.name):
            continue
        m_path = os.path.join(entry.path, "manifest.json")
        if os.path.exists(m_path):
            with open(m_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            pack_type = "BP" if is_behavior_pack(data) else ("RP" if is_resource_pack(data) else "Pack")
            packs.append({"path": os.path.relpath(entry.path, PACK_ROOT), "type": pack_type,
                          "is_root": False, "manifest": m_path})

    if not packs:
        print(f"No manifest.json found in {PACK_ROOT}")
        return

    generated_files = []
    for pack in packs:
        v = increment_version(pack["manifest"])
        v_str = ".".join(map(str, v)) if v else "1.0.0"
        pack_name = f"{mod_name}_{pack['type']}_{v_str}.mcpack" if pack["type"] != "Pack" else f"{mod_name}_{v_str}.mcpack"
        print(f"Packaging {pack['type']} ({pack['path']}) -> {pack_name}")
        zip_pack(pack["path"], pack_name, pack["is_root"])
        generated_files.append(pack_name)

    if len(generated_files) > 1:
        addon_name = f"{mod_name}.mcaddon"
        print(f"Combining into {addon_name}...")
        with zipfile.ZipFile(_abs(addon_name), 'w', zipfile.ZIP_DEFLATED) as addon:
            for f in generated_files:
                addon.write(_abs(f), f)
        # Clean up individual mcpacks if combined
        for f in generated_files:
            try:
                os.remove(_abs(f))
            except OSError as e:
                print(f"  note: could not remove {f}: {e}")
        print(f"\nSUCCESS! Created: {addon_name}")
    elif len(generated_files) == 1:
        print(f"\nSUCCESS! Created: {generated_files[0]}")


if __name__ == "__main__":
    main()