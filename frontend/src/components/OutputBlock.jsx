import React from "react";
import {
  Github,
  ExternalLink,
  FileText,
  Terminal as TerminalIcon,
} from "lucide-react";
import { DocumentDownloadLinks } from "./DocumentDownloadLinks";

import {
  candidate,
  summary,
  resume,
  readme,
  contact,
  projects,
  skills,
  recruiter,
  experience,
  certifications,
  education,
  impact,
  about,
  github,
  allCommands,
} from "../data/content";

/* ---------------- UI HELPERS ---------------- */

const Pre = ({ children }) => (
  <pre className="text-[#A6ADB8] text-[13px] whitespace-pre-wrap leading-relaxed">
    {children}
  </pre>
);

const Section = ({ title, children }) => (
  <div className="border border-[#1f242e] bg-[#0b0e13] p-3 rounded">
    <div className="text-[#7AA2F7] text-[12px] mb-2 uppercase tracking-wide">
      {title}
    </div>
    {children}
  </div>
);

/* ---------------- BLOCKS ---------------- */

const SummaryBlock = () => (
  <Section title="SUMMARY">
    <Pre>{summary}</Pre>
  </Section>
);

const RecruiterBlock = () => (
  <Section title="RECRUITER VIEW">
    <Pre>{recruiter}</Pre>
  </Section>
);

const ResumeBlock = () => (
  <Section title="RESUME">
    <Pre>{resume}</Pre>
    <DocumentDownloadLinks docTypes={["resume"]} />
  </Section>
);

const ProjectsBlock = () => (
  <Section title="PROJECTS">
    <div className="space-y-2">
      {projects.map((p) => (
        <div key={p.file} className="border border-[#1f242e] p-2 bg-[#0b0e13]">
          <div className="flex justify-between">
            <div className="text-white text-[13px]">{p.title}</div>
            <a
              href={p.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#7AA2F7] text-[12px] flex items-center gap-1"
            >
              <Github size={12} /> GitHub
            </a>
          </div>

          <div className="text-[#A6ADB8] text-[12px] mt-1">{p.description}</div>
        </div>
      ))}
    </div>
  </Section>
);

const SkillsBlock = () => (
  <Section title="SKILLS">
    <Pre>
      Practicing: {skills.practicing.join(", ")}
      {"\n"}
      Next: {skills.next.join(", ")}
    </Pre>
  </Section>
);

const AboutBlock = () => (
  <Section title="ABOUT">
    <Pre>{about}</Pre>
  </Section>
);

const ExperienceBlock = () => (
  <Section title="EXPERIENCE">
    <Pre>{experience}</Pre>
  </Section>
);

const ImpactBlock = () => (
  <Section title="IMPACT">
    <Pre>{impact}</Pre>
  </Section>
);

const CertificationsBlock = () => (
  <Section title="CERTIFICATIONS">
    <Pre>{certifications}</Pre>
    <DocumentDownloadLinks docTypes={["certificate"]} />
  </Section>
);

const EducationBlock = () => (
  <Section title="EDUCATION">
    <Pre>{education}</Pre>
  </Section>
);

const GithubBlock = () => (
  <Section title="GITHUB">
    <Pre>{github}</Pre>
  </Section>
);

/* ---------------- OUTPUT DISPATCHER ---------------- */

export const OutputBlock = ({ block }) => {
  // Prevent errors while data is loading
  if (!block) {
    return null;
  }

  if (!block.kind) {
    return (
      <Section title="THINKING">
        <Pre>Generating response...</Pre>
      </Section>
    );
  }

  switch (block.kind) {
    case "help":
      return (
        <Section title="HELP">
          <Pre>{allCommands.join("\n")}</Pre>
        </Section>
      );

    case "summary":
      return <SummaryBlock />;

    case "recruiter":
      return <RecruiterBlock />;

    case "resume":
      return <ResumeBlock />;

    case "projects":
      return <ProjectsBlock />;

    case "contact":
      return (
        <Section title="CONTACT">
          <Pre>{contact}</Pre>
        </Section>
      );

    case "readme":
      return (
        <Section title="README">
          <Pre>{readme}</Pre>
        </Section>
      );

    case "skills":
      return <SkillsBlock />;

    case "education":
      return <EducationBlock />;

    case "about":
      return <AboutBlock />;

    case "experience":
      return <ExperienceBlock />;

    case "impact":
      return <ImpactBlock />;

    case "certifications":
      return <CertificationsBlock />;

    case "github":
      return <GithubBlock />;

    case "loading":
      return (
        <Section title="THINKING">
          <Pre>Generating response...</Pre>
        </Section>
      );

      default:
        console.warn("Unknown block kind:", block.kind);
        return null;
  }
};
