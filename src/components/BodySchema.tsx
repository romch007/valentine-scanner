import { Problem } from "../data/problems";

interface BodySchemaProps {
    problems: Problem[];
    visibleProblems: Problem[];
    selectedProblem: Problem | null;
    onSelectProblem: (p: Problem) => void;
}

const BodySchema = ({ visibleProblems, selectedProblem, onSelectProblem }: BodySchemaProps) => {
    return (
        <div className="relative w-48 h-[420px] mx-auto">
            {/* Body silhouette SVG */}
            <svg
                viewBox="0 0 100 200"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Head */}
                <ellipse
                    cx="50"
                    cy="22"
                    rx="12"
                    ry="14"
                    className="fill-muted stroke-border"
                    strokeWidth="0.5"
                />
                {/* Neck */}
                <rect
                    x="46"
                    y="36"
                    width="8"
                    height="8"
                    rx="2"
                    className="fill-muted stroke-border"
                    strokeWidth="0.5"
                />
                {/* Torso */}
                <path
                    d="M34 44 Q32 44 30 50 L28 80 Q28 90 34 95 L40 100 L60 100 L66 95 Q72 90 72 80 L70 50 Q68 44 66 44 Z"
                    className="fill-muted stroke-border"
                    strokeWidth="0.5"
                />
                {/* Left arm */}
                <path
                    d="M30 50 Q22 55 18 70 L16 90 Q15 94 18 95 L22 94 Q24 93 25 88 L28 72 L30 60"
                    className="fill-muted stroke-border"
                    strokeWidth="0.5"
                />
                {/* Right arm */}
                <path
                    d="M70 50 Q78 55 82 70 L84 90 Q85 94 82 95 L78 94 Q76 93 75 88 L72 72 L70 60"
                    className="fill-muted stroke-border"
                    strokeWidth="0.5"
                />
                {/* Left leg */}
                <path
                    d="M40 100 L38 130 L36 160 Q35 170 34 175 L32 185 Q31 190 35 192 L40 192 Q43 191 43 188 L42 175 L44 155 L46 130 L48 100"
                    className="fill-muted stroke-border"
                    strokeWidth="0.5"
                />
                {/* Right leg */}
                <path
                    d="M60 100 L62 130 L64 160 Q65 170 66 175 L68 185 Q69 190 65 192 L60 192 Q57 191 57 188 L58 175 L56 155 L54 130 L52 100"
                    className="fill-muted stroke-border"
                    strokeWidth="0.5"
                />
            </svg>

            {/* Radar dots */}
            {visibleProblems.map((problem) => (
                <button
                    key={problem.id}
                    onClick={() => onSelectProblem(problem)}
                    className={`radar-dot cursor-pointer z-10 ${
                        selectedProblem?.id === problem.id ? "scale-150" : ""
                    }`}
                    style={{
                        left: `${problem.position.x}%`,
                        top: `${problem.position.y}%`,
                    }}
                    title={problem.label}
                />
            ))}
        </div>
    );
};

export default BodySchema;
