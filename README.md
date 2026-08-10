# Keepr
Keepr is a local-first document vault that I am building to help people store, organize, and find important personal or family documents securely.

The goal is to let a user upload documents once, then search for them later using normal language, like "passport expiring soon" or "Jake's insurance papers".

## Why I am building this

Important documents are usually spread across folders, email, Whatsapp, cloud etc. and searching for them becomes a task sometimes. Keepr is supposed to bring them into one private, organized place.

The long-term idea is that Keepr can understand documents with OCR and AI, but the user should stay in control of what gets saved and how documents are labelled.

## First milestone

The first milestone is really small.

It will let me choose a non-sensitive sample PDF or image from my computer and show basic details about it, such as:

- filename
- file type
- file size

This first milestone is only to prove the basic flow

## Privacy note

This project should not be used with real personal documents yet.

Before using real documents, I need to build proper encrypted storage and think carefully about what data is allowed to leave the computer.

## Tech I plan to use

- Python for the local backend
- FastAPI for the local API
- HTML, CSS, and JavaScript for the first interface
- SQLite later for storing document metadata

## Current status

This project is at the setup stage. The Python virtual environment and initial dependencies are installed.