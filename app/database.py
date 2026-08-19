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
            stored_filename TEXT,
            display_name TEXT,
            owner_name TEXT,
            document_type TEXT,
            tags TEXT,
            expiry_date TEXT
        )
    """)

    connection.commit()
    connection.close()

def save_document_metadata(filename, content_type, size, stored_filename, display_name, owner_name, document_type, tags, expiry_date):
    connection = get_connection()
    cursor = connection.cursor()
    created_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    cursor.execute("""
        INSERT INTO documents(filename, content_type, size, created_at, stored_filename, display_name, owner_name, document_type, tags, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (filename, content_type, size, created_at, stored_filename, display_name, owner_name, document_type, tags, expiry_date))
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
        """SELECT id, filename, content_type, size, created_at, display_name, owner_name, document_type, tags, expiry_date
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
            "display_name": row[5],
            "owner_name": row[6],
            "document_type": row[7],
            "tags": row[8],   
            "expiry_date": row[9]         
        })    
    return documents

def get_document_by_id(doc_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """SELECT id, filename, content_type, size, created_at, stored_filename, display_name, owner_name, document_type, tags, expiry_date
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
        "display_name": row[6],
        "owner_name": row[7],
        "document_type": row[8],
        "tags": row[9],
        "expiry_date": row[10]
    }

def update_document_metadata(document_id, display_name, owner_name, document_type, tags, expiry_date):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE documents
        SET display_name = ?,
            owner_name = ?,
            document_type = ?,
            tags = ?,
            expiry_date = ?
        WHERE id = ?
    """, (display_name, owner_name, document_type, tags, expiry_date, document_id))

    connection.commit()
    connection.close()

def delete_document_metadata_by_id(document_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """DELETE FROM documents WHERE id = ?""", (document_id,)
    )

    connection.commit()
    connection.close()
