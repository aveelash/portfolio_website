import React from "react";

export const TopBar = () => {
  return (
    <div
      data-testid="top-bar"
      className="flex items-center justify-between h-8 px-3 border-b border-[#1f242e] bg-[#090b0f] select-none shrink-0"
    >
      <div className="flex items-center gap-1.5" data-testid="top-bar-dots">
        <span className="w-2.5 h-2.5 rounded-full bg-[#3a3f48]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#3a3f48]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#00f5d4]" />
      </div>

      <div
        className="text-[11px] sm:text-[12px] text-[#8A9099] tracking-tight truncate max-w-[50vw] sm:max-w-none text-center"
        data-testid="top-bar-title"
      >
        <span className="text-[#E7EAF0]">AveelashGPT</span>
        <span className="hidden sm:inline mx-2 text-[#3A4049]">·</span>
        <span className="hidden sm:inline">~/sre-devops-profile</span>
      </div>

      <div className="w-[52px]" aria-hidden="true" />
    </div>
  );
};
