# --- DIRECT DEPLOYER (3) ---
import os
import zipfile
import json
import shutil

# Configuration
EXCLUDE_LIST = [
    "compile.py", "compile.bat", "compile(2).py", "compile(2).bat", "compile(3).py", "compile(3).bat",
    ".git", ".vscode", "CONCEPT.md", "README.md", ".gitignore",
    "implementation_plan.md", "task.md", "walkthrough.md", "Documents"
]

# Potential paths provided by the user
POTENTIAL_PATHS = [
    r"C:\Users\Dillo\AppData\Roaming\Minecraft Bedrock\Users\Shared\games\com.mojang",
    r"C:\Users\Dillo\AppData\Local\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang",
    r"C:\Users\Dillo\AppData\Roaming\Minecraft Bedrock"
]

def find_minecraft_path():
    for base in POTENTIAL_PATHS:
        # Check for both behavior_packs and development_behavior_packs
        bp_path = os.path.join(base, "behavior_packs")
        dev_bp_path = os.path.join(base, "development_behavior_packs")
        
        if os.path.exists(dev_bp_path):
            return dev_bp_path, True # Development mode
        if os.path.exists(bp_path):
            return bp_path, False # Standard mode
    return None, False

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

def main():
    root_dir = os.getcwd()
    dest_path, is_dev = find_minecraft_path()
    
    if not dest_path:
        print("CRITICAL: Minecraft behavior pack folder not found!")
        print("Checked:")
        for p in POTENTIAL_PATHS: print(f" - {p}")
        return

    print(f"--- MURMUR DIRECT DEPLOYER ---")
    print(f"Target: {dest_path} ({'Development' if is_dev else 'Standard'} Mode)\n")
    
    # Track results
    deployed = []

    for entry in os.scandir(root_dir):
        if entry.is_dir() and entry.name not in EXCLUDE_LIST:
            m_path = os.path.join(entry.path, "manifest.json")
            if os.path.exists(m_path):
                with open(m_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                pack_name = data["header"].get("name", entry.name)
                v = increment_version(m_path)
                
                # Deployment Logic
                target_folder = os.path.join(dest_path, entry.name)
                
                # For development_behavior_packs, we copy the raw folder
                if is_dev:
                    print(f"Deploying FOLDER: {pack_name} -> {target_folder}")
                    if os.path.exists(target_folder):
                        shutil.rmtree(target_folder)
                    shutil.copytree(entry.path, target_folder)
                    deployed.append(pack_name)
                else:
                    # For standard packs folder, we could zip but usually development_bp is better.
                    # We'll just do folder copy here too as Bedrock supports folders in BP if they have manifest.
                    print(f"Deploying FOLDER: {pack_name} -> {target_folder}")
                    if os.path.exists(target_folder):
                        shutil.rmtree(target_folder)
                    shutil.copytree(entry.path, target_folder)
                    deployed.append(pack_name)

    print(f"\nSUCCESS! Deployed {len(deployed)} mods directly to Minecraft.")
    for d in deployed: print(f" - {d}")
    print("\nRestart Minecraft or re-enter world to see changes.")

if __name__ == "__main__":
    main()
