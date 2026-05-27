use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use std::sync::{Arc, Mutex, atomic::{AtomicBool, Ordering}};
use tauri::{AppHandle, Emitter};
use base64::Engine;

#[derive(Clone, serde::Serialize)]
pub struct AudioDevice {
    pub id: String,
    pub name: String,
}

pub fn list_input_devices() -> Vec<AudioDevice> {
    let host = cpal::default_host();
    let mut devices = Vec::new();

    if let Ok(input_devices) = host.input_devices() {
        for (i, device) in input_devices.enumerate() {
            let name = device.name().unwrap_or_else(|_| format!("Device {}", i));
            devices.push(AudioDevice {
                id: i.to_string(),
                name,
            });
        }
    }

    if devices.is_empty() {
        if let Some(default) = host.default_input_device() {
            let name = default.name().unwrap_or_else(|_| "Default Microphone".to_string());
            devices.push(AudioDevice {
                id: "default".to_string(),
                name,
            });
        }
    }

    devices
}

pub struct AudioRecorder {
    is_recording: Arc<AtomicBool>,
    is_paused: Arc<AtomicBool>,
    buffer: Arc<Mutex<Vec<i16>>>,
    sample_rate: u32,
}

impl AudioRecorder {
    pub fn new() -> Self {
        Self {
            is_recording: Arc::new(AtomicBool::new(false)),
            is_paused: Arc::new(AtomicBool::new(false)),
            buffer: Arc::new(Mutex::new(Vec::new())),
            sample_rate: 16000,
        }
    }

    pub fn start(
        &self,
        app: AppHandle,
        sidecar_port: u16,
        _device_id: String,
    ) -> Result<(), String> {
        let host = cpal::default_host();
        let device = host
            .default_input_device()
            .ok_or("No input device available")?;

        let config = cpal::StreamConfig {
            channels: 1,
            sample_rate: cpal::SampleRate(self.sample_rate),
            buffer_size: cpal::BufferSize::Default,
        };

        let is_recording = self.is_recording.clone();
        let is_paused = self.is_paused.clone();
        let buffer = self.buffer.clone();
        let chunk_size = (self.sample_rate * 5) as usize; // 5-second chunks

        is_recording.store(true, Ordering::SeqCst);
        is_paused.store(false, Ordering::SeqCst);

        let app_clone = app.clone();
        let port = sidecar_port;

        std::thread::spawn(move || {
            let stream = device.build_input_stream(
                &config,
                move |data: &[f32], _: &cpal::InputCallbackInfo| {
                    if !is_recording.load(Ordering::SeqCst) || is_paused.load(Ordering::SeqCst) {
                        return;
                    }
                    let samples: Vec<i16> = data
                        .iter()
                        .map(|&s| (s * 32767.0).clamp(-32768.0, 32767.0) as i16)
                        .collect();

                    let mut buf = buffer.lock().unwrap();
                    buf.extend_from_slice(&samples);

                    if buf.len() >= chunk_size {
                        let chunk: Vec<i16> = buf.drain(..chunk_size).collect();
                        let app_for_send = app_clone.clone();
                        let rt = tokio::runtime::Handle::current();
                        rt.spawn(async move {
                            send_chunk_to_sidecar(app_for_send, port, &chunk).await;
                        });
                    }
                },
                |err| {
                    eprintln!("Audio stream error: {}", err);
                },
                None,
            );

            match stream {
                Ok(s) => {
                    let _ = s.play();
                    while is_recording.load(Ordering::SeqCst) {
                        std::thread::sleep(std::time::Duration::from_millis(100));
                    }
                }
                Err(e) => {
                    eprintln!("Failed to build input stream: {}", e);
                }
            }
        });

        Ok(())
    }

    pub fn stop(&self) {
        self.is_recording.store(false, Ordering::SeqCst);
    }

    pub fn pause(&self) {
        let currently_paused = self.is_paused.load(Ordering::SeqCst);
        self.is_paused.store(!currently_paused, Ordering::SeqCst);
    }

    pub fn is_recording(&self) -> bool {
        self.is_recording.load(Ordering::SeqCst)
    }
}

async fn send_chunk_to_sidecar(app: AppHandle, port: u16, samples: &[i16]) {
    let bytes: Vec<u8> = samples
        .iter()
        .flat_map(|s| s.to_le_bytes())
        .collect();

    let audio_b64 = base64::engine::general_purpose::STANDARD.encode(&bytes);

    let client = reqwest::Client::new();
    let url = format!("http://127.0.0.1:{}/transcribe", port);

    match client
        .post(&url)
        .json(&serde_json::json!({
            "audio_b64": audio_b64,
            "language": "en",
            "model": "distil-large-v3"
        }))
        .send()
        .await
    {
        Ok(resp) => {
            if let Ok(body) = resp.json::<serde_json::Value>().await {
                if let Some(text) = body.get("text").and_then(|t| t.as_str()) {
                    if !text.trim().is_empty() {
                        let _ = app.emit("transcript-final", serde_json::json!({
                            "text": text,
                            "timestamp": chrono::Utc::now().to_rfc3339(),
                            "speaker": "PROFESSOR"
                        }));
                    }
                }
            }
        }
        Err(e) => {
            let _ = app.emit("sidecar-error", serde_json::json!({
                "message": format!("Transcription error: {}", e)
            }));
        }
    }
}
