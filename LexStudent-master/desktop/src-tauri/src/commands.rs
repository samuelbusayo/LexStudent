use crate::audio::{self, AudioDevice};
use crate::db::{self, DbPool};
use serde::{Deserialize, Serialize};
use sqlx::Row;
use tauri::{AppHandle, Emitter, State};
use std::sync::Mutex;

pub struct AppState {
    pub db: DbPool,
    pub sidecar_port: u16,
    pub server_port: u16,
    pub recorder: Mutex<audio::AudioRecorder>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Session {
    pub id: String,
    pub module_id: Option<String>,
    pub topic: String,
    pub title: String,
    pub created_at: String,
    pub duration: i64,
    pub language: String,
    pub model: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Segment {
    pub id: String,
    pub session_id: String,
    pub text: String,
    pub t_start: f64,
    pub t_end: f64,
    pub speaker: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct LectureNote {
    pub id: String,
    pub session_id: Option<String>,
    pub module_id: Option<String>,
    pub title: String,
    pub content_json: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Material {
    pub id: String,
    pub module_id: String,
    pub filename: String,
    pub file_path: String,
    pub page_count: i64,
    pub indexed: bool,
    pub uploaded_at: String,
}

// ── Audio & Recording ──

#[tauri::command]
pub fn get_audio_devices() -> Vec<AudioDevice> {
    audio::list_input_devices()
}

#[tauri::command]
pub async fn start_recording(
    app: AppHandle,
    state: State<'_, AppState>,
    device_id: String,
    language: String,
    model: String,
    module_id: String,
    topic: String,
) -> Result<String, String> {
    let session_id = uuid::Uuid::new_v4().to_string();

    sqlx::query("INSERT INTO sessions (id, module_id, topic, title, language, model) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(&session_id)
        .bind(&module_id)
        .bind(&topic)
        .bind(&topic)
        .bind(&language)
        .bind(&model)
        .execute(&state.db)
        .await
        .map_err(|e| e.to_string())?;

    let recorder = state.recorder.lock().map_err(|e| e.to_string())?;
    recorder.start(app, state.sidecar_port, device_id)?;

    Ok(session_id)
}

#[tauri::command]
pub async fn stop_recording(
    app: AppHandle,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let recorder = state.recorder.lock().map_err(|e| e.to_string())?;
    recorder.stop();

    let _ = app.emit("recording-status", serde_json::json!({
        "state": "stopped",
        "duration": 0
    }));

    Ok(())
}

#[tauri::command]
pub async fn pause_recording(
    state: State<'_, AppState>,
) -> Result<(), String> {
    let recorder = state.recorder.lock().map_err(|e| e.to_string())?;
    recorder.pause();
    Ok(())
}

// ── Sessions ──

#[tauri::command]
pub async fn get_sessions(
    state: State<'_, AppState>,
    module_id: Option<String>,
) -> Result<Vec<Session>, String> {
    let rows = if let Some(mid) = module_id {
        sqlx::query("SELECT * FROM sessions WHERE module_id = ? ORDER BY created_at DESC")
            .bind(&mid)
            .fetch_all(&state.db)
            .await
    } else {
        sqlx::query("SELECT * FROM sessions ORDER BY created_at DESC")
            .fetch_all(&state.db)
            .await
    }
    .map_err(|e| e.to_string())?;

    let sessions: Vec<Session> = rows
        .iter()
        .map(|r| Session {
            id: r.get("id"),
            module_id: r.get("module_id"),
            topic: r.get("topic"),
            title: r.get("title"),
            created_at: r.get("created_at"),
            duration: r.get("duration"),
            language: r.get("language"),
            model: r.get("model"),
        })
        .collect();

    Ok(sessions)
}

#[tauri::command]
pub async fn get_session_transcript(
    state: State<'_, AppState>,
    session_id: String,
) -> Result<Vec<Segment>, String> {
    let rows = sqlx::query("SELECT * FROM segments WHERE session_id = ? ORDER BY t_start")
        .bind(&session_id)
        .fetch_all(&state.db)
        .await
        .map_err(|e| e.to_string())?;

    let segments: Vec<Segment> = rows
        .iter()
        .map(|r| Segment {
            id: r.get("id"),
            session_id: r.get("session_id"),
            text: r.get("text"),
            t_start: r.get("t_start"),
            t_end: r.get("t_end"),
            speaker: r.get("speaker"),
        })
        .collect();

    Ok(segments)
}

#[tauri::command]
pub async fn delete_session(
    state: State<'_, AppState>,
    session_id: String,
) -> Result<(), String> {
    sqlx::query("DELETE FROM sessions WHERE id = ?")
        .bind(&session_id)
        .execute(&state.db)
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}

// ── Materials ──

#[tauri::command]
pub async fn upload_material(
    app: AppHandle,
    state: State<'_, AppState>,
    module_id: String,
    file_path: String,
) -> Result<Material, String> {
    let data_dir = db::get_data_dir();
    let materials_dir = data_dir.join("materials").join(&module_id);
    std::fs::create_dir_all(&materials_dir).map_err(|e| e.to_string())?;

    let source = std::path::Path::new(&file_path);
    let filename = source
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("material.pdf")
        .to_string();

    let dest = materials_dir.join(&filename);
    std::fs::copy(&source, &dest).map_err(|e| e.to_string())?;

    let material_id = uuid::Uuid::new_v4().to_string();
    let dest_str = dest.to_string_lossy().to_string();

    sqlx::query("INSERT INTO materials (id, module_id, filename, file_path) VALUES (?, ?, ?, ?)")
        .bind(&material_id)
        .bind(&module_id)
        .bind(&filename)
        .bind(&dest_str)
        .execute(&state.db)
        .await
        .map_err(|e| e.to_string())?;

    // Trigger ingestion on the AI sidecar
    let port = state.sidecar_port;
    let mid = material_id.clone();
    let mod_id = module_id.clone();
    let fp = dest_str.clone();
    let app_clone = app.clone();

    tokio::spawn(async move {
        let client = reqwest::Client::new();
        let url = format!("http://127.0.0.1:{}/materials/ingest", port);
        match client
            .post(&url)
            .json(&serde_json::json!({
                "material_id": mid,
                "module_id": mod_id,
                "file_path": fp
            }))
            .send()
            .await
        {
            Ok(resp) => {
                if let Ok(body) = resp.json::<serde_json::Value>().await {
                    let pages = body.get("pages_indexed").and_then(|p| p.as_i64()).unwrap_or(0);
                    let _ = sqlx::query("UPDATE materials SET page_count = ?, indexed = 1 WHERE id = ?")
                        .bind(pages)
                        .bind(&mid)
                        .execute(&app_clone.state::<AppState>().db)
                        .await;
                    let _ = app_clone.emit("material-ingest-progress", serde_json::json!({
                        "material_id": mid,
                        "percent": 100,
                        "pages_indexed": pages
                    }));
                }
            }
            Err(e) => {
                let _ = app_clone.emit("sidecar-error", serde_json::json!({
                    "message": format!("Ingestion error: {}", e)
                }));
            }
        }
    });

    Ok(Material {
        id: material_id,
        module_id,
        filename,
        file_path: dest_str,
        page_count: 0,
        indexed: false,
        uploaded_at: chrono::Utc::now().to_rfc3339(),
    })
}

#[tauri::command]
pub async fn list_materials(
    state: State<'_, AppState>,
    module_id: String,
) -> Result<Vec<Material>, String> {
    let rows = sqlx::query("SELECT * FROM materials WHERE module_id = ? ORDER BY uploaded_at DESC")
        .bind(&module_id)
        .fetch_all(&state.db)
        .await
        .map_err(|e| e.to_string())?;

    let materials: Vec<Material> = rows
        .iter()
        .map(|r| Material {
            id: r.get("id"),
            module_id: r.get("module_id"),
            filename: r.get("filename"),
            file_path: r.get("file_path"),
            page_count: r.get("page_count"),
            indexed: r.get::<i32, _>("indexed") == 1,
            uploaded_at: r.get("uploaded_at"),
        })
        .collect();

    Ok(materials)
}

#[tauri::command]
pub async fn delete_material(
    state: State<'_, AppState>,
    material_id: String,
) -> Result<(), String> {
    // Remove from vector store
    let port = state.sidecar_port;
    let mid = material_id.clone();
    tokio::spawn(async move {
        let client = reqwest::Client::new();
        let _ = client
            .delete(format!("http://127.0.0.1:{}/materials/{}", port, mid))
            .send()
            .await;
    });

    sqlx::query("DELETE FROM materials WHERE id = ?")
        .bind(&material_id)
        .execute(&state.db)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

// ── Notes ──

#[tauri::command]
pub async fn list_notes(
    state: State<'_, AppState>,
    module_id: String,
) -> Result<Vec<LectureNote>, String> {
    let rows = sqlx::query("SELECT * FROM lecture_notes WHERE module_id = ? ORDER BY updated_at DESC")
        .bind(&module_id)
        .fetch_all(&state.db)
        .await
        .map_err(|e| e.to_string())?;

    let notes: Vec<LectureNote> = rows
        .iter()
        .map(|r| LectureNote {
            id: r.get("id"),
            session_id: r.get("session_id"),
            module_id: r.get("module_id"),
            title: r.get("title"),
            content_json: r.get("content_json"),
            created_at: r.get("created_at"),
            updated_at: r.get("updated_at"),
        })
        .collect();

    Ok(notes)
}

#[tauri::command]
pub async fn get_note(
    state: State<'_, AppState>,
    note_id: String,
) -> Result<LectureNote, String> {
    let row = sqlx::query("SELECT * FROM lecture_notes WHERE id = ?")
        .bind(&note_id)
        .fetch_one(&state.db)
        .await
        .map_err(|e| e.to_string())?;

    Ok(LectureNote {
        id: row.get("id"),
        session_id: row.get("session_id"),
        module_id: row.get("module_id"),
        title: row.get("title"),
        content_json: row.get("content_json"),
        created_at: row.get("created_at"),
        updated_at: row.get("updated_at"),
    })
}

#[tauri::command]
pub async fn save_note(
    state: State<'_, AppState>,
    note_id: String,
    content_json: String,
    title: String,
) -> Result<(), String> {
    sqlx::query("UPDATE lecture_notes SET content_json = ?, title = ?, updated_at = datetime('now') WHERE id = ?")
        .bind(&content_json)
        .bind(&title)
        .bind(&note_id)
        .execute(&state.db)
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn generate_note(
    app: AppHandle,
    state: State<'_, AppState>,
    session_id: String,
    module_id: String,
) -> Result<LectureNote, String> {
    let segments = get_session_transcript(state.inner().into(), session_id.clone()).await?;
    let transcript: String = segments.iter().map(|s| format!("[{}] {}", s.speaker, s.text)).collect::<Vec<_>>().join("\n");

    let session = sqlx::query("SELECT topic FROM sessions WHERE id = ?")
        .bind(&session_id)
        .fetch_one(&state.db)
        .await
        .map_err(|e| e.to_string())?;
    let topic: String = session.get("topic");

    let port = state.sidecar_port;
    let client = reqwest::Client::new();
    let url = format!("http://127.0.0.1:{}/notes/generate", port);

    let resp = client
        .post(&url)
        .json(&serde_json::json!({
            "session_id": session_id,
            "module_id": module_id,
            "transcript": transcript,
            "topic": topic,
        }))
        .timeout(std::time::Duration::from_secs(120))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let body: serde_json::Value = resp.json().await.map_err(|e| e.to_string())?;

    let note_id = uuid::Uuid::new_v4().to_string();
    let content = body.get("blocks").unwrap_or(&serde_json::json!([])).to_string();
    let note_title = body
        .get("title")
        .and_then(|t| t.as_str())
        .unwrap_or(&topic)
        .to_string();

    sqlx::query("INSERT INTO lecture_notes (id, session_id, module_id, title, content_json) VALUES (?, ?, ?, ?, ?)")
        .bind(&note_id)
        .bind(&session_id)
        .bind(&module_id)
        .bind(&note_title)
        .bind(&content)
        .execute(&state.db)
        .await
        .map_err(|e| e.to_string())?;

    // Save citations
    if let Some(citations) = body.get("citations").and_then(|c| c.as_array()) {
        for cit in citations {
            let cit_id = uuid::Uuid::new_v4().to_string();
            let _ = sqlx::query(
                "INSERT INTO note_citations (id, note_id, material_id, page_start, page_end, confidence, anchor_block_id) VALUES (?, ?, ?, ?, ?, ?, ?)"
            )
            .bind(&cit_id)
            .bind(&note_id)
            .bind(cit.get("material_id").and_then(|v| v.as_str()).unwrap_or(""))
            .bind(cit.get("page_start").and_then(|v| v.as_i64()).unwrap_or(0))
            .bind(cit.get("page_end").and_then(|v| v.as_i64()).unwrap_or(0))
            .bind(cit.get("confidence").and_then(|v| v.as_str()).unwrap_or("HIGH"))
            .bind(cit.get("anchor_block_id").and_then(|v| v.as_str()).unwrap_or(""))
            .execute(&state.db)
            .await;
        }
    }

    Ok(LectureNote {
        id: note_id,
        session_id: Some(session_id),
        module_id: Some(module_id),
        title: note_title,
        content_json: content,
        created_at: chrono::Utc::now().to_rfc3339(),
        updated_at: chrono::Utc::now().to_rfc3339(),
    })
}

// ── Settings ──

#[tauri::command]
pub async fn set_llm_backend(
    state: State<'_, AppState>,
    backend: String,
    api_key: Option<String>,
) -> Result<(), String> {
    // Persist to local SQLite
    db::set_setting(&state.db, "llm_backend", &backend)
        .await
        .map_err(|e| e.to_string())?;

    if let Some(ref key) = api_key {
        let key_name = format!("{}_api_key", backend);
        db::set_setting(&state.db, &key_name, key)
            .await
            .map_err(|e| e.to_string())?;
    }

    // Forward config to sidecar so it can load/switch the model
    let port = state.sidecar_port;
    let client = reqwest::Client::new();
    let mut body = serde_json::json!({ "backend": backend });
    if let Some(key) = api_key {
        body["api_key"] = serde_json::Value::String(key);
    }
    let _ = client
        .post(format!("http://127.0.0.1:{}/config/llm", port))
        .json(&body)
        .send()
        .await;

    Ok(())
}

#[tauri::command]
pub async fn download_model(
    app: AppHandle,
    state: State<'_, AppState>,
    model_type: String,
    model_name: String,
) -> Result<(), String> {
    let port = state.sidecar_port;
    let app_clone = app.clone();
    let mtype = model_type.clone();
    let model = model_name.clone();

    tokio::spawn(async move {
        let client = reqwest::Client::new();
        let url = format!("http://127.0.0.1:{}/models/download", port);
        match client
            .post(&url)
            .json(&serde_json::json!({ "type": mtype, "name": model }))
            .timeout(std::time::Duration::from_secs(1800))
            .send()
            .await
        {
            Ok(_) => {
                let _ = app_clone.emit("model-download-progress", serde_json::json!({
                    "model": model,
                    "percent": 100
                }));
            }
            Err(e) => {
                let _ = app_clone.emit("sidecar-error", serde_json::json!({
                    "message": format!("Model download error: {}", e)
                }));
            }
        }
    });

    Ok(())
}

#[tauri::command]
pub async fn get_sidecar_health(
    state: State<'_, AppState>,
) -> Result<serde_json::Value, String> {
    let port = state.sidecar_port;
    let client = reqwest::Client::new();
    let url = format!("http://127.0.0.1:{}/health", port);

    match client.get(&url).send().await {
        Ok(resp) => resp.json().await.map_err(|e| e.to_string()),
        Err(e) => Err(format!("AI sidecar not available: {}", e)),
    }
}

#[tauri::command]
pub fn get_server_port(state: State<'_, AppState>) -> u16 {
    state.server_port
}

#[tauri::command]
pub fn get_sidecar_port(state: State<'_, AppState>) -> u16 {
    state.sidecar_port
}

// ── Export ──

#[tauri::command]
pub async fn export_transcript(
    state: State<'_, AppState>,
    session_id: String,
    format: String,
) -> Result<String, String> {
    let segments = get_session_transcript(state.inner().into(), session_id).await?;

    match format.as_str() {
        "txt" => {
            Ok(segments
                .iter()
                .map(|s| format!("[{:.1}s] [{}] {}", s.t_start, s.speaker, s.text))
                .collect::<Vec<_>>()
                .join("\n"))
        }
        "srt" => {
            let mut srt = String::new();
            for (i, s) in segments.iter().enumerate() {
                let start_h = (s.t_start / 3600.0) as u32;
                let start_m = ((s.t_start % 3600.0) / 60.0) as u32;
                let start_s = (s.t_start % 60.0) as u32;
                let start_ms = ((s.t_start % 1.0) * 1000.0) as u32;
                let end_h = (s.t_end / 3600.0) as u32;
                let end_m = ((s.t_end % 3600.0) / 60.0) as u32;
                let end_s = (s.t_end % 60.0) as u32;
                let end_ms = ((s.t_end % 1.0) * 1000.0) as u32;
                srt.push_str(&format!(
                    "{}\n{:02}:{:02}:{:02},{:03} --> {:02}:{:02}:{:02},{:03}\n{}\n\n",
                    i + 1, start_h, start_m, start_s, start_ms,
                    end_h, end_m, end_s, end_ms, s.text
                ));
            }
            Ok(srt)
        }
        "json" => serde_json::to_string_pretty(&segments).map_err(|e| e.to_string()),
        _ => Err("Unsupported format".to_string()),
    }
}
