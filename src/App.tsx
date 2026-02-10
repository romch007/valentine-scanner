import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import "./App.css";

type EventPayload = {
    data: number[];
    data_string: string;
};

type Notification = {
    timestamp: string;
    data: string;
    raw: number[];
};

function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");
    const [bleStatus, setBleStatus] = useState<string>("Initializing...");
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // Listen for BLE status updates
        const unlistenStatus = listen<string>("ble-status", (event) => {
            setBleStatus(event.payload);
        });

        // Listen for BLE notifications
        const unlistenNotifications = listen<EventPayload>("ble-notification", (event) => {
            const notification: EventPayload = event.payload;
            setNotifications((prev) => [
                {
                    timestamp: new Date().toLocaleTimeString(),
                    data: notification.data_string,
                    raw: notification.data,
                },
                ...prev.slice(0, 9), // Keep last 10 notifications
            ]);
        });

        return () => {
            unlistenStatus.then((fn) => fn());
            unlistenNotifications.then((fn) => fn());
        };
    }, []);

    async function greet() {
        setGreetMsg(await invoke("greet", { name }));
    }

    return (
        <main className="container">
            <h1>Welcome to Tauri + React + BLE</h1>

            <div className="row">
                <a href="https://vite.dev" target="_blank">
                    <img src="/vite.svg" className="logo vite" alt="Vite logo" />
                </a>
                <a href="https://tauri.app" target="_blank">
                    <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>

            <div style={{ marginTop: "2rem" }}>
                <h2>BLE Status</h2>
                <p
                    style={{
                        padding: "1rem",
                        background: "#f0f0f0",
                        borderRadius: "4px",
                        fontWeight: "bold",
                    }}
                >
                    {bleStatus}
                </p>
            </div>

            <div style={{ marginTop: "2rem" }}>
                <h2>BLE Notifications</h2>
                <div
                    style={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "1rem",
                    }}
                >
                    {notifications.length === 0 ? (
                        <p>Waiting for notifications...</p>
                    ) : (
                        notifications.map((notif, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: "0.5rem",
                                    margin: "0.5rem 0",
                                    background: "#e8f5e9",
                                    borderRadius: "4px",
                                    borderLeft: "4px solid #4caf50",
                                }}
                            >
                                <strong>{notif.timestamp}:</strong> {notif.data}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div style={{ marginTop: "2rem" }}>
                <h2>Greet Function</h2>
                <form
                    className="row"
                    onSubmit={(e) => {
                        e.preventDefault();
                        greet();
                    }}
                >
                    <input
                        id="greet-input"
                        onChange={(e) => setName(e.currentTarget.value)}
                        placeholder="Enter a name..."
                    />
                    <button type="submit">Greet</button>
                </form>
                <p>{greetMsg}</p>
            </div>
        </main>
    );
}

export default App;
