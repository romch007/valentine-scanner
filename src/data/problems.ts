export interface Problem {
    id: string;
    label: string;
    description: string;
    treatments: string[];
    position: { x: number; y: number };
}

export interface SavedDiagnosis {
    problemId: string;
    label: string;
    selectedTreatments: string[];
    scheduledTime?: string;
}

export const PROBLEMS: Problem[] = [
    {
        id: "pieds",
        label: "Pieds",
        description: "Sensibilité excessive détectée au niveau des pieds",
        treatments: ["Papouilles", "Pédicure"],
        position: { x: 50, y: 92 },
    },
    {
        id: "ventre",
        label: "Ventre",
        description: "Tension abdominale nécessitant une attention particulière",
        treatments: ["Repas", "Pet"],
        position: { x: 50, y: 58 },
    },
    {
        id: "main",
        label: "Main",
        description: "Carence affective détectée au niveau de la main",
        treatments: ["Fleur", "Bague de mariage"],
        position: { x: 28, y: 62 },
    },
    {
        id: "dos",
        label: "Dos",
        description: "Tensions musculaires détectées dans la zone dorsale",
        treatments: ["Massage", "Étirements"],
        position: { x: 58, y: 42 },
    },
    {
        id: "bouche",
        label: "Bouche",
        description: "Déficit d'affection buccale constaté",
        treatments: ["Baiser", "Rouge à lèvres"],
        position: { x: 50, y: 18 },
    },
    {
        id: "visage",
        label: "Peau du visage",
        description: "Qualité de peau nécessitant un traitement spécifique",
        treatments: ["Soin de la peau"],
        position: { x: 40, y: 13 },
    },
    {
        id: "parties",
        label: "Parties génitales",
        description: "Zone nécessitant une stimulation thérapeutique",
        treatments: ["Orgasme (masturbation)", "Orgasme (cunnilingus)", "Orgasme (rapport)"],
        position: { x: 50, y: 67 },
    },
];
