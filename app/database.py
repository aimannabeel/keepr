import sqlite3

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
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    """)

    connection.commit()
    connection.close()

def save_document(filename, content_type, size):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO documents(filename, content_type, size) VALUES (?, ?, ?)
        """, (filename, content_type, size))
    connection.commit()
    connection.close()
    
