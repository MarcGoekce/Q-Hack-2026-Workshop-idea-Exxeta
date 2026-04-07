# TALK TRACK — Agentic Coding with OpenCode
## Q-Summit 2026 — 50-Minute Workshop

---

## Overview

This document is the presenter's companion to `slides/slides.md`. Each section maps to a slide group, with timing, scripted talking points, demo cues, and transition phrases.

**Total runtime: 50 minutes**
**Slides: 21**
**Demos: 2 (15 minutes combined)**

---

## 00:00–05:00 — Opening & Agenda (Slides 1–2)

### Slide 1: Title

**What to say:**

> "Welcome everyone. I'm [name], and for the next 50 minutes we're going hands-on with agentic coding using OpenCode. This isn't a product pitch — it's a technical workshop. We'll look at the architecture, the configuration, the safety model, and run two live demos. My goal is that you leave today able to actually run this on a real project."

*Pause to let people settle.*

> "Quick show of hands — who's already used an AI coding assistant like Copilot, Cursor, or Claude Code?" 

*Acknowledge responses.*

> "Good. Today we're going a step further — from autocomplete and chat to autonomous multi-step agents. That's the jump we're making."

---

### Slide 2: Agenda

**What to say:**

> "Here's our roadmap. We start with a quick conceptual framing — what makes something 'agentic' versus just an LLM chat. Then we dig into OpenCode: how it works, what its tools are, how MCP servers extend it, and how permissions keep it safe. Then we run two live demos — one scaffolding an Obsidian plugin from scratch, one analyzing an existing CLI repo in read-only mode. We close with patterns and pitfalls, and I'll leave 10 minutes for Q&A."

> "Questions are welcome throughout. If something's unclear, stop me."

---

## 05:00–10:00 — What is Agentic Coding & Architecture (Slides 3–5)

### Slide 3: What is Agentic Coding?

**What to say:**

> "Let's be precise about terminology. A traditional coding assistant gives you suggestions — autocomplete, or a chat response you copy-paste. Agentic coding is different: the model decides the next action, executes it using tools, observes the result, and decides what to do next. It loops until the task is done or it needs you."

> "The practical difference: instead of asking 'how do I write a word count plugin for Obsidian' and reading the answer, you say 'write a word count plugin for Obsidian', and the agent reads the Obsidian docs, scaffolds the files, installs dependencies, and shows you a working plugin."

> "The quote on the slide — treating it like a junior developer — is important. You wouldn't give a junior developer access to prod without guardrails. Same principle applies here."

**Audience engagement:**
> "What's your mental model for 'autonomous enough to be useful, not so autonomous it causes incidents'? Keep that question in mind — we'll address it in the permissions section."

---

### Slide 4: OpenCode Overview

**What to say:**

> "OpenCode is open-source, MIT-licensed, available on GitHub under anomalyco/opencode. It's not a SaaS product — you install it locally, you bring your own LLM API keys, your data stays with your provider."

> "It's built on the idea that the terminal is still the best environment for serious development work. But it also has a desktop app and IDE extensions — all sharing the same config format."

> "The install is one line. Three commands: install, navigate to your project, run opencode."

*Point to the install commands on screen.*

> "You'll need an API key for at least one provider. The easiest path for new users is OpenCode Zen — their curated model list — but you can use Anthropic, OpenAI, Bedrock, local models, anything."

---

### Slide 5: Architecture Diagram

**What to say:**

> "Here's the architecture. The LLM sits on one side — it only sees text, it never directly touches your filesystem. All actions go through the OpenCode core, which has a tool router and a permission layer."

> "The tool router receives a tool call from the LLM — say, 'run `npm install`' — and before executing it, checks permissions. Is bash allowed? Is `npm *` on the allowlist? If yes, execute and return output. If 'ask', show a dialog. If 'deny', block and tell the LLM it was denied."

> "Config lives in `opencode.json` — either global at `~/.config/opencode/opencode.json`, or per-project in the project root. These merge together, project overrides global."

**Transition:**
> "Let's zoom into that agent loop — how exactly does the model decide what to do next?"

---

### Slide 6: The Agent Loop

**What to say:**

> "The loop is: LLM gets user message → emits a tool call → permission checked → tool executed → result returned to LLM → repeat. The LLM stops looping when it emits a plain text response with no tool calls."

> "Two modes change the loop behavior. Build mode has full tool access — it's the default. Plan mode restricts edits and bash to 'ask' — so the agent can analyze and plan but won't actually modify files without your approval. Switch between them with Tab during a session."

> "There's also a doom_loop guard: if the same tool call with identical arguments repeats three times, OpenCode asks your permission before continuing. That's the agent spinning — intervene by giving it new context."

---

## 10:00–15:00 — Tools, MCP, Permissions (Slides 7–11)

### Slide 7: Built-in Tools

**What to say:**

> "Here's the full list of built-in tools. These are the actions the LLM can request. Notice: they cover the full development loop — reading, writing, running commands, searching the web, asking you questions."

> "A few worth calling out specifically:"

> "`edit` does exact string replacement — not line numbers, not regex. The LLM has to quote the exact text to replace. This prevents accidental edits."

> "`skill` loads a SKILL.md instruction file on demand — we'll cover that shortly."

> "`question` lets the agent ask you a multiple-choice question mid-task — useful when there are genuine design choices that need human input."

> "`websearch` requires either the OpenCode provider or setting `OPENCODE_ENABLE_EXA=1`. It uses Exa AI's search engine."

> "Under the hood, `grep`, `glob`, and `list` use ripgrep and respect your `.gitignore`."

---

### Slide 8: MCP Servers — What & Why

**What to say:**

> "MCP stands for Model Context Protocol. It's an emerging standard for connecting LLMs to external tools and services. Think of it like a plugin system, but standardized — any MCP-compatible client can use any MCP server."

> "For OpenCode, this means you can add tools for: querying your Sentry errors, creating Jira tickets, searching GitHub, accessing your database, hitting any internal API. The LLM uses these exactly like built-in tools — it just calls them."

> "The caveat I want to emphasize: each MCP server adds its tool list to the context window. If you add ten servers with fifty tools each, you've consumed a significant chunk of context before the agent even starts working. Be selective."

> "Two connection modes: local MCP starts a subprocess on your machine — good for filesystem tools, local databases. Remote MCP connects to an HTTPS endpoint — good for third-party services."

---

### Slide 9: MCP Config Examples

**What to say:**

> "Let me walk through these configs. On the left, a local MCP server using the official filesystem package. The `command` array is the full shell command to launch the server process. `environment` injects env vars into that process."

> "On the right, two remote servers. Sentry uses OAuth — just pass an empty object for `oauth` and OpenCode handles the browser auth flow automatically using Dynamic Client Registration. Context7 uses an API key — notice the `{env:CONTEXT7_API_KEY}` syntax. This interpolates the environment variable at runtime, so your actual API key never appears in the config file."

> "The `{env:VAR}` pattern works anywhere in the config — headers, model names, URLs. Use it for any secret."

---

### Slide 10: Permissions — Why They Matter

**What to say:**

> "This is the section I care most about. Let me be direct: an AI agent with full permission to run bash commands in a directory containing production credentials is dangerous. Not hypothetically — practically dangerous."

> "The default OpenCode configuration is permissive — most tools run without prompting. That's fine for local development on a toy project. It's not fine for a CI pipeline, a shared dev environment, or a project with sensitive data."

> "Three outcomes for any tool call: allow, ask, or deny. 'Ask' shows a three-button dialog: once, always for this session, reject. Choosing 'always' adds a wildcard rule for that command pattern for the rest of the session."

> "The defaults have one important protection built in: `.env` files are denied by default. The model cannot read them even if permissions are otherwise permissive."

---

### Slide 11: Permission Config Examples

**What to say:**

> "This is a real, practical config I'd use for a team project. Let me walk through it:"

> "The top-level `*: ask` means anything not specifically listed requires a prompt. Then we carve out allowlists."

> "For bash: git and npm commands are auto-approved — those are safe for most workflows. `rm *` is blocked entirely — no exceptions. This one's worth being aggressive about."

> "For edit: everything denied except the specific docs directory where the agent is allowed to make changes."

> "For read: everything allowed by default, `.env` files denied, `.env.example` re-allowed because that's the template we want the agent to read."

> "Critical rule: the last matching rule wins. Put your catch-all `*` first, then your specific overrides."

**Transition:**
> "Now let's look at how you configure the agents themselves."

---

## 15:00–20:00 — Agents, Rules, Skills (Slides 12–15)

### Slide 12: AGENTS.md — Project Rules

**What to say:**

> "AGENTS.md is the project's instruction manual for AI agents. Every time an agent session starts on this project, this file is injected into the system prompt."

> "Run `/init` in the TUI and OpenCode will analyze your codebase — read your package.json, scan your directory structure, maybe ask a couple of questions — and generate an initial AGENTS.md. If one already exists, it improves it in place."

> "What to put in it: build commands, test commands, architecture notes that aren't obvious from filenames, conventions like 'all API calls go through this module'. What not to put in it: everything. It's injected every session, so large files waste context."

> "Commit it to Git. This is shared team knowledge. When a new engineer joins — human or AI — they read AGENTS.md first."

> "There's also a global AGENTS.md at `~/.config/opencode/AGENTS.md` for personal preferences that apply across all projects."

---

### Slide 13: Agent Config Shape

**What to say:**

> "Agent files live in `.opencode/agents/` for project scope or `~/.config/opencode/agents/` globally. The filename becomes the agent name."

> "The frontmatter is YAML. Key fields:"
> "- `description` — required, shown in autocomplete, tells the LLM when to invoke this agent"
> "- `mode` — `subagent` (invokable via @mention or Task tool), `primary` (cycle with Tab), or `all` (both)"
> "- `model` — override the model for this specific agent"
> "- `temperature` — lower for analysis tasks, higher for creative work"
> "- `permission` — agent-specific permissions that override global config"

> "The markdown body is the system prompt. Keep it focused on what this agent does and doesn't do."

---

### Slide 14: Agent Config JSON + Built-ins

**What to say:**

> "The same configuration is available in JSON format inside `opencode.json`. Useful if you prefer to keep everything in one file."

> "The right side shows the built-in agent roster. Build and Plan are the two primary agents. General and Explore are subagents — General has full access and can run parallel tasks, Explore is read-only and fast. The compaction, title, and summary agents run automatically in the background — you can't select them, but they're doing work every session."

> "You can override any built-in by referencing its name in config. The config merges — so you're patching specific fields rather than replacing the whole agent."

---

### Slide 15: Skills

**What to say:**

> "Skills solve a specific problem: you have a complex multi-step workflow — like preparing a release, or running a security audit — and you want the agent to follow it exactly. You could put it in AGENTS.md, but that bloats every session. You could write it in the prompt each time, but that's tedious."

> "Skills let you write the workflow once as a SKILL.md file, save it to a named directory, and the agent loads it on demand."

> "The agent sees a list of available skills at the start of every session — just the names and descriptions. It decides based on the task whether to load one. When it loads a skill, it reads the full SKILL.md content and follows the instructions."

> "Frontmatter requires `name` and `description`. Name must be lowercase alphanumeric with hyphens — no spaces, no underscores."

**Transition:**
> "Now let's stop talking and start building. Switch to terminal for Demo 1."

---

## 25:00–38:00 — Live Demos (Slides 16–19)

### Slide 16 & 17: Demo 1 — Obsidian Plugin

**Demo cue:** Switch to terminal.

**Setup commands:**
```bash
cd workshop-agentic/demo-repo/obsidian-plugin
opencode
```

**Script:**

> "I'm in the obsidian-plugin demo directory. Empty right now. I'll type a prompt."

*Type into OpenCode:*
```
Scaffold a new Obsidian plugin that shows word count in the status bar.
Use TypeScript. Follow the official Obsidian plugin template structure.
First, show me your plan.
```

*While in Plan mode:*
> "Watch the plan output. The agent should identify: manifest.json, main.ts with a Plugin subclass, package.json with esbuild, styles.css. It might also suggest reading the obsidian npm package types."

*Switch to Build mode with Tab:*
> "Now I hit Tab to switch to Build. Same prompt, but now it can act."

*As it executes:*
> "It's calling `write` for each file — notice those are auto-allowed. Now here comes `npm install` — watch for the permission dialog."

*When dialog appears:*
> "I'll choose 'always' for npm commands — that approves them for the rest of this session."

*After completion:*
> "Now I'll use `/undo` to revert the last change and show you how rollback works."

---

### Slide 18 & 19: Demo 2 — CLI Plan Mode

**Demo cue:** Switch to terminal.

**Setup:**
```bash
cd workshop-agentic/demo-repo/cli-fallback
```

**Script:**

> "This is a small CLI repo with some intentional code smells. I'm going to run OpenCode in non-interactive mode — no TUI, single shot, output to stdout."

```bash
opencode run --agent plan \
  "Analyze this codebase. Find the top 3 refactoring opportunities.
   Be specific about which files and which patterns to change."
```

> "The `--agent plan` flag forces Plan mode even in non-interactive runs. Zero edits, no matter what the model tries."

> "This output could go into a GitHub Actions step, a PR comment, a Slack message. Let me show you one more — the CI pattern:"

```bash
opencode run --agent plan \
  "Check for any hardcoded secrets, API keys, or credentials in this codebase."
```

> "This is the kind of check you add to every PR. Cheap, fast, adds a layer of review you wouldn't otherwise have."

---

## 38:00–45:00 — Patterns & Pitfalls (Slides 20–21)

### Slide 20: Real-World Patterns

**What to say:**

> "Four patterns that come up repeatedly in real deployments."

> "Trust tiers: read-only for CI and analysis, restricted for development (git allowed, destructive commands blocked), full-trust only in your personal dev environment. Never in production."

> "Per-agent MCP scoping: if you have a research agent that needs Context7 but your build agent doesn't, disable the MCP globally and enable it only for the research agent. Context window is a shared resource — don't waste it."

> "Skills for team workflows: any process your team does more than twice should probably become a skill. Release checklists, PR templates, security review procedures. Version them in Git alongside your code."

> "AGENTS.md as living docs: update it when the architecture changes, when you add a new convention, when you deprecate something. The agent reads it every session — it's the highest-ROI documentation you can write."

---

### Slide 21: Pitfalls

**What to say:**

> "The most common mistakes, in roughly descending order of severity."

> "First and most dangerous: `permission: allow` in a CI environment or on a machine with production credentials. One misconfigured pipeline can give an agent permission to push to main, delete files, or exfiltrate secrets. Always use a restricted agent in automation."

> "Second: secrets in config files. Use `{env:VAR}` interpolation for any API key or token. Your config file might end up in version control. Your environment variable doesn't."

> "Third: ignoring doom_loop warnings. When you see the three-repetition dialog, the agent is stuck. Don't just approve it — figure out what context it's missing and add it."

> "Fourth: giant AGENTS.md. Every byte of it is in the context window every session. Summarize, don't transcribe."

> "And finally: skipping `/init`. Without AGENTS.md, the agent makes assumptions about your conventions. Usually wrong ones. Run `/init` before the first real session on any project."

---

## 45:00–50:00 — Q&A (Slide 22–23)

### Slide 22: Q&A Prompts

**Audience engagement questions:**

> "Let me throw these back to the room."

> "First: where in your current workflow would an agentic step add the most value? I'll start — I've found the biggest wins are in: initial project scaffolding, writing tests for existing code, and updating documentation after refactors."

*Let audience respond.*

> "Second — and this one's important — what's the riskiest thing you'd worry about giving an agent access to? There's no wrong answer. The fact that you're thinking about it means you're thinking about trust boundaries, which is exactly right."

*Let audience respond.*

> "Third: has anyone here tried MCP servers beyond what we covered? The Sentry MCP is genuinely useful for debugging sessions — you can ask the agent to look up the actual error stack trace while it's reading the code."

**Closing:**
> "Resources are on the slide. The Discord is very active — the maintainers respond. And everything from today is in the `workshop-agentic/` directory of the Q-Summit repo."

---

### Slide 23: Thank You

**What to say:**

> "Workshop materials are in the repo — slides, this talk track, the demo repos. The README has setup instructions."

> "My ask: go run `/init` on a real project today. Not tomorrow, today. It takes two minutes and you'll see immediately whether the generated AGENTS.md is accurate. That's the fastest way to calibrate your intuition for how much context these agents actually need."

> "Thanks for your time. The #agentic-coding channel is open for follow-up questions."

---

## Timing Checkpoints

| Time | You should be at |
|------|-----------------|
| 05:00 | Slide 3 (What is Agentic Coding) |
| 10:00 | Slide 6 (Agent Loop) |
| 15:00 | Slide 8 (MCP Servers) |
| 20:00 | Slide 12 (AGENTS.md) |
| 25:00 | Starting Demo 1 |
| 35:00 | Starting Demo 2 |
| 40:00 | Slide 20 (Patterns) |
| 45:00 | Q&A |
| 50:00 | Done |

## If Running Short on Time

Skip or abbreviate in this order:
1. Slide 5 (Architecture diagram) — just describe verbally
2. Slide 14 (Agent JSON/Built-ins right column) — mention briefly
3. Demo 2 second example — just run the first command
4. Slide 20 patterns 3 and 4 — cover 1 and 2 only

## If Running Long

Cut the audience questions on Slide 22 to one — the risk question is the most valuable one.

---

## Demo Failure Recovery

**If OpenCode can't connect to LLM API:**
> "Let me switch to the pre-recorded output in `demo-repo/rehearsals/`. This is exactly what you'd see — I ran this yesterday and captured it."

Files to prepare:
- `demo-repo/rehearsals/demo1-output.txt` — Obsidian plugin session output
- `demo-repo/rehearsals/demo2-output.txt` — CLI analysis output

**If npm install hangs:**
> "This is actually a great teaching moment — I'll hit Escape to cancel and show you how to use `/undo` to clean up."

**If permission dialog doesn't appear:**
> "Check that the demo `opencode.json` has bash set to ask — let me quickly verify that."

---

*Generated for Q-Summit 2026 — workshop-agentic/docs/TALK_TRACK.md*
