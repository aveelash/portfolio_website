# AveelashGPT — PRD

## Original problem statement
Build a frontend-only React + Tailwind portfolio for a junior DevOps/SRE
candidate (Aveelash Hota), styled extremely close to Claude Code (NOT a
template / dashboard / landing page / chat UI). Three-pane layout:
- 280px left EXPLORER sidebar with file tree
- center terminal with command outputs
- 320px right "Candidate Context" sidebar
Top bar (traffic dots + title + local v1), bottom slash-command input.
All content hardcoded. No backend, no auth, no DB, no LLM.

## Architecture
- React 19 + react-router-dom (single-page, no routes used)
- Tailwind CSS with arbitrary-value Claude Code palette
  (#0D0F13 / #13161C / #262B33 / #E7EAF0 / #8A9099 / #6CCF91 / #7AA2F7 / #D6B56D / #C66B6B)
- JetBrains Mono (Google Fonts) everywhere, IBM Plex Mono fallback
- Components: TopBar, LeftSidebar (collapsible folders, active highlight),
  Terminal, OutputBlock (per-command renderer), CommandInput
  (slash-only, history Up/Down, Tab-complete), RightSidebar
- All hardcoded content in src/data/content.js

## Contact details (real)
- Email: aveelash.hota04@gmail.com
- GitHub: github.com/aveelash
- LinkedIn: linkedin.com/in/aveelash-hota-442317338
- One real repo: github.com/aveelash/DevSecOps_Project

## What's implemented (2026-12)
- 12 slash commands: /help /summary /resume /projects /runbooks /labs
  /skills /github /interview /gaps /why-hire /contact /clear
- File explorer with 26 files across projects/, runbooks/, labs/,
  learning/, github/ + README.md, resume.md, contact.md
- Click-to-open file -> renders as terminal `cat ~/<path>` block
- Non-slash input -> amber notice "v1 only supports slash commands"
- Unknown /xyz -> red notice "Unknown command"
- Tab autocomplete, ArrowUp/Down history, cursor blink, stream-in
  animation, smooth scroll-to-bottom
- Right sidebar: Identity / Evidence / Core Stack / Quick Commands
- Tested with testing_agent_v3 — 100% pass on 15 user flows

## Backlog (P1/P2)
- P1: Project repo URLs for monitoring-stack / k8s-kind / ci-cd /
  dockerized-app (only DevSecOps_Project is real; others point to the
  GitHub profile root).
- P2: Add an optional `/timeline` view of the candidate's learning
  journey (month-by-month milestones).
- P2: Print/export to PDF of /resume for recruiters.
- P2: Keyboard shortcut overlay (press `?`).
- P2: Theme toggle (light Claude Code palette).
