from pathlib import Path
from uuid import uuid4

STORAGE_DIR = Path("vault-data/documents")

def get_file_extension(filename):
  return Path(filename).suffix.lower()

def generate_stored_filename(filename):
  extension = get_file_extension(filename)
  return f"{uuid4()}{extension}"

async def save_uploaded_file(file):
  STORAGE_DIR.mkdir(parents=True, exist_ok=True)

  stored_filename = generate_stored_filename(file.filename)
  stored_path = STORAGE_DIR / stored_filename

  file_bytes = await file.read()
  stored_path.write_bytes(file_bytes)

  file_size = len(file_bytes)

  return stored_filename, file_size
  