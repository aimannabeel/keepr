import sqlite3
from datetime import datetime, timezone

DATABASE_PATH = "keepr.db"


def get_connection():
    return sqlite3.connect(DATABASE_PATH)


def create_tables():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            content_type TEXT NOT NULL,
            size INTEGER NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            stored_filename TEXT
        )
    """)

    connection.commit()
    connection.close()

def save_document_metadata(filename, content_type, size, stored_filename):
    connection = get_connection()
    cursor = connection.cursor()
    created_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    cursor.execute("""
        INSERT INTO documents(filename, content_type, size, created_at, stored_filename) VALUES (?, ?, ?, ?, ?)
        """, (filename, content_type, size, created_at, stored_filename))
    connection.commit()
    connection.close()


def get_recent_document_rows():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT id, filename, content_type, size, created_at
        FROM documents
        ORDER BY created_at DESC
        LIMIT 5
    """)

    rows = cursor.fetchall()
    connection.close()

    documents = []

    for row in rows:
        documents.append({
            "id": row[0],
            "filename": row[1],
            "content_type": row[2],
            "size": row[3],
            "created_at": row[4],
        })


    return documents

def get_all_document_rows():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """SELECT id, filename, content_type, size, created_at
        FROM documents
        ORDER BY created_at DESC"""
    )

    rows = cursor.fetchall()
    connection.close()

    documents = []

    for row in rows:
        documents.append({
            "id": row[0],
            "filename": row[1],
            "content_type": row[2],
            "size": row[3],
            "created_at": row[4],            
        })    
    return documents

def get_document_by_id(doc_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """SELECT id, filename, content_type, size, created_at, stored_filename
        FROM documents
        WHERE id=?""", (doc_id,)
    )

    row = cursor.fetchone()
    connection.close()

    if row is None: 
        return None

    return {
        "id": row[0],
        "filename": row[1],
        "content_type": row[2],
        "size": row[3],
        "created_at": row[4],
        "stored_filename": row[5],
    }