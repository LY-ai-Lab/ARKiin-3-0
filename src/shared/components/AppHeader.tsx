import React from 'react';
import { FolderOpen, Save, Globe, HelpCircle } from "lucide-react";

export const AppHeader = () => (
  <header className="flex flex-col z-50 sticky top-0">
    <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A] bg-[#121212]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#2D4F4F] rounded-full flex items-center justify-center text-white font-serif">
          A
        </div>
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold tracking-wider text-[#EAE9E6]">
            ARK
          </span>
          <span className="font-display text-lg text-[#B3A687]">
            Interior Designer
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6 text-[#91908C] text-sm font-medium">
        <button className="flex items-center gap-2 hover:text-[#EAE9E6] transition-colors">
          <FolderOpen className="w-4 h-4" /> Load
        </button>
        <button className="flex items-center gap-2 hover:text-[#EAE9E6] transition-colors">
          <Save className="w-4 h-4" /> Save
        </button>
        <button className="flex items-center gap-2 hover:text-[#EAE9E6] transition-colors">
          <Globe className="w-4 h-4" /> EN
        </button>
        <button className="hover:text-[#EAE9E6] transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  </header>
);
