import React from "react";
import {
  quickCommands,
  projects,
  runbooks,
  labs,
  githubRepos,
} from "../data/content";

const LAST_UPDATED = "Dec 2026";
const ACCENT = "#00f5d4";

// Premium, slim, single-accent progress bar.
const BarRow = ({ label, pct }) => {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return (
    <div className="space-y-1" data-testid={`bar-${slug}`}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[11px] text-[#A6ADB8] tracking-tight truncate">
          {label}
        </span>
        <span
          className="text-[10.5px] tabular-nums font-medium"
          style={{ color: ACCENT }}
        >
          {pct}%
        </span>
      </div>
      <div className="h-[3px] w-full bg-[#13171d] overflow-hidden">
        <div
          className="bar-fill h-full"
          style={{
            width: `${pct}%`,
            background: ACCENT,
            boxShadow: `0 0 6px ${ACCENT}40`,
          }}
        />
      </div>
    </div>
  );
};

const Section = ({ label, children, testid }) => (
  <div className="px-3 py-2.5 border-b border-[#1f242e]" data-testid={testid}>
    <div className="text-[10.5px] tracking-[0.18em] uppercase text-[#8A9099] mb-1.5">
      {label}
    </div>
    {children}
  </div>
);

const KV = ({ k, v, color = "text-[#E7EAF0]" }) => (
  <div className="flex items-baseline justify-between gap-3 py-[1px]">
    <span className="text-[11.5px] text-[#8A9099]">{k}</span>
    <span className={`text-[12px] ${color} text-right`}>{v}</span>
  </div>
);

export const RightSidebar = ({ onCommand }) => {
  return (
    <aside
      data-testid="right-sidebar"
      className="w-[320px] shrink-0 border-l border-[#1f242e] bg-[#090b0f] flex flex-col overflow-y-auto sidebar-scroll"
    >
      <div className="h-9 flex items-center px-3 border-b border-[#1f242e] text-[10.5px] tracking-[0.15em] text-[#A6ADB8] uppercase gap-2">
        <span>📊</span>
        <span>System Metrics &amp; Candidate Profile</span>
      </div>

      <Section label="Profile" testid="ctx-profile">
        <KV
          k="role target"
          v="Junior DevOps / SRE Engineer"
          color="text-[#00f5d4]"
        />
        <KV k="profile" v="Project-based (Fresher)" />
        <div
          className="flex items-center gap-2 pt-1.5"
          data-testid="system-active"
        >
          <span className="relative flex items-center justify-center w-2.5 h-2.5">
            <span
              className="absolute inset-0 rounded-full opacity-60 animate-ping"
              style={{ background: "#10b981" }}
            />
            <span
              className="relative w-1.5 h-1.5 rounded-full"
              style={{ background: "#10b981" }}
            />
          </span>
          <span className="text-[10.5px] tracking-[0.14em] text-[#10b981] font-medium">
            SYSTEM: ACTIVE
          </span>
        </div>
      </Section>

      <Section label="Index Stats" testid="ctx-stats">
        <KV k="last updated" v={LAST_UPDATED} />
        <KV k="projects" v={projects.length} color="text-[#10b981]" />
        <KV k="runbooks" v={runbooks.length} color="text-[#10b981]" />
        <KV k="labs" v={labs.length} color="text-[#10b981]" />
        <KV k="github repos" v={githubRepos.length} color="text-[#10b981]" />
      </Section>

      <Section label="Skills Matrix" testid="ctx-stack">
        <div className="space-y-2.5">
          <BarRow label="Container Ops (K8s/Docker)" pct={90} />
          <BarRow label="IaC & Cloud (AWS/Terraform)" pct={80} />
          <BarRow label="Automation (Python/Bash/CI-CD)" pct={85} />
          <BarRow label="Observability (Prometheus/Grafana)" pct={80} />
        </div>
      </Section>

      <Section label="Evidence" testid="ctx-evidence">
        {[
          ["recruiter", "/recruiter"],
          ["resume", "/resume"],
          ["projects", "/projects"],
          ["runbooks", "/runbooks"],
          ["labs", "/labs"],
          ["github", "/github"],
        ].map(([label, cmd]) => (
          <button
            key={cmd}
            data-testid={`evidence-${label}`}
            onClick={() => onCommand(cmd)}
            className="group w-full flex items-center justify-between py-[3px] text-[12px] text-[#A6ADB8] hover:text-[#E7EAF0] cursor-pointer transition-all duration-150"
          >
            <span className="flex items-center gap-2">
              <span className="text-[#5a6270] group-hover:text-[#00f5d4] transition-colors">
                ›
              </span>
              {label}
            </span>
            <span className="text-[10.5px] text-[#5a6270] group-hover:text-[#00f5d4] transition-colors">
              {cmd}
            </span>
          </button>
        ))}
      </Section>

      <Section label="Quick Commands" testid="ctx-quick">
        <div className="flex flex-col gap-0">
          {quickCommands.map((c) => (
            <button
              key={c}
              data-testid={`quick-${c.replace("/", "")}`}
              onClick={() => onCommand(c)}
              className="text-left text-[12px] py-[2px] px-1 -mx-1 text-[#00f5d4] hover:bg-[#0e1218] hover:drop-shadow-[0_0_4px_rgba(0,245,212,0.55)] cursor-pointer transition-all duration-150"
            >
              {c}
            </button>
          ))}
        </div>
      </Section>

    </aside>
  );
};
