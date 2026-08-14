from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from app.database import create_tables, save_document_metadata, get_document_rows
from app.storage import save_uploaded_file

app = FastAPI()
create_tables()


@app.get("/api/health")
def health_check():
    return {"message": "Keepr backend is running"}


@app.post("/api/documents/preview")
async def preview_document(document: UploadFile = File(...)):
    file_bytes = await document.read()

    return {
        "filename": document.filename,
        "content_type": document.content_type,
        "size": len(file_bytes)
    }

@app.post("/api/documents")
async def create_document(document: UploadFile = File(...)):
    stored_filename, file_size = await save_uploaded_file(document)

    save_document_metadata(document.filename, document.content_type, file_size, stored_filename,)

    return{
        "message": "Document saved",
        "filename": document.filename,
        "content_type": document.content_type,
        "size": file_size,
    }


@app.get("/api/documents")
def list_documents():
    return get_document_rows()

app.mount("/", StaticFiles(directory="static", html=True), name="static")