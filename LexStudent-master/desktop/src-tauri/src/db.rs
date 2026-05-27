use sqlx::{sqlite::SqlitePoolOptions, Pool, Sqlite, Row};
use std::path::PathBuf;

pub type DbPool = Pool<Sqlite>;

pub fn get_data_dir() -> PathBuf {
    #[cfg(target_os = "windows")]
    {
        if let Some(appdata) = dirs::data_dir() {
            return appdata.join("LexScholar");
        }
    }
    #[cfg(not(target_os = "windows"))]
    {
        if let Some(home) = dirs::home_dir() {
            return home.join(".lexscholar");
        }
    }
    PathBuf::from(".lexscholar")
}

pub async fn init_db() -> Result<DbPool, Box<dyn std::error::Error>> {
    let data_dir = get_data_dir();
    std::fs::create_dir_all(&data_dir)?;

    let db_path = data_dir.join("lexscholar.db");
    let db_url = format!("sqlite:{}?mode=rwc", db_path.display());

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await?;

    sqlx::query("PRAGMA journal_mode=WAL").execute(&pool).await?;
    sqlx::query("PRAGMA foreign_keys=ON").execute(&pool).await?;

    run_migrations(&pool).await?;

    Ok(pool)
}

async fn run_migrations(pool: &DbPool) -> Result<(), Box<dyn std::error::Error>> {
    let schema = r#"
        CREATE TABLE IF NOT EXISTS modules (
            id TEXT PRIMARY KEY,
            course_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            order_index INTEGER DEFAULT 0,
            progress REAL DEFAULT 0.0
        );

        CREATE TABLE IF NOT EXISTS materials (
            id TEXT PRIMARY KEY,
            module_id TEXT NOT NULL,
            filename TEXT NOT NULL,
            file_path TEXT NOT NULL,
            page_count INTEGER DEFAULT 0,
            indexed INTEGER DEFAULT 0,
            uploaded_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            module_id TEXT,
            topic TEXT DEFAULT '',
            title TEXT DEFAULT '',
            created_at TEXT DEFAULT (datetime('now')),
            duration INTEGER DEFAULT 0,
            language TEXT DEFAULT 'en',
            model TEXT DEFAULT 'distil-large-v3',
            audio_path TEXT DEFAULT '',
            FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS segments (
            id TEXT PRIMARY KEY,
            session_id TEXT NOT NULL,
            text TEXT NOT NULL,
            t_start REAL DEFAULT 0.0,
            t_end REAL DEFAULT 0.0,
            speaker TEXT DEFAULT 'PROFESSOR',
            FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS lecture_notes (
            id TEXT PRIMARY KEY,
            session_id TEXT,
            module_id TEXT,
            title TEXT DEFAULT '',
            content_json TEXT DEFAULT '[]',
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL,
            FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS note_citations (
            id TEXT PRIMARY KEY,
            note_id TEXT NOT NULL,
            material_id TEXT,
            page_start INTEGER DEFAULT 0,
            page_end INTEGER DEFAULT 0,
            confidence TEXT DEFAULT 'HIGH',
            anchor_block_id TEXT DEFAULT '',
            FOREIGN KEY (note_id) REFERENCES lecture_notes(id) ON DELETE CASCADE,
            FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT DEFAULT ''
        );
    "#;

    for statement in schema.split(';') {
        let trimmed = statement.trim();
        if !trimmed.is_empty() {
            sqlx::query(trimmed).execute(pool).await?;
        }
    }

    Ok(())
}

pub async fn get_setting(pool: &DbPool, key: &str) -> Option<String> {
    sqlx::query_scalar::<_, String>("SELECT value FROM settings WHERE key = ?")
        .bind(key)
        .fetch_optional(pool)
        .await
        .ok()
        .flatten()
}

pub async fn set_setting(pool: &DbPool, key: &str, value: &str) -> Result<(), sqlx::Error> {
    sqlx::query("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
        .bind(key)
        .bind(value)
        .execute(pool)
        .await?;
    Ok(())
}
