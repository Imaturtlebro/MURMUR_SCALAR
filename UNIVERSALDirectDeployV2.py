# --- UNIVERSAL DIRECT DEPLOYER V2 ---
import os
import json
import shutil
import zipfile
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Dynamic file skipping rules
IGNORE_EXACT_FILES = ["direct deployer.py", "direct deployer.bat", "_llm_context.txt"]
IGNORE_EXTENSIONS = [".md", ".mcpack", ".mcaddon", ".zip", ".png", ".jpg", ".tga", ".ogg", ".wav"]
IGNORE_DIR_SUBSTRINGS = [".git", ".vscode", "documents", "_template_world"]

# Path configurations
POTENTIAL_PATHS = [
    r"C:\Users\Dillo\AppData\Local\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang",
    r"C:\Users\Dillo\AppData\Roaming\Minecraft Bedrock\Users\Shared\games\com.mojang",
    r"C:\Users\Dillo\AppData\Roaming\Minecraft Bedrock"
]

def get_mojang_path():
    for base in POTENTIAL_PATHS:
        if os.path.exists(base):
            return base
    return None

# --- 1. DUAL ROUTING DEPLOYER ---
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
        return version, data
    except Exception as e:
        print(f"Error updating manifest: {e}")
        return None, None

def should_copy(name):
    name_lower = name.lower()
    if name_lower in IGNORE_EXACT_FILES: return False
    if any(name_lower.endswith(ext) for ext in IGNORE_EXTENSIONS): return False
    if any(sub in name_lower for sub in IGNORE_DIR_SUBSTRINGS): return False
    return True

def deploy_folder(source_dir, mojang_base):
    manifest_path = os.path.join(source_dir, "manifest.json")
    if not os.path.exists(manifest_path):
        return False

    version, data = increment_version(manifest_path)
    if not data: return False

    pack_name = data["header"].get("name", os.path.basename(source_dir))
    
    # Determine if it's a Resource Pack or Behavior Pack
    pack_type = "development_behavior_packs" # Default
    for module in data.get("modules", []):
        if module.get("type") == "resources":
            pack_type = "development_resource_packs"
            break
            
    target_folder = os.path.join(mojang_base, pack_type, os.path.basename(source_dir))
    
    # Clear and deploy
    if os.path.exists(target_folder):
        shutil.rmtree(target_folder)
    os.makedirs(target_folder, exist_ok=True)
    
    for item in os.listdir(source_dir):
        if should_copy(item):
            s = os.path.join(source_dir, item)
            d = os.path.join(target_folder, item)
            if os.path.isdir(s): shutil.copytree(s, d)
            else: shutil.copy(s, d)
            
    print(f"[{time.strftime('%H:%M:%S')}] Deployed {pack_name} -> {pack_type}")
    return True

# --- 2. THE AUTO-WATCHER ---
class DeployHandler(FileSystemEventHandler):
    def __init__(self, root_dir, mojang_path):
        self.root_dir = root_dir
        self.mojang_path = mojang_path
        self.last_deploy = 0

    def on_modified(self, event):
        # Prevent rapid-fire deployments from a single save action
        if time.time() - self.last_deploy < 2.0: return
        if event.is_directory or not should_copy(os.path.basename(event.src_path)): return
        
        # Determine if we are in a single pack or multi-pack suite
        if os.path.exists(os.path.join(self.root_dir, "manifest.json")):
            deploy_folder(self.root_dir, self.mojang_path)
        else:
            # Multi-pack: find which subfolder triggered it
            for entry in os.scandir(self.root_dir):
                if entry.is_dir() and entry.path in event.src_path:
                    deploy_folder(entry.path, self.mojang_path)
                    
        self.last_deploy = time.time()

def start_watcher(root_dir, mojang_path):
    print("\nStarting Auto-Watcher... (Press Ctrl+C to stop)")
    event_handler = DeployHandler(root_dir, mojang_path)
    observer = Observer()
    observer.schedule(event_handler, root_dir, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

# --- 3. LLM CONTEXT SMASHER ---
def smash_context(root_dir):
    print("\nSmashing context for LLMs...")
    output_file = os.path.join(root_dir, "_LLM_CONTEXT.txt")
    valid_exts = [".json", ".js", ".ts"]
    
    with open(output_file, "w", encoding="utf-8") as out:
        out.write("--- PROJECT CONTEXT ---\n")
        for root, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if should_copy(d)] # Filter out git/vscode
            for file in files:
                if any(file.endswith(ext) for ext in valid_exts) and file not in IGNORE_EXACT_FILES:
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, root_dir)
                    out.write(f"\n\n/// FILE: {rel_path} ///\n")
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            out.write(f.read())
                    except Exception as e:
                        out.write(f"[Error reading file: {e}]")
                        
    print(f"Success! Context dumped to _LLM_CONTEXT.txt. Drop this file into your chat.")

# --- 4. MCPACK UNPACKER ---
def unpack_archives(root_dir):
    print("\nScanning for .mcpack / .mcaddon files...")
    found = False
    for file in os.listdir(root_dir):
        if file.endswith(".mcpack") or file.endswith(".mcaddon"):
            found = True
            file_path = os.path.join(root_dir, file)
            folder_name = file.replace(".mcpack", "").replace(".mcaddon", "")
            target_dir = os.path.join(root_dir, folder_name)
            
            print(f"Unpacking {file}...")
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                zip_ref.extractall(target_dir)
            
            # Optionally delete the original zip after unpacking
            # os.remove(file_path)
    if not found:
        print("No archives found to unpack.")

# --- 5. TEST WORLD INJECTOR ---
def inject_test_world(root_dir, mojang_path):
    template_path = os.path.join(root_dir, "_Template_World")
    worlds_dir = os.path.join(mojang_path, "minecraftWorlds")
    
    if not os.path.exists(template_path):
        print("\nERROR: Please create a folder named '_Template_World' in this directory")
        print("and place a clean exported world folder inside it.")
        return
        
    world_id = f"TestWorld_{int(time.time())}"
    target_path = os.path.join(worlds_dir, world_id)
    
    print("\nInjecting fresh test world...")
    shutil.copytree(template_path, target_path)
    print("Success! A fresh world will be waiting in your game menu.")

# --- MAIN MENU ---
def main():
    root_dir = os.getcwd()
    mojang_path = get_mojang_path()
    
    if not mojang_path:
        print("CRITICAL: Minecraft Bedrock directory not found!")
        return

    print("========================================")
    print("   UNIVERSAL BEDROCK DEPLOYER V2")
    print("========================================\n")
    print("1. One-Time Deploy (Behavior & Resource Packs)")
    print("2. Start Auto-Watcher (Live Sync)")
    print("3. Smash Context for LLM (_LLM_CONTEXT.txt)")
    print("4. Unpack Local .mcpack / .mcaddons")
    print("5. Inject Fresh Test World")
    
    choice = input("\nSelect an option (1-5): ")
    
    if choice == "1":
        if os.path.exists(os.path.join(root_dir, "manifest.json")):
            deploy_folder(root_dir, mojang_path)
        else:
            for entry in os.scandir(root_dir):
                if entry.is_dir() and should_copy(entry.name):
                    deploy_folder(entry.path, mojang_path)
    elif choice == "2":
        start_watcher(root_dir, mojang_path)
    elif choice == "3":
        smash_context(root_dir)
    elif choice == "4":
        unpack_archives(root_dir)
    elif choice == "5":
        inject_test_world(root_dir, mojang_path)
    else:
        print("Invalid choice.")

if __name__ == "__main__":
    main()