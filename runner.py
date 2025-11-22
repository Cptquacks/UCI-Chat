import os

def show_folder(path: str, ignored: list[str], prefix: str = "") -> None:
    try:
        elements = [e for e in os.listdir(path) if e not in ignored]
        
        for i, element in enumerate(elements):
            element_path = os.path.join(path, element)
            is_last = (i == len(elements) - 1)
            
            connector = "└── " if is_last else "├── "
            print(prefix + connector + element + ("/" if os.path.isdir(element_path) else ""))
            
            if os.path.isdir(element_path):
                extension = "    " if is_last else "│   "
                show_folder(element_path, ignored, prefix + extension)
                
    except Exception as e:
        print(f'[ ERROR: {e} ]')

# Uso
show_folder(os.curdir, ['node_modules', '.git', 'schemas'])