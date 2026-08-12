from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from app.database import create_tables, save_document

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
def create_document(document: dict):
    save_document(
        document["filename"],
        document["content_type"],
        document["size"],
    )

    return {"message": "Document saved"}

app.mount("/", StaticFiles(directory="static", html=True), name = "static")