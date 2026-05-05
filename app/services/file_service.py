import os

def get_file_metadata(file_path):
    """
    Example service logic to extract metadata from a file.
    In a real app, this might use libraries like python-magic or PIL.
    """
    if not os.path.exists(file_path):
        return {"error": "File not found"}

    stats = os.stat(file_path)
    return {
        "filename": os.path.basename(file_path),
        "size_bytes": stats.st_size,
        "extension": os.path.splitext(file_path)[1],
        "last_modified": stats.st_mtime
    }
