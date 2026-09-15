from PIL import Image
import pytesseract
import re
from pytesseract import Output
from datetime import datetime

TESSERACT_PATH = r"D:\Tesseract-OCR\tesseract.exe"

pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

def extract_text_from_image(file_path: str) -> str:
  with Image.open(file_path) as image:

    text = pytesseract.image_to_string(image)

    return text


def extract_ocr_tokens(file_path: str) -> list[dict]:
    with Image.open(file_path) as image:
        data = pytesseract.image_to_data(image, output_type=Output.DICT)

    tokens = []

    for index, text in enumerate(data["text"]):
        cleaned_text = text.strip()

        if cleaned_text == "":
            continue

        tokens.append({
            "text": cleaned_text,
            "left": data["left"][index],
            "top": data["top"][index],
            "width": data["width"][index],
            "height": data["height"][index],
            "confidence": data["conf"][index],
            "line_number": data["line_num"][index],
            "block_number": data["block_num"][index],
        })

    return tokens


def find_expiry_date(text: str) -> str | None:
  date_pattern = r"\b\d{2}/\d{2}/\d{4}\b"

  matches = re.finditer(date_pattern, text)
  date_candidates = []

  for match in matches:
    day, month, year = match.group(0).split("/")
    database_date = f"{year}-{month}-{day}"

    context_start = text.rfind("\n", 0, match.start()) + 1
    context_end = text.find("\n", match.end())

    if context_end == -1:
      context_end = len(text)
    context = text[context_start:context_end]

    context_lower = context.lower()

    score = 0

    if "expiry" in context_lower:
      score += 10

    if "expires" in context_lower:
      score += 10

    if "valid until" in context_lower:
      score += 10

    if "valid till" in context_lower:
      score += 10

    if "birth" in context_lower:
      score -= 10

    if "issue" in context_lower:
      score -= 5

    date_candidates.append({
      "date": database_date,
      "context": context,
      "score": score
    })


  if date_candidates:
    best_candidate = max(date_candidates, key=lambda candidate: candidate["score"])
    return best_candidate["date"]

  return None 



def find_date_options(text: str) -> list[str]:
    date_pattern = r"\b\d{2}/\d{2}/\d{4}\b"

    matches = re.finditer(date_pattern, text)
    date_options = []

    for match in matches:
        day, month, year = match.group(0).split("/")
        database_date = f"{year}-{month}-{day}"

        try:
          datetime.strptime(database_date, "%Y-%m-%d")
        except ValueError:
          continue 
        

        if database_date not in date_options:
            date_options.append(database_date)

    return date_options