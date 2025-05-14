import React from "react";

interface Step {
  title: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  index <= currentStep
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
                onClick={() => onStepClick && onStepClick(index)}
              >
                {index + 1}
              </div>
              <div className="mt-2 text-sm font-medium text-center">
                <div
                  className={`${
                    index <= currentStep ? "text-white" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 ${
                  index < currentStep ? "bg-purple-600" : "bg-gray-700"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
