from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from app.database import (create_tables,
                        save_document_metadata,
                        get_recent_document_rows,
                        get_all_document_rows, get_document_by_id,
                        update_document_metadata,
                        delete_document_metadata_by_id)
from app.storage import save_uploaded_file, STORAGE_DIR


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
async def create_document(
    document: UploadFile = File(...),
    display_name: str = Form(""),
    owner_name: str = Form(""),
    document_type: str = Form(""),
    tags: str = Form(""),
    expiry_date: str = Form("")
    ):
    stored_filename, file_size = await save_uploaded_file(document)

    save_document_metadata(document.filename, document.content_type, file_size, stored_filename, display_name, owner_name, document_type, tags, expiry_date,)

    return{
        "message": "Document saved",
        "filename": document.filename,
        "content_type": document.content_type,
        "size": file_size,
    }

@app.get("/api/documents")
def list_all_documents():
    return get_all_document_rows()


@app.get("/api/documents/recent")
def list_documents():
    return get_recent_document_rows()

@app.get("/api/documents/{document_id}/file")
def get_document_file(document_id: int):
    document = get_document_by_id(document_id)

    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")

    file_path = STORAGE_DIR / document["stored_filename"]

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Stored file not found")

    return FileResponse(
        path=file_path,
        media_type=document["content_type"],
    )

@app.get("/api/documents/{document_id}/download")
def download_document_file(document_id: int):
    document = get_document_by_id(document_id)
    
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    
    file_path = STORAGE_DIR / document["stored_filename"]
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Stored file not found")

    return FileResponse(
        path=file_path,
        media_type=document["content_type"],
        filename=document["filename"],
    )

@app.patch("/api/documents/{document_id}")
def update_document( 
    document_id: int,
    display_name: str = Form(""),
    owner_name: str = Form(""),
    document_type: str = Form(""),
    tags: str = Form(""),
    expiry_date: str = Form("")
    ):

    document = get_document_by_id(document_id)

    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")

    update_document_metadata(
        document_id,
        display_name,
        owner_name,
        document_type,
        tags,
        expiry_date,
    )

    return {"message": "Document updated"}

@app.delete("/api/documents/{document_id}")
def delete_document(document_id: int):
    document = get_document_by_id(document_id)

    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")

    file_path = STORAGE_DIR / document["stored_filename"]

    if file_path.exists():
        file_path.unlink()


    delete_document_metadata_by_id(document_id)
    return {"message": "Document deleted"}

app.mount("/", StaticFiles(directory="static", html=True), name="static")