from PIL import Image
import pytesseract
import re

TESSERACT_PATH = r"D:\Tesseract-OCR\tesseract.exe"

pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

def extract_text_from_image(file_path: str) -> str:
  with Image.open(file_path) as image:

    text = pytesseract.image_to_string(image)

    return text

def find_expiry_date(text: str) -> str | None:
  date_pattern = r"\b\d{2}/\d{2}/\d{4}\b"

  match = re.search(date_pattern, text)

  if match:
    day, month, year = match.group(0).split("/")
    return f"{year}-{month}-{day}"

  return None