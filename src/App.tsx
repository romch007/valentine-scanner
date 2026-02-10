import { useState, useEffect } from "react";
import { listen } from "@tauri-apps/api/event";

import PatientForm from "./components/PatientForm";
import BodyAnalysis from "./components/BodyAnalysis";

function App() {
    const [activeScreen, setActiveScreen] = useState<"form" | "analysis">("form");

    const [bleStatus, setBleStatus] = useState<string>("Initializing...");
    const [notified, setNotified] = useState<boolean>(false);

    useEffect(() => {
        // Listen for BLE status updates
        const unlistenStatus = listen<string>("ble-status", (event) => {
            setBleStatus(event.payload);
        });

        // Listen for BLE notifications
        const unlistenNotifications = listen("ble-notification", () => setNotified(true));

        return () => {
            unlistenStatus.then((fn) => fn());
            unlistenNotifications.then((fn) => fn());
        };
    }, []);

    return (
        <main>
            <div className="flex flex-col h-screen bg-background">
                <span className="absolute right-4 bottom-4 text-sm text-muted-foreground">
                    {bleStatus}
                </span>
                {activeScreen === "form" ? (
                    <PatientForm onContinue={() => setActiveScreen("analysis")} />
                ) : (
                    <BodyAnalysis
                        onBack={() => setActiveScreen("form")}
                        notified={notified}
                        setNotified={setNotified}
                    />
                )}
            </div>
        </main>
    );
}

export default App;
