import { useState, useCallback } from "react";

const BeautyScale = () => {
    const [photo, setPhoto] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(false);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            setPhoto(ev.target?.result as string);
            setResult(false);
            setAnalyzing(true);

            setTimeout(() => {
                setAnalyzing(false);
                setResult(true);
            }, 2500);
        };
        reader.readAsDataURL(file);
    }, []);

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-foreground">Échelle de beauté</label>

            <label className="glass-panel flex items-center justify-center rounded-2xl border-2 border-dashed border-primary/20 p-8 cursor-pointer hover:border-primary/40 transition-colors">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
                {photo ? (
                    <img
                        src={photo}
                        alt="Photo importée"
                        className="max-h-40 rounded-xl object-cover"
                    />
                ) : (
                    <div className="text-center text-muted-foreground">
                        <div className="text-3xl mb-2">📷</div>
                        <p className="text-sm">Importer une photo</p>
                    </div>
                )}
            </label>

            {analyzing && (
                <div className="glass-panel rounded-2xl p-6 text-center animate-fade-in">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Analyse de l'image en cours…</span>
                    </div>
                </div>
            )}

            {result && (
                <div className="glass-panel-strong rounded-2xl p-6 text-center animate-fade-in">
                    <div className="text-4xl font-bold text-primary mb-2">+∞ / 10</div>
                    <p className="text-sm text-muted-foreground">
                        ⚠️ L'échelle est cassée — le résultat est beaucoup trop élevé.
                    </p>
                    <p className="text-xs text-primary/60 mt-1">Beauté hors normes détectée ♥</p>
                </div>
            )}
        </div>
    );
};

export default BeautyScale;
