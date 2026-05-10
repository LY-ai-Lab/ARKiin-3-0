import React from 'react';
import { steps } from '../constants/steps';
import { cn } from '../utils/cn';

interface WizardNavProps {
  currentStep: string;
  completedSteps: string[];
  setCurrentStep: (stepId: string) => void;
}

export const WizardNav: React.FC<WizardNavProps> = ({ currentStep, completedSteps, setCurrentStep }) => {
  const r = steps.findIndex((s) => s.id === currentStep);
  return (
    <div className="bg-[#121212] border-b border-[#2A2A2A] px-6 py-4">
      <div className="max-w-[70rem] mx-auto flex items-center justify-center">
        {steps.map((s, i) => {
          const o = completedSteps.includes(s.id);
          const a = s.id === currentStep;
          const l = o || i <= r;
          return (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => l && setCurrentStep(s.id)}
                className={cn(
                  "flex flex-col items-center sm:flex-row sm:items-center gap-3 transition-colors",
                  l ? "cursor-pointer" : "cursor-not-allowed opacity-50",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 shrink-0",
                    a
                      ? "bg-[#2D4F4F] text-white"
                      : "bg-[#1A1A1A] border border-[#2A2A2A] text-[#8C8A85]",
                  )}
                >
                  {s.number}
                </div>
                <span
                  className={cn(
                    "text-xs sm:text-sm font-medium transition-colors text-center sm:text-left whitespace-pre-line leading-snug",
                    a ? "text-white" : "text-[#6E6D68]",
                  )}
                >
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div className="w-6 sm:w-12 mx-3 sm:mx-6 h-px bg-[#2A2A2A]"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
