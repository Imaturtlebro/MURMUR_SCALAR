# --- BULK COMPILER (2) ---
import os
import zipfile
import json
import shutil

# Configuration
EXCLUDE_LIST = [
    "compile.py", "compile.bat", "compile(2).py", "compile(2).bat", 
    ".git", ".vscode", "CONCEPT.md", "README.md", ".gitignore",
    "implementation_plan.md", "task.md", "walkthrough.md", "Documents"
]

def increment_version(manifest_path):
    if not os.path.exists(manifest_path):
        return None
    try:
        with open(manifest_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        version = data["header"].get("version", [1, 0, 0])
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

def zip_folder(folder_path, output_name):
    with zipfile.ZipFile(output_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, folder_path)
                zipf.write(abs_path, rel_path)

def main():
    root_dir = os.getcwd()
    print(f"--- MURMUR BULK COMPILER V2 ---")
    print(f"Root: {root_dir}\n")
    
    packs_found = []

    # Find all subdirectories with a manifest.json
    for entry in os.scandir(root_dir):
        if entry.is_dir() and entry.name not in EXCLUDE_LIST:
            m_path = os.path.join(entry.path, "manifest.json")
            if os.path.exists(m_path):
                with open(m_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                name = data["header"].get("name", entry.name)
                packs_found.append({
                    "path": entry.path,
                    "name": name,
                    "manifest": m_path
                })

    if not packs_found:
        print("No MURMUR packs found in subdirectories!")
        return

    mcpacks = []
    for pack in packs_found:
        v = increment_version(pack["manifest"])
        v_str = ".".join(map(str, v)) if v else "1.0.0"
        
        # Create safe filename
        safe_name = pack["name"].replace(" ", "_").replace("-", "_")
        filename = f"{safe_name}_v{v_str}.mcpack"
        
        print(f"Packaging: {pack['name']} -> {filename}")
        zip_folder(pack["path"], filename)
        mcpacks.append(filename)

    if mcpacks:
        print(f"\nSUCCESS! Created {len(mcpacks)} standalone packs.")
        for mp in mcpacks:
            print(f" - {mp}")
        print("\nYou can now install these separately to Minecraft.")
    else:
        print("\nNo packs were generated.")

if __name__ == "__main__":
    main()
