mod audio;
mod commands;
mod db;

use commands::AppState;
use std::sync::Mutex;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            let app_handle = app.handle().clone();

            tauri::async_runtime::block_on(async move {
                let pool = db::init_db()
                    .await
                    .expect("Failed to initialize database");

                let sidecar_port = portpicker::pick_unused_port().unwrap_or(8765);
                let server_port = portpicker::pick_unused_port().unwrap_or(3001);

                let state = AppState {
                    db: pool,
                    sidecar_port,
                    server_port,
                    recorder: Mutex::new(audio::AudioRecorder::new()),
                };

                app_handle.manage(state);

                let resource_dir = app_handle
                    .path()
                    .resource_dir()
                    .expect("Failed to resolve resource dir");

                // Spawn Node.js server
                let server_dir = resource_dir.join("server");
                let server_port_str = server_port.to_string();
                spawn_node_server(&server_dir, &server_port_str);

                // Spawn Python AI sidecar
                let sidecar_dir = resource_dir.join("sidecar");
                let sidecar_port_str = sidecar_port.to_string();
                spawn_python_sidecar(&sidecar_dir, &sidecar_port_str);
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_audio_devices,
            commands::start_recording,
            commands::stop_recording,
            commands::pause_recording,
            commands::get_sessions,
            commands::get_session_transcript,
            commands::delete_session,
            commands::upload_material,
            commands::list_materials,
            commands::delete_material,
            commands::list_notes,
            commands::get_note,
            commands::save_note,
            commands::generate_note,
            commands::set_llm_backend,
            commands::download_model,
            commands::get_sidecar_health,
            commands::get_server_port,
            commands::get_sidecar_port,
            commands::export_transcript,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn spawn_node_server(server_dir: &std::path::Path, port: &str) {
    let entry = server_dir.join("index.js");
    let port = port.to_string();
    let dir = server_dir.to_path_buf();

    std::thread::spawn(move || {
        match std::process::Command::new("node")
            .arg(&entry)
            .env("PORT", &port)
            .current_dir(&dir)
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::piped())
            .spawn()
        {
            Ok(child) => {
                println!("Node.js server started on port {} (pid {})", port, child.id());
            }
            Err(e) => {
                eprintln!(
                    "Failed to start Node.js server: {}. Make sure Node.js is installed.",
                    e
                );
            }
        }
    });
}

fn spawn_python_sidecar(sidecar_dir: &std::path::Path, port: &str) {
    let entry = sidecar_dir.join("main.py");
    let port = port.to_string();
    let dir = sidecar_dir.to_path_buf();

    std::thread::spawn(move || {
        let python = find_python();
        match std::process::Command::new(&python)
            .arg(&entry)
            .arg("--port")
            .arg(&port)
            .current_dir(&dir)
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::piped())
            .spawn()
        {
            Ok(child) => {
                println!(
                    "AI sidecar started on port {} (pid {}, python={})",
                    port,
                    child.id(),
                    python
                );
            }
            Err(e) => {
                eprintln!(
                    "Failed to start AI sidecar: {}. Make sure Python 3.10+ is installed with the required packages.",
                    e
                );
            }
        }
    });
}

fn find_python() -> String {
    for name in &["python3", "python"] {
        if std::process::Command::new(name)
            .arg("--version")
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .status()
            .is_ok()
        {
            return name.to_string();
        }
    }
    "python".to_string()
}
