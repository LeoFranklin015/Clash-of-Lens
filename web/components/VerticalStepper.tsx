import React from "react";

interface VerticalStep {
  label: string;
  activeColor?: string;
}

interface VerticalStepperProps {
  steps: VerticalStep[];
  currentStep: number;
  completedSteps: number[];
}

export const VerticalStepper: React.FC<VerticalStepperProps> = ({
  steps,
  currentStep,
  completedSteps,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {steps.map((step, idx) => {
        const isCompleted = completedSteps.includes(idx);
        const isActive = idx === currentStep;
        return (
          <div key={idx} className="flex items-center gap-3">
            <span
              className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all
                ${
                  isCompleted
                    ? "bg-white border-white text-black"
                    : isActive
                    ? "bg-lime-500 border-lime-500 text-black"
                    : "bg-transparent border-gray-600 text-gray-600"
                }
              `}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            <span
              className={`text-lg font-medium transition-all
                ${
                  isCompleted
                    ? "text-white"
                    : isActive
                    ? "text-lime-400"
                    : "text-gray-400"
                }
              `}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
