use btleplug::api::{Central, Manager as _, Peripheral as _, ScanFilter};
use btleplug::platform::Manager;
use futures_util::StreamExt;
use serde::{Deserialize, Serialize};
use tauri::Emitter;
use uuid::Uuid;

const DEVICE_NAME: &str = "ValentineScanner";
const CHARACTERISTIC_UUID: &str = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

#[derive(Clone, Serialize, Deserialize)]
struct BleNotification {
    data: Vec<u8>,
    data_string: String,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

async fn ble_task(app: tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let char_uuid = Uuid::parse_str(CHARACTERISTIC_UUID)?;

    // Get Bluetooth adapter
    let manager = Manager::new().await?;
    let adapters = manager.adapters().await?;
    let adapter = adapters
        .into_iter()
        .next()
        .ok_or("No Bluetooth adapter found")?;

    println!("Starting BLE scan for device: {}", DEVICE_NAME);
    app.emit("ble-status", "Scanning for device...").ok();

    // Start scanning
    adapter.start_scan(ScanFilter::default()).await?;
    tokio::time::sleep(tokio::time::Duration::from_secs(5)).await;

    // Find device by name
    let peripherals = adapter.peripherals().await?;
    let mut device = None;

    for p in &peripherals {
        if let Ok(Some(props)) = p.properties().await {
            println!("Checking: {:?}", props.local_name);
            if let Some(name) = &props.local_name {
                if name.contains(DEVICE_NAME) {
                    device = Some(p.clone());
                    println!("Match found!");
                    break;
                }
            }
        }
    }

    let device = device.ok_or("Device not found")?;

    println!("Device found! Connecting...");
    app.emit("ble-status", "Device found! Connecting...").ok();

    // Connect to device
    device.connect().await?;
    println!("Connected! Discovering services...");
    app.emit("ble-status", "Connected! Discovering services...")
        .ok();

    device.discover_services().await?;

    // Find characteristic
    let characteristics = device.characteristics();
    let target_char = characteristics
        .iter()
        .find(|c| c.uuid == char_uuid)
        .ok_or("Characteristic not found")?;

    println!("Subscribing to notifications...");
    app.emit("ble-status", "Subscribed to notifications!").ok();

    // Subscribe to notifications
    device.subscribe(target_char).await?;

    println!("Listening for notifications...");

    // Listen for notifications
    let mut notification_stream = device.notifications().await?;

    while let Some(data) = notification_stream.next().await {
        let notification = BleNotification {
            data: data.value.clone(),
            data_string: String::from_utf8_lossy(&data.value).to_string(),
        };

        println!("Received notification: {:?}", notification.data_string);

        // Emit event to frontend
        app.emit("ble-notification", notification).ok();
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            let app_handle = app.handle().clone();

            // Start BLE connection on app startup
            tauri::async_runtime::spawn(async move {
                if let Err(e) = ble_task(app_handle).await {
                    eprintln!("BLE task error: {}", e);
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
