import { useState } from "react";
import BeautyScale from "./BeautyScale";

interface PatientFormProps {
    onContinue: () => void;
}

const PatientForm = ({ onContinue }: PatientFormProps) => {
    const [form, setForm] = useState({
        prenom: "",
        nom: "",
        sexe: "",
        age: "",
    });

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-1">
                        Informations du patient
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Remplissez les informations ci-dessous pour commencer.
                    </p>
                </div>

                <div className="glass-panel rounded-2xl p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Prénom</label>
                        <input
                            type="text"
                            value={form.prenom}
                            onChange={(e) => handleChange("prenom", e.target.value)}
                            placeholder="Entrez le prénom"
                            className="w-full rounded-xl bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Nom</label>
                        <input
                            type="text"
                            value={form.nom}
                            onChange={(e) => handleChange("nom", e.target.value)}
                            placeholder="Entrez le nom"
                            className="w-full rounded-xl bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Sexe</label>
                        <div className="flex gap-2">
                            {["Féminin", "Masculin"].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleChange("sexe", option)}
                                    className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                        form.sexe === option
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "bg-secondary text-secondary-foreground hover:bg-muted"
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Âge</label>
                        <input
                            type="number"
                            value={form.age}
                            onChange={(e) => handleChange("age", e.target.value)}
                            placeholder="Entrez l'âge"
                            className="w-full rounded-xl bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                        />
                    </div>
                </div>

                <div className="glass-panel rounded-2xl p-6">
                    <BeautyScale />
                </div>

                <button
                    onClick={onContinue}
                    className="w-full rounded-xl bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    Continuer vers l'analyse
                </button>
            </div>
        </div>
    );
};

export default PatientForm;
