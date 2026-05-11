import React from 'react';
import { X, Layout, Dna } from "lucide-react";
import { UserTasteDNA } from '../shared/types/global';

interface UploadSpaceStepProps {
  tasteDNA: UserTasteDNA | null;
  roomImg: string | null;
  setRoomImg: (img: string | null) => void;
  loading: boolean;
  analyzeSpace: () => void;
}

export const UploadSpaceStep: React.FC<UploadSpaceStepProps> = ({ tasteDNA, roomImg, setRoomImg, loading, analyzeSpace }) => {
  return (
    <div className="space-y-8 animate-fade-in-up max-w-2xl mx-auto pt-10">
      <div className="text-center space-y-2 mb-12">
        <h2 className="font-display text-4xl font-bold">
          Upload Your Floor Plan
        </h2>
        <p className="text-[#91908C] text-lg">
          We'll vectorize it to understand your space.
        </p>
      </div>

      {tasteDNA && (
        <div className="bg-[#262523] rounded-xl p-5 border border-[#3A3937] shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Dna className="w-4 h-4 text-[#4F857D]" />
            <h3 className="font-display text-base font-semibold text-[#EAE9E6]">
              Style DNA Synthesized
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-[#1A1918] border border-[#3A3937] px-3 py-1 rounded-full font-medium">
              {tasteDNA.primaryStyle}
            </span>
            <span className="bg-[#1A1918] border border-[#3A3937] px-3 py-1 rounded-full font-medium">
              {tasteDNA.energy > 60
                ? "Lively"
                : tasteDNA.energy < 40
                  ? "Calm"
                  : "Balanced"}
            </span>
            <span className="bg-[#1A1918] border border-[#3A3937] px-3 py-1 rounded-full font-medium">
              {tasteDNA.warmth > 60
                ? "Warm"
                : tasteDNA.warmth < 40
                  ? "Cool"
                  : "Neutral"}
            </span>
          </div>
        </div>
      )}

      <div className="bg-[#1B1A19] border-2 border-dashed border-[#3A3937] hover:border-[#4F857D] transition-colors rounded-xl p-12 text-center relative cursor-pointer group shadow-inner">
        {roomImg ? (
          <div className="relative aspect-[4/3]">
            <img
              src={roomImg}
              className="w-full h-full object-contain rounded-lg"
              alt="Uploaded floor plan"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRoomImg(null);
              }}
              className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-md hover:scale-105 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-[#91908C] group-hover:text-[#EAE9E6] transition-colors">
            <div className="w-16 h-16 bg-[#262523] rounded-full flex items-center justify-center mb-4">
              <Layout className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-lg mb-1">
              Click or drag & drop
            </h3>
            <p className="text-sm">JPG, PNG, PDF up to 10MB</p>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  const r = new FileReader();
                  r.onloadend = () => setRoomImg(r.result as string);
                  r.readAsDataURL(f);
                }
              }}
            />
          </div>
        )}
      </div>

      <button
        disabled={!roomImg || loading}
        onClick={analyzeSpace}
        className="w-full py-4 bg-[#2D4F4F] text-white font-semibold rounded-lg hover:bg-[#1D3F3F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-lg"
      >
        Analyze Floor Plan
      </button>
    </div>
  );
};
