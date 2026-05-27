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

                // Spawn Node.js server sidecar
                let server_port_str = server_port.to_string();
                spawn_server_sidecar(&app_handle, &server_port_str);

                // Spawn Python AI sidecar
                let sidecar_port_str = sidecar_port.to_string();
                spawn_ai_sidecar(&app_handle, &sidecar_port_str);
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

fn spawn_server_sidecar(app: &tauri::AppHandle, port: &str) {
    use tauri_plugin_shell::ShellExt;
    let shell = app.shell();

    match shell
        .sidecar("binaries/lexscholar-server")
    {
        Ok(cmd) => {
            let cmd = cmd.env("PORT", port);
            match cmd.spawn() {
                Ok((_rx, _child)) => {
                    println!("Node.js server sidecar started on port {}", port);
                }
                Err(e) => {
                    eprintln!("Failed to spawn server sidecar: {}. Server may need to be run separately.", e);
                }
            }
        }
        Err(e) => {
            eprintln!("Server sidecar binary not found: {}. Run the web server separately.", e);
        }
    }
}

fn spawn_ai_sidecar(app: &tauri::AppHandle, port: &str) {
    use tauri_plugin_shell::ShellExt;
    let shell = app.shell();

    match shell
        .sidecar("binaries/lexscholar-ai-sidecar")
    {
        Ok(cmd) => {
            let cmd = cmd.args(["--port", port]);
            match cmd.spawn() {
                Ok((_rx, _child)) => {
                    println!("AI sidecar started on port {}", port);
                }
                Err(e) => {
                    eprintln!("Failed to spawn AI sidecar: {}. AI features may be unavailable.", e);
                }
            }
        }
        Err(e) => {
            eprintln!("AI sidecar binary not found: {}. Run the Python sidecar separately.", e);
        }
    }
}
