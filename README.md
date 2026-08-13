# Keepr
Keepr is a local-first document vault that I am building to help people store, organize, and find important personal or family documents securely.

I am building this project in phases while learning full-stack development, frontend/backend communication, databases, OCR, search, AI/ML, encryption, Git, and GitHub. The first goal was to build a small local app that can choose a non-sensitive sample document, send it to a Python backend, and display backend-confirmed file details.

## Why I am building this

Important documents are usually spread across folders, email, Whatsapp, cloud etc. and searching for them becomes a task sometimes. Keepr is supposed to bring them into one private, organized place.

The long-term idea is that Keepr can understand documents with OCR and AI, but the user should stay in control of what gets saved and how documents are labelled.

## Features

- Local FastAPI backend
- Basic frontend served from FastAPI
- Simple welcome page
- Sample document picker
- Supports choosing PDF and image files
- Sends selected files from the browser to the backend
- Backend receives uploaded files using FastAPI
- Displays backend-confirmed filename
- Displays backend-confirmed content type
- Displays backend-confirmed file size
- Uses SQLite for local document metadata
- Saves document metadata only after the user clicks `Save Document`
- Displays the five most recent saved document records
- Formats saved dates into friendly labels such as `Today`, `Yesterday`, or a short date
- Formats raw content types into friendlier labels such as `PNG image` and `PDF`
- Uses a local Python virtual environment
- Stores dependencies in `requirements.txt`
- Keeps `.venv`, `.env`, database files, and future vault data out of Git

## Current Limitations

- Files are previewed and metadata is stored, but the actual files are not stored yet
- The database currently stores only basic file metadata
- No document owners or people system yet
- No OCR yet
- No search yet
- No encryption yet
- Keepr should not be used with real personal documents yet

## Tech Stack

- Python
- FastAPI
- Uvicorn
- HTML
- CSS
- JavaScript
- Git
- GitHub

## Project Structure

```text
app/
  main.py          # FastAPI app, API routes, upload preview route, and static file serving
  database.py      # SQLite connection, table creation, and document metadata helpers

static/
  index.html      # Frontend page
  styles.css      # Page styling
  app.js          # Frontend JavaScript

requirements.txt  # Python dependencies
README.md         # Project notes and setup instructions
.gitignore        # Files and folders Git should ignore
```

## Setup

Clone the repository:
```powershell
git clone https://github.com/aimannabeel/keepr.git
cd keepr
```
Create a virtual environment:
```powershell
python -m venv .venv
```
Activate the virtual environment on Windows PowerShell:
```powershell
.\.venv\Scripts\Activate.ps1
```
Install dependencies:
```powershell
python -m pip install -r requirements.txt
```
Run the local server:
```powershell
uvicorn app.main:app --reload --reload-dir app --reload-dir static
```
Open the app in your browser:
```text
http://127.0.0.1:8000
```
Check the backend health route:
```text
http://127.0.0.1:8000/api/health
```

## Project Roadmap

### Phase 1: Local App Basics

- [x] Set up Python project
- [x] Set up Git and GitHub
- [x] Create FastAPI backend
- [x] Serve a basic frontend from FastAPI
- [x] Add a sample document picker
- [x] Send selected file from browser to backend
- [x] Return backend-confirmed file details
- [x] Display filename, content type, and size in the browser

### Phase 2: Basic Metadata and Database

- [x] Add SQLite database
- [x] Create documents table
- [x] Add document metadata save helper
- [x] Add intentional document save flow
- [x] Store metadata only after the user confirms saving the document
- [x] Add API route for listing recent saved document records
- [x] Render recent saved documents on the page
- [x] Limit homepage recent documents list to the latest 5 records
- [x] Format saved dates for display
- [x] Format content types for display

### Phase 3: Local File Storage

- [ ] Save uploaded files locally
- [ ] Generate internal document IDs
- [ ] Separate stored file names from user-facing document names
- [ ] Link stored files to database records
- [ ] Allow viewing or downloading stored files

### Phase 4: Organisation, Metadata Search and Browsing

- [ ] Add people/document owners
- [ ] Add document type field
- [ ] Add current/archive status
- [ ] Add expiry date field
- [ ] Add basic keyword search
- [ ] Add people-based browsing
- [ ] Add document cards
- [ ] Add aliases such as `pp` for passport
- [ ] Support searches like `dad pan` or `passport`

### Phase 5: OCR and Structured Metadata

- [ ] Add local OCR for PDFs/images
- [ ] Extract text from uploaded documents
- [ ] Detect document type
- [ ] Extract useful metadata such as dates and document numbers
- [ ] Let users confirm or edit extracted metadata

### Phase 6: Expiry Reminders

- [ ] Track expiry dates
- [ ] Show documents expiring soon
- [ ] Add simple reminder settings

### Phase 7: Privacy and Security

- [ ] Design encrypted local vault storage
- [ ] Add password-based unlocking
- [ ] Encrypt stored documents
- [ ] Protect sensitive metadata
- [ ] Define what data is allowed to leave the device
- [ ] Keep cloud AI optional and explicit

### Future AI / ML Direction

- [ ] Add document classification where useful
- [ ] Compare rule-based, local AI, and cloud AI approaches
- [ ] Investigate local embeddings or local models
- [ ] Explore training or fine-tuning a small model if it makes technical sense
- [ ] Keep AI features understandable and privacy-aware

## Privacy Note

Keepr is not ready for real personal documents yet.

During early development, only non-sensitive sample files should be used. Real personal documents should only be added after encrypted storage, careful metadata handling, and a clear privacy model are implemented.

The long-term goal is for Keepr to support a fully local/private mode where document information does not leave the device.

## Notes

This project is currently in active development.

Keepr is being built as both a serious personal project and a learning project. The goal is not just to finish the app, but to understand how each major part works.

```text
Storage, organisation, and presentation are separate concerns.
```