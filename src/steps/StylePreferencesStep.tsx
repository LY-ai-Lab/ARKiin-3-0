import React from 'react';
import { Heart, ArrowRight } from "lucide-react";
import { HeartRating, StylePreference } from '../shared/types/global';
import { INTERIOR_IMAGES } from '../shared/constants/images';

interface StylePreferencesStepProps {
  discoveryIdx: number;
  prefs: StylePreference[];
  handleRating: (rating: HeartRating) => void;
}

export const StylePreferencesStep: React.FC<StylePreferencesStepProps> = ({ discoveryIdx, prefs, handleRating }) => {
  return (
    <div className="max-w-[800px] mx-auto w-full flex flex-col justify-center animate-fade-in-up flex-1 pt-6 pb-12">
      {/* Progress info */}
      <div className="w-full flex justify-between text-sm text-[#B3A687] mb-4 font-medium px-2">
        <span>
          Image <strong className="text-white">{discoveryIdx + 1}</strong> of {INTERIOR_IMAGES.length}
        </span>
        <span>{prefs.length} rated • 0% confidence</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-[#2A2927] rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-[#3A3937] rounded-full transition-all duration-300"
          style={{
            width: `${(discoveryIdx / INTERIOR_IMAGES.length) * 100}%`,
          }}
        />
      </div>

      {/* Image Card */}
      <div className="w-full border border-[#2A2927] rounded-[14px] overflow-hidden flex flex-col mb-8" style={{ backgroundColor: "#1e1e1e" }}>
        {/* Header Label */}
        <div className="px-6 py-4 flex items-center" style={{ backgroundColor: "#2b2b2b" }}>
          <span className="text-sm font-medium text-[#EAE9E6]">
            {INTERIOR_IMAGES[discoveryIdx].label}
          </span>
        </div>
        
        <div className="flex justify-center items-center overflow-hidden h-[55vh] min-h-[450px] w-full" style={{ backgroundColor: "#1e1e1e" }}>
          <img
            src={INTERIOR_IMAGES[discoveryIdx].url}
            className="w-full h-full object-cover"
            alt={INTERIOR_IMAGES[discoveryIdx].label}
          />
        </div>
      </div>

      {/* Rating Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => handleRating(1 as HeartRating)}
          className="h-[46px] px-8 rounded-[12px] border border-[#3A3937] text-[#EAE9E6] hover:bg-[#2A2A2A] transition-all flex items-center justify-center focus:outline-none"
          style={{ backgroundColor: "transparent" }}
        >
          <Heart className="w-5 h-5 opacity-80 text-[#8C8A85]" strokeWidth={1.5} />
        </button>
        <button
          onClick={() => handleRating(2 as HeartRating)}
          className="h-[46px] px-8 rounded-[12px] border border-[#3A3937] text-[#EAE9E6] hover:bg-[#2A2A2A] transition-all flex items-center justify-center gap-1 focus:outline-none"
          style={{ backgroundColor: "transparent" }}
        >
          <Heart className="w-5 h-5 opacity-80 text-[#8C8A85]" strokeWidth={1.5} />
          <Heart className="w-5 h-5 opacity-80 text-[#8C8A85]" strokeWidth={1.5} />
        </button>
        <button
          onClick={() => handleRating(3 as HeartRating)}
          className="h-[46px] px-8 rounded-[12px] border border-[#3A3937] text-[#EAE9E6] hover:bg-[#2A2A2A] transition-all flex items-center justify-center gap-1 focus:outline-none"
          style={{ backgroundColor: "transparent" }}
        >
          <Heart className="w-5 h-5 opacity-80 text-[#8C8A85]" strokeWidth={1.5} />
          <Heart className="w-5 h-5 opacity-80 text-[#8C8A85]" strokeWidth={1.5} />
          <Heart className="w-5 h-5 opacity-80 text-[#8C8A85]" strokeWidth={1.5} />
        </button>
        <button
          onClick={() => handleRating("SKIP")}
          className="h-[46px] px-6 rounded-[12px] border border-[#3A3937] text-[#EAE9E6] hover:bg-[#2A2A2A] transition-all flex items-center justify-center gap-2 text-sm font-medium focus:outline-none ml-2"
          style={{ backgroundColor: "transparent" }}
        >
          <ArrowRight className="w-4 h-4 opacity-80 text-[#8C8A85]" /> Skip
        </button>
      </div>

      {/* Footer text */}
      <p className="text-xs text-center text-[#7A7975] opacity-80">
        Rate at least 8 images to discover your style •{" "}
        {Math.max(0, 8 - prefs.length)} more needed
      </p>
    </div>
  );
};
