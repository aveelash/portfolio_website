import React from "react";

const PILLS = [
  { label: "View Resume", icon: "📄", cmd: "/resume" },
  { label: "Core Projects", icon: "🚀", cmd: "/projects" },
  { label: "SRE Runbooks", icon: "🛠️", cmd: "/runbooks" },
  { label: "Simulate Outage", icon: "⚠️", cmd: "/simulate-outage" },
];

export const QuickPills = ({ onCommand }) => {
  return (
    <div
      data-testid="quick-pills"
      className="flex items-center gap-2 px-5 py-2 border-t border-[#1f242e] bg-[#090b0f]"
    >
      {PILLS.map((p) => (
        <button
          key={p.cmd}
          data-testid={`pill-${p.cmd.replace("/", "")}`}
          onClick={() => onCommand(p.cmd)}
          className="group flex items-center gap-1.5 text-[11.5px] px-2.5 py-1 border border-[#1f242e] bg-[#0c0f14] text-[#A6ADB8] hover:text-[#E7EAF0] hover:border-[#00f5d4]/50 hover:bg-[#0e1218] cursor-pointer transition-all duration-150 hover:shadow-[0_0_10px_rgba(0,245,212,0.20)] rounded-full"
        >
          <span className="text-[12px]">{p.icon}</span>
          <span className="tracking-tight">{p.label}</span>
        </button>
      ))}
    </div>
  );
};
