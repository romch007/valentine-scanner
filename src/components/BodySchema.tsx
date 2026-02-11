import { Problem } from "../data/problems";

import bodyOutline from "../assets/body.png";

interface BodySchemaProps {
    problems: Problem[];
    visibleProblems: Problem[];
    selectedProblem: Problem | null;
    onSelectProblem: (p: Problem) => void;
}

const BodySchema = ({ visibleProblems, selectedProblem, onSelectProblem }: BodySchemaProps) => {
    return (
        <div className="relative w-48 h-[420px] mx-auto">
            <img src={bodyOutline} alt="outline of human body" className="h-full m-auto" />

            {/* Radar dots */}
            {visibleProblems.map((problem) => (
                <button
                    key={problem.id}
                    onClick={() => onSelectProblem(problem)}
                    className={`radar-dot cursor-pointer z-10 ${
                        selectedProblem?.id === problem.id
                            ? "scale-150 -translate-x-1/2 -translate-y-1/2"
                            : ""
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
