from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles

app = FastAPI()

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

app.mount("/", StaticFiles(directory="static", html=True), name = "static")