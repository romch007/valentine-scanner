import { useState } from "react";
import { SavedDiagnosis } from "../data/problems";

interface DiagnosisListProps {
    diagnoses: SavedDiagnosis[];
    onSchedule: (problemId: string, time: string) => void;
}

const DiagnosisList = ({ diagnoses, onSchedule }: DiagnosisListProps) => {
    const [schedulingId, setSchedulingId] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState("14:00");

    if (diagnoses.length === 0) return null;

    const hours = Array.from({ length: 16 }, (_, i) => {
        const h = i + 7;
        return `${h.toString().padStart(2, "0")}:00`;
    });

    return (
        <div className="space-y-3 animate-fade-in">
            <h3 className="text-lg font-semibold text-foreground">Diagnostics enregistrés</h3>

            {diagnoses.map((d) => (
                <div key={d.problemId} className="glass-panel rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{d.label}</span>
                        {d.scheduledTime && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                Prévu à {d.scheduledTime}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {d.selectedTreatments.map((t) => (
                            <span
                                key={t}
                                className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full"
                            >
                                {t}
                            </span>
                        ))}
                    </div>

                    {!d.scheduledTime && (
                        <>
                            {schedulingId === d.problemId ? (
                                <div className="flex items-center gap-2">
                                    <select
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="flex-1 rounded-xl bg-secondary px-3 py-2 text-sm text-foreground outline-hidden"
                                    >
                                        {hours.map((h) => (
                                            <option key={h} value={h}>
                                                {h}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => {
                                            onSchedule(d.problemId, selectedTime);
                                            setSchedulingId(null);
                                        }}
                                        className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
                                    >
                                        Confirmer
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setSchedulingId(d.problemId)}
                                    className="w-full rounded-xl bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                                >
                                    Planifier le traitement
                                </button>
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DiagnosisList;
