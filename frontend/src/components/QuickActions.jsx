import React from "react";
import { Code2, GraduationCap, Wrench, FileText, AlertTriangle } from "lucide-react";

const PILLS = [
  { label: "Code Projects", icon: Code2, cmd: "/projects" },
  { label: "Core Skills", icon: GraduationCap, cmd: "/skills" },
  { label: "SRE Runbooks", icon: Wrench, cmd: "/runbooks" },
  { label: "View Resume", icon: FileText, cmd: "/resume" },
  { label: "Outage Sim", icon: AlertTriangle, cmd: "/simulate-outage" },
];

export const QuickActions = ({ onCommand }) => {
  return (
    <div
      data-testid="quick-actions"
      className="flex items-center justify-center gap-2 flex-wrap max-w-[720px] mx-auto mt-3"
    >
      {PILLS.map((p) => {
        const Icon = p.icon;
        return (
          <button
            key={p.cmd}
            data-testid={`pill-${p.cmd.replace("/", "")}`}
            onClick={() => onCommand(p.cmd)}
            className="group flex items-center gap-1.5 text-[12.5px] px-3 py-1.5 rounded-full border border-[#3a3a3a] bg-[#2a2a2a] text-[#D1D1D1] hover:text-[#ECECEC] hover:bg-[#333333] hover:border-[#4a4a4a] cursor-pointer transition-all duration-150"
          >
            <Icon
              className="w-3.5 h-3.5 text-[#9b9b9b] group-hover:text-[#C5F250] transition-colors"
              strokeWidth={1.75}
            />
            <span>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
};
