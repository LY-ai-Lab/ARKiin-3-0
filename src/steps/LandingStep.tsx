import React from 'react';

interface LandingStepProps {
  hasApiKey: boolean;
  setHasApiKey: (has: boolean) => void;
  tasteDNA: any;
  setCurrentStep: (step: string) => void;
}

export const LandingStep: React.FC<LandingStepProps> = ({ hasApiKey, setHasApiKey, tasteDNA, setCurrentStep }) => {
  return (
    <div className="flex-1 max-w-5xl mx-auto flex flex-col items-center justify-center text-center space-y-8 animate-fade-in-up mt-20">
      <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight text-[#EAE9E6] max-w-4xl leading-tight">
        From inspiration to{" "}
        <span className="italic font-light text-[#B3A687]">
          executable
        </span>{" "}
        plan.
      </h1>
      <p className="text-xl text-[#91908C] max-w-2xl">
        ARK turns your floor plan into realistic interior design concepts
        with materials, costs, and timeplans.
      </p>
      <div className="pt-8 flex flex-col sm:flex-row items-center gap-4 justify-center">
        <button
          onClick={async () => {
             // @ts-ignore
            if (!hasApiKey && window.aistudio?.openSelectKey) {
               // @ts-ignore
              await window.aistudio.openSelectKey();
              setHasApiKey(true);
            }
            setCurrentStep("style-preferences");
          }}
          className="px-8 py-4 bg-[#2D4F4F] text-white font-semibold rounded-lg hover:bg-[#1D3F3F] transition-colors text-lg shadow-sm"
        >
          Start your design project
        </button>
        {tasteDNA && (
          <button
            onClick={() => setCurrentStep("upload-space")}
            className="px-8 py-4 bg-[#262523] border border-[#3A3937] text-white font-semibold rounded-lg hover:bg-[#302F2D] transition-colors text-lg shadow-sm"
          >
            Resume Project
          </button>
        )}
      </div>
    </div>
  );
};
