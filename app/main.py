from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

@app.get("/api/health")
def health_check():
    return {"message": "Keepr backend is running"}

app.mount("/", StaticFiles(directory="static", html=True), name = "static")
