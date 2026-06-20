import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  FileCode2,
  Folder,
  FolderOpen,
} from "lucide-react";
import { fileTree } from "../data/content";

const FileRow = ({ path, label, active, onOpen, depth }) => (
  <button
    data-testid={`file-${path.replace(/[\/.]/g, "-")}`}
    onClick={() => onOpen(path)}
    className={`group w-full flex items-center gap-1.5 py-[3px] pr-2 text-left text-[12.5px] leading-tight cursor-pointer transition-all duration-150 ${
      active
        ? "bg-[#0e1218] text-[#E7EAF0] border-l-2 border-[#00f5d4]"
        : "text-[#A6ADB8] hover:bg-[#0d1117] hover:text-[#E7EAF0] border-l-2 border-transparent"
    }`}
    style={{ paddingLeft: `${6 + depth * 12}px` }}
  >
    <FileCode2
      className={`w-3 h-3 shrink-0 ${
        active
          ? "text-[#00f5d4]"
          : "text-[#5a6270] group-hover:text-[#8A9099]"
      }`}
      strokeWidth={1.5}
    />
    <span className="truncate">{label}</span>
  </button>
);

const FolderRow = ({ name, open, onToggle, depth }) => (
  <button
    data-testid={`folder-${name}`}
    onClick={onToggle}
    className="w-full flex items-center gap-1 py-[3px] pr-2 text-left text-[12.5px] leading-tight text-[#8A9099] hover:text-[#E7EAF0] cursor-pointer transition-colors"
    style={{ paddingLeft: `${4 + depth * 12}px` }}
  >
    {open ? (
      <ChevronDown className="w-3 h-3 shrink-0" strokeWidth={1.75} />
    ) : (
      <ChevronRight className="w-3 h-3 shrink-0" strokeWidth={1.75} />
    )}
    {open ? (
      <FolderOpen
        className="w-3.5 h-3.5 text-[#7a8290] shrink-0"
        strokeWidth={1.5}
      />
    ) : (
      <Folder
        className="w-3.5 h-3.5 text-[#7a8290] shrink-0"
        strokeWidth={1.5}
      />
    )}
    <span className="truncate">{name}/</span>
  </button>
);

export const LeftSidebar = ({ activePath, onOpen }) => {
  const [openFolders, setOpenFolders] = useState({
    projects: true,
    runbooks: true,
    labs: true,
    learning: false,
    github: true,
  });

  const toggle = (name) =>
    setOpenFolders((s) => ({ ...s, [name]: !s[name] }));

  return (
    <aside
      data-testid="left-sidebar"
      className="w-[280px] shrink-0 border-r border-[#1f242e] bg-[#090b0f] flex flex-col"
    >
      <div className="h-9 flex items-center px-3 border-b border-[#1f242e] text-[10.5px] tracking-[0.15em] text-[#A6ADB8] uppercase gap-2">
        <span>📁</span>
        <span>Infrastructure Repository</span>
      </div>

      <div
        className="flex-1 overflow-y-auto py-2 sidebar-scroll"
        data-testid="file-tree"
      >
        {fileTree.map((node) => {
          if (node.type === "file") {
            return (
              <FileRow
                key={node.path}
                path={node.path}
                label={node.path}
                active={activePath === node.path}
                onOpen={onOpen}
                depth={0}
              />
            );
          }
          const open = openFolders[node.name];
          return (
            <div key={node.name} className="mt-1">
              <FolderRow
                name={node.name}
                open={open}
                onToggle={() => toggle(node.name)}
                depth={0}
              />
              {open &&
                node.children.map((c) => (
                  <FileRow
                    key={c.path}
                    path={c.path}
                    label={c.path.split("/").pop()}
                    active={activePath === c.path}
                    onOpen={onOpen}
                    depth={1}
                  />
                ))}
            </div>
          );
        })}
      </div>

      <div className="border-t border-[#1f242e] px-3 py-2 text-[11px] text-[#6A7280] leading-snug">
        <div>
          <span className="text-[#00f5d4]">●</span> indexed · 26 files
        </div>
        <div className="mt-0.5 text-[#8A9099]">main</div>
      </div>
    </aside>
  );
};
