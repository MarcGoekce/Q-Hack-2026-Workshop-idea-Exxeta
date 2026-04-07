# workshop-agentic

Workshop materials for **"Agentic Coding with OpenCode"** — Q-Summit 2026.

---

## Repository Layout

```
workshop-agentic/
├── slides/
│   ├── slides.md           # Slidev presentation deck (21 slides, ~50 min)
│   ├── public/             # Static assets referenced by slides
│   │   ├── agent-loop.svg
│   │   ├── mcp-architecture.svg
│   │   └── permission-model.svg
│   ├── components/         # Vue components for Slidev (placeholder)
│   └── tools/
│       └── validate_slidev.js  # Node.js validation script
├── demo-repo/
│   ├── obsidian-plugin/    # Demo 1: Obsidian plugin scaffold target
│   ├── cli-fallback/       # Demo 2: CLI repo for plan-mode analysis
│   └── rehearsals/         # Pre-recorded demo outputs (fallback)
├── assets/                 # SVG diagrams (source)
│   ├── agent-loop.svg
│   ├── mcp-architecture.svg
│   └── permission-model.svg
├── docs/
│   └── TALK_TRACK.md       # 50-minute presenter notes
└── README.md               # This file
```

---

## Data Sources

All content is sourced from authoritative documentation fetched on **2026-04-02**:

| URL | Content extracted |
|-----|------------------|
| https://opencode.ai/docs | Install, overview, TUI usage, /init, /undo |
| https://opencode.ai/docs/config | Config file locations, precedence, {env:VAR} interpolation |
| https://opencode.ai/docs/permissions | Permission model, allow/ask/deny, granular rules, defaults |
| https://opencode.ai/docs/mcp-servers | MCP local/remote config shapes, OAuth, {env:VAR} in headers |
| https://opencode.ai/docs/agents | Agent types, built-ins, markdown agent frontmatter, modes |
| https://opencode.ai/docs/tools | Full built-in tool list, permission keys, tool descriptions |
| https://opencode.ai/docs/skills | SKILL.md format, frontmatter fields, discovery paths |
| https://opencode.ai/docs/rules | AGENTS.md, /init, global vs project, precedence |

---

## Quick Start

### Run the presentation

```bash
# Install Slidev globally
npm install -g @slidev/cli

# Start the dev server
cd workshop-agentic/slides
slidev slides.md
```

Open http://localhost:3030

### Validate the slide deck

```bash
cd workshop-agentic/slides
node tools/validate_slidev.js
```

### Run Demo 1 (Obsidian plugin)

```bash
cd workshop-agentic/demo-repo/obsidian-plugin
opencode
# In the TUI: type your prompt, use Tab to switch Plan/Build modes
```

### Run Demo 2 (CLI analysis, non-interactive)

```bash
cd workshop-agentic/demo-repo/cli-fallback
opencode run --agent plan "Analyze this codebase. Find the top 3 refactoring opportunities."
```

---

## Presenter Docs

See [`docs/TALK_TRACK.md`](docs/TALK_TRACK.md) for:
- Section-by-section timing
- Scripted talking points
- Demo cues and fallback plans
- Timing checkpoints and "if running long" guidance

---

## Subdirectory Details

| Directory | Contents |
|-----------|---------|
| `slides/` | Slidev deck + assets + validation script |
| `slides/public/` | SVG diagrams referenced from slides |
| `slides/tools/` | validate_slidev.js — runs checks on slides.md |
| `demo-repo/obsidian-plugin/` | Empty dir — agent scaffolds it live in Demo 1 |
| `demo-repo/cli-fallback/` | Sample CLI repo for Demo 2 read-only analysis |
| `demo-repo/rehearsals/` | Pre-captured demo outputs for fallback |
| `assets/` | Source SVG diagrams (also copied to slides/public/) |
| `docs/` | TALK_TRACK.md presenter notes |

---

## Flagged Ambiguities

The following facts were **not explicitly documented** and are marked as inferred or approximate:

1. **Slidev headmatter keys** (`highlighter: shiki`, `mdc: true`, `drawings.persist`) — these are standard Slidev options, not OpenCode-specific. Verified against Slidev documentation patterns.
2. **`opencode run --agent plan` flag syntax** — the `opencode run` command exists per the CLI docs, but the exact `--agent` flag syntax was inferred from the config structure. Verify with `opencode run --help` before the demo.
3. **GitHub Actions `opencode run` usage** — the CI workflow example is illustrative; the exact `opencode` GitHub Action config may differ. Check https://opencode.ai/docs/github for the authoritative CI pattern.
