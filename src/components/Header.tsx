interface HeaderProps {
    activeScreen: "form" | "analysis";
    onBack?: () => void;
}

const Header = ({ activeScreen, onBack }: HeaderProps) => {
    return (
        <header className="glass-panel-strong px-6 py-4 flex items-center justify-center relative z-10">
            {activeScreen === "analysis" && onBack && (
                <button
                    onClick={onBack}
                    className="absolute left-4 flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
                >
                    <span className="text-lg">‹</span> Retour
                </button>
            )}

            <div className="flex items-center gap-2">
                <span className="text-primary text-lg">♥</span>
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                    Diagnostic Médical
                </h1>
            </div>
        </header>
    );
};

export default Header;
