import React, { useState } from "react";
import { PanelLeftClose, PanelLeftOpen, Plus, MessageSquare, Github, Linkedin, Mail } from "lucide-react";
import { candidate } from "../data/content";

const RECENTS = [
  { id: "r1", label: "Exploring Projects", cmd: "/projects" },
  { id: "r2", label: "Debugging Runbooks", cmd: "/runbooks" },
  { id: "r3", label: "System Info", cmd: "/summary" },
  { id: "r4", label: "Recruiter Snapshot", cmd: "/recruiter" },
  { id: "r5", label: "Outage Simulation", cmd: "/simulate-outage" },
];

export const ChatSidebar = ({ onCommand, onNewChat }) => {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <aside
        data-testid="chat-sidebar"
        className="w-[52px] shrink-0 bg-[#171717] border-r border-[#2a2a2a] flex flex-col items-center py-3"
      >
        <button
          data-testid="sidebar-toggle"
          onClick={() => setOpen(true)}
          className="w-9 h-9 rounded-md hover:bg-[#262626] text-[#9b9b9b] hover:text-[#ECECEC] flex items-center justify-center cursor-pointer transition-colors"
        >
          <PanelLeftOpen className="w-4 h-4" strokeWidth={1.75} />
        </button>
        <button
          data-testid="new-chat-collapsed"
          onClick={onNewChat}
          className="mt-2 w-9 h-9 rounded-md hover:bg-[#262626] text-[#9b9b9b] hover:text-[#ECECEC] flex items-center justify-center cursor-pointer transition-colors"
          title="New chat"
        >
          <Plus className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </aside>
    );
  }

  return (
    <aside
      data-testid="chat-sidebar"
      className="w-[260px] shrink-0 bg-[#171717] border-r border-[#2a2a2a] flex flex-col"
    >
      <div className="h-12 flex items-center justify-between px-3">
        <span
          className="text-[14px] font-serif-display text-[#ECECEC] tracking-tight"
          data-testid="sidebar-brand"
        >
          AveelashGPT
        </span>
        <button
          data-testid="sidebar-toggle"
          onClick={() => setOpen(false)}
          className="w-8 h-8 rounded-md hover:bg-[#262626] text-[#9b9b9b] hover:text-[#ECECEC] flex items-center justify-center cursor-pointer transition-colors"
        >
          <PanelLeftClose className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="px-2">
        <button
          data-testid="new-chat"
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] text-[#ECECEC] hover:bg-[#262626] cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.75} />
          <span>New chat</span>
        </button>
      </div>

      <div className="px-3 mt-4 mb-1 text-[11px] uppercase tracking-[0.12em] text-[#6e6e6e]">
        Recents
      </div>

      <div className="flex-1 overflow-y-auto px-2 sidebar-scroll">
        {RECENTS.map((r) => (
          <button
            key={r.id}
            data-testid={`recent-${r.id}`}
            onClick={() => onCommand(r.cmd)}
            className="group w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] text-[#B3B3B3] hover:bg-[#262626] hover:text-[#ECECEC] cursor-pointer transition-colors"
          >
            <MessageSquare
              className="w-3.5 h-3.5 text-[#6e6e6e] group-hover:text-[#9b9b9b] shrink-0"
              strokeWidth={1.75}
            />
            <span className="truncate text-left">{r.label}</span>
          </button>
        ))}
      </div>

      <div className="border-t border-[#2a2a2a] px-3 py-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-[13px] text-[#ECECEC]">
          <div className="w-7 h-7 rounded-full bg-[#C5F250] text-[#171717] flex items-center justify-center text-[11px] font-semibold">
            AH
          </div>
          <div className="flex flex-col leading-tight">
            <span>Aveelash Hota</span>
            <span className="text-[10.5px] text-[#6e6e6e]">
              Junior DevOps / SRE
            </span>
          </div>
        </div>
        <div
          className="flex items-center gap-1 pl-9 mt-0.5"
          data-testid="sidebar-socials"
        >
          <a
            href={`mailto:${candidate.email}`}
            data-testid="social-email"
            className="w-7 h-7 rounded-md text-[#6e6e6e] hover:text-[#ECECEC] hover:bg-[#262626] flex items-center justify-center transition-colors"
          >
            <Mail className="w-3.5 h-3.5" strokeWidth={1.75} />
          </a>
          <a
            href={candidate.github}
            target="_blank"
            rel="noreferrer"
            data-testid="social-github"
            className="w-7 h-7 rounded-md text-[#6e6e6e] hover:text-[#ECECEC] hover:bg-[#262626] flex items-center justify-center transition-colors"
          >
            <Github className="w-3.5 h-3.5" strokeWidth={1.75} />
          </a>
          <a
            href={candidate.linkedin}
            target="_blank"
            rel="noreferrer"
            data-testid="social-linkedin"
            className="w-7 h-7 rounded-md text-[#6e6e6e] hover:text-[#ECECEC] hover:bg-[#262626] flex items-center justify-center transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </aside>
  );
};
