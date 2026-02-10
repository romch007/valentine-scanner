import { useState, useEffect } from "react";
import { listen } from "@tauri-apps/api/event";

import PatientForm from "./components/PatientForm";
import BodyAnalysis from "./components/BodyAnalysis";

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
    const [activeScreen, setActiveScreen] = useState<"form" | "analysis">("form");

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

    return (
        <main>
            <div className="flex flex-col h-screen bg-background">
                {activeScreen === "form" ? (
                    <PatientForm onContinue={() => setActiveScreen("analysis")} />
                ) : (
                    <BodyAnalysis onBack={() => setActiveScreen("form")}/>
                )}
            </div>
        </main>
    );
}

export default App;
