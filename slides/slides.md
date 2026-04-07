---
theme: default
title: Agentic Coding with OpenCode
info: |
  Workshop: Agentic Coding with OpenCode
  Q-Summit 2026
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Agentic Coding with OpenCode

**Q-Summit 2026**

Building software with AI agents that plan, act, and observe

<div class="pt-12">
  <span class="px-2 py-1 rounded text-sm font-mono">50-minute workshop</span>
</div>

<!-- Notes:
Welcome everyone. Today we're going hands-on with agentic coding using OpenCode — an open-source terminal-based AI coding agent. By the end of this session you'll understand how these systems work, how to configure them safely, and how to use them on real projects.
-->

---
layout: default
---

# Agenda

| Time | Section |
|------|---------|
| 00:00–05:00 | What is Agentic Coding? |
| 05:00–15:00 | OpenCode: Architecture & Core Concepts |
| 15:00–25:00 | MCP Servers & Permissions |
| 25:00–40:00 | Live Demos (Obsidian Plugin + CLI) |
| 40:00–50:00 | Patterns, Pitfalls & Q&A |

**Goal:** Leave able to run OpenCode on a real project today.

<!-- Notes:
Here's our roadmap. We'll move from theory to hands-on demos in the middle section. Questions are welcome throughout — raise your hand or drop in chat. I'll also pause for audience Q&A at natural breakpoints.
-->

---
layout: default
---

# Current standing


<div class="grid grid-cols-2 gap-8 my-20">
  <div class="flex flex-col items-center gap-4">
    <img src="/github.svg" class="w-16" />
    <img src="/github-text.svg" class="w-30" />
  </div>
  <div class="flex flex-col items-center gap-4">
    <img src="/claude-color.svg" class="w-16" />
    <img src="/claude-text.svg" class="w-30" />
  </div>
</div>

- Big enterprise solutions: Copilot / Claude
- They are agentic tools to work with LLM models in a smart and complex way
- It just works™
- Not open source → proprietary models
- Not flexible, if you want them to be. #Apple

<!-- Speaker note: These tools are powerful but proprietary — OpenCode offers similar agentic power with open configs and permissions. -->

---
layout: default
---

# What is Agentic Coding?

Traditional coding assistants → **autocomplete / chat**

Agentic coding → **plan → act\* → observe → repeat**

<br/>

The key differences is the **Act** phase:

- **Autonomous multi-step execution** — the agent decides the next action
- **Tool use** — reads files, runs bash, searches the web
- **Feedback loops** — observes output and self-corrects
- **Configurable trust boundaries** — you decide what's auto-approved
- **Delegate work to further agents** – offload the tasks to spezialized agents

<br/>

> "You are now a junior developer on your team — except it ships code instantly"

<!-- Notes:
The shift is from suggestion-on-demand to autonomous task completion. An agent doesn't wait for you to accept each line. It reads your codebase, forms a plan, executes steps, and only stops when it's done or when it needs human judgment. That last point — configurable trust — is what makes production use safe.
-->

---
layout: default
---

# What Is an Agent?

An AI agent receives a goal, proposes a plan of steps, executes permitted tools, observes results, and iterates — subject to permissions and human oversight.

<br/>

<img src="/agent-loop.svg" class="max-h-[40vh] w-auto object-contain mx-auto" />

<br>

> ⚠️ Agents can still produce incorrect results — human review remains essential.

<!-- Speaker note: Keep this high-level; emphasise the need for human review and permissions before any autonomous execution. -->

---
layout: default
---

# Why Multiple Agents?

One agent with a broad scope often compromises. Multiple scoped agents give better safety, modularity, and parallelism.

| Single Agent                           | Multi-Agent (scoped)          |
| -------------------------------------- | ----------------------------- |
| One context, one role, all permissions | Each agent has a narrow scope |
| Generalist reasoning                   | Specialist prompts & scopes   |
| One trust boundary for everything      | Least-privilege per role      |

<br/>

**Example team:** @lead orchestrates → @analyst researches → @dev codes → @critic challenges → @qa validates

> ⚠️ "Specialist" means different prompts and permission scopes, not autonomous judgment — keep humans in the loop.

<!-- Speaker note: Mention that 'specialist' means different prompts/permissions, not different AI brains; always validate outputs with human oversight. -->

---
layout: default
---

# OpenCode

**OpenCode** is an open-source agent orchestrations tool built for the terminal.

```bash
# Install
curl -fsSL https://opencode.ai/install | bash
# or
npm install -g opencode-ai
```
```bash
# Run in your project
opencode
```

- Open-source (GitHub: anomalyco/opencode)
- Works with any LLM provider (Anthropic, OpenAI, Bedrock, local models)
- TUI, desktop app, IDE extension, CLI — same config everywhere
- First-class multi-agent orchestration built in

<!-- Notes:
OpenCode is not a SaaS wrapper. It's an open-source tool you install locally. It connects to whatever LLM provider you already have API keys for. The same config file works whether you're in the terminal, VS Code extension, or the desktop app.
-->

---
layout: default
---

# OpenCode Architecture

```
┌─────────────────────────────────────┐
│           User Interface            │
│   TUI  │  IDE Extension  │  Web     │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│         OpenCode Core               │
│  Agent Loop  │  Tool Router         │
│  Permissions │  Context Manager     │
└────┬──────────────────┬─────────────┘
     │                  │
┌────▼────┐      ┌──────▼──────┐
│  LLM    │      │    Tools    │
│Provider │      │bash│read│MCP│
└─────────┘      └─────────────┘
```

Config files: `opencode.json` (global or per-project) + `AGENTS.md`

<!-- Notes:
The core loop is: receive user message → LLM decides next tool call → tool router executes it → result fed back to LLM → repeat. The permissions layer sits between the tool router and execution, gating which actions need human approval. Config is pure JSON.
-->

---
layout: default
---

# The Agent Loop

```
User Message
     │
     ▼
┌─────────────┐    tool call     ┌─────────────┐
│  LLM Plan   │ ──────────────► │ Tool Execute│
│  (think)    │                  │ (act)       │
└─────────────┘ ◄──────────────  └─────────────┘
     │           tool result           │
     │                                 │
     ▼                                 ▼
 Next step?                    Permission check
 Done? Ask?                    allow / ask / deny
```

<br/>

Modes:
- **Build** (default) — full tool access
- **Plan** — read-only, edits require approval → switch with `Tab`

<!-- Notes:
Every agent loop iteration: the LLM emits a tool call JSON, OpenCode's router intercepts it, checks permissions, executes if allowed, returns the result. This loop continues until the model emits a plain text response with no tool calls. The Tab key switches between Build (full power) and Plan (analysis only) modes without restarting.
-->

---
layout: default
---

# Built-in Tools

| Tool | Purpose |
|------|---------|
| `bash` | Run shell commands (`npm install`, `git status`) |
| `read write edit` | Read and manipulate file contents (line-range aware) |
| `skill` | Load a `SKILL.md` instruction set |
| `todowrite` | Manage task lists in-session |
| `delegate` | Delegates a task to a subagent and reads the response |
| `question` | Ask user for input mid-task |
| `tool_use` | Reads and uses MCP tool commands from active servers |
| `lsp` | Go-to-definition, find-references (experimental) |

<!-- Notes:
These are the tools the LLM can call. Each one maps to a permission key — so you can allow, ask, or deny them individually. The `edit` permission actually covers edit, write, apply_patch, and multiedit — they're grouped under one gate. `websearch` requires the OpenCode provider or `OPENCODE_ENABLE_EXA=1`.
-->

---
layout: default
---

# MCP Servers — What & Why

**MCP = Model Context Protocol**

A standard for connecting LLMs to external tools and services.

<br/>

Why it matters:
- Extend OpenCode with **any external API** (Sentry, Jira, GitHub, databases)
- Tools become first-class citizens alongside built-ins
- The LLM uses them the same way — just another tool call
- Context cost: each MCP server adds tokens → use selectively

<br/>

```
OpenCode ◄──── stdio (local) ────► MCP Process
OpenCode ◄──── HTTPS (remote) ───► MCP Server
```

<!-- Notes:
MCP is becoming the USB-C of AI tool integration. Instead of every tool vendor writing a custom plugin, they expose an MCP server and any MCP-compatible client can use it. OpenCode supports both local (subprocess) and remote (HTTPS) servers. The key caveat: every server's tool list adds to the context window, so don't add 10 MCP servers and forget about them.
-->

---
layout: two-cols
---

# MCP Config: Local Server

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "filesystem": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem",
                  "/path/to/allowed"],
      "enabled": true,
      "environment": {
        "DEBUG": "1"
      }
    }
  }
}
```

::right::

# MCP Config: Remote + OAuth

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "oauth": {}
    },
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "{env:CONTEXT7_API_KEY}"
      }
    }
  }
}
```

<!-- Notes:
Left: local MCP starts a subprocess with npx. The command array is the full argv. environment injects env vars into that process. Right: remote MCP uses HTTPS. OAuth can be automatic (just `{}`) — OpenCode handles the browser flow via Dynamic Client Registration. The `{env:VAR}` interpolation keeps secrets out of config files.
-->

---
layout: default
---

# Permissions — Why They Matter

**Without permissions: the agent can do anything.**

- Delete production config
- Push to main without review
- Read `.env` files with secrets
- Execute `rm -rf` variants

<br/>

OpenCode permission model: 3 outcomes per tool:
- `"allow"` — run without prompt
- `"ask"` — show UI dialog (once / always / reject)
- `"deny"` — block entirely

Default: most tools `allow`, `.env` files `deny`, `doom_loop` and `external_directory` → `ask`

<!-- Notes:
Permissions are the seatbelt of agentic coding. The agent is powerful and will do what you ask efficiently — including things you didn't intend. The permission layer is your last line of defense before bash runs. Think of it as mandatory code review for automated actions.
-->

---
layout: default
---

# Permission Config — Real Examples

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "*": "ask",
    "bash": {
      "*": "ask",
      "git *": "allow",
      "npm *": "allow",
      "rm *": "deny",
      "grep *": "allow"
    },
    "edit": {
      "*": "deny",
      "packages/web/src/content/docs/*.mdx": "allow"
    },
    "read": {
      "*": "allow",
      "*.env.*": "deny",
      "*.env.example": "allow"
(…)
```

> Rules evaluated **last-match-wins**. Put `"*"` first, specifics after.

<!-- Notes:
This is a real-world config. We start with "ask everything", then carve out safe allowlists. Git and npm commands are auto-approved; `rm *` is blocked. Edits are denied everywhere except the docs folder. `.env` files are never readable — this is actually the OpenCode default behavior, we're just making it explicit.
-->

---
layout: default
---

# Configuring your agent team

Before agents can collaborate effectively, you need to tell them who they are and what they're allowed to do.

- **What this section covers:** AGENTS.md, agent files, permissions
- **Why it matters:** configuration is how you enforce roles, scope, and safety boundaries

---
layout: default
---

# AGENTS.md — Project Rules

Rule files injected as plain text into every agent session's system prompt:

| File                         | When active                             | Best for                                    |
| ---------------------------- | --------------------------------------- | ------------------------------------------- |
| `AGENTS.md` in project root    | Sessions in that directory (or subdirs) | Build commands, architecture, conventions   |
| `~/.config/opencode/AGENTS.md` | Every session, all projects             | Personal preferences (not committed to Git) |

Both files are **combined** — project rules stack on top of global rules.

<br/>

**Bootstrap with `/init`** — scans your repo, may ask clarifying questions, then creates *or improves* an existing `AGENTS.md` in place. [Learn more: /init docs](https://opencode.ai/docs/rules#initialize)

---
layout: default
---

# AGENTS.md — Project Rules

```markdown
# Obsidian Plugin Demo

## Off-limits
- Do not modify `manifest.json` version field during demos
- Do not run `npm publish`

## Available Agents
- **@coder** — TypeScript / Obsidian API specialist
```

_Example from this workshop's own `.opencode/AGENTS.md`_

> Commit `AGENTS.md` to Git — it's shared team knowledge, not personal config.

<br/>

> ⚠️ AGENTS.md is plain text — agents follow it as instructions, not as enforced rules. Permissions in `opencode.json` are the true enforcement layer.

<!-- Notes:
AGENTS.md is the project's instruction manual for AI agents. It's just text injected into every session's system prompt — no magic. The /init command bootstraps it by analyzing your codebase; if one already exists it improves it in place. Both project and global files are combined into the same context. The example here is from the actual demo repo in this workshop. Remind attendees: AGENTS.md guides behavior; opencode.json permissions enforce it. Keep AGENTS.md focused — the whole file is loaded every session.
-->

---
layout: default
---

# Agent Files — Configuration Shape

**Markdown agents** live in:
- Global: `~/.config/opencode/agents/review.md`
- Project: `.opencode/agents/review.md`

```markdown
---
description: Code review without making edits
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
permission:
  edit: deny
  bash:
    "git diff": allow
    "grep *": allow
  webfetch: deny
---
You are a code reviewer. Focus on:
- Security and input validation
- Performance implications
- Code clarity and maintainability

Provide constructive feedback. Do not make changes.
```

<!-- Notes:
The filename becomes the agent name. Frontmatter sets permissions, model, temperature. The body is the system prompt. The `mode: subagent` means this agent can be @-mentioned or invoked by a primary agent's Task tool. Per-agent permissions override global permissions — so this review agent literally cannot edit files even if global config allows it.
-->

---
layout: two-cols
---

# Agent Config: JSON Style

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "build": {
      "mode": "primary",
      "model": "anthropic/claude-sonnet-4-20250514",
      "permission": {
        "bash": {
          "*": "ask",
          "git status *": "allow",
          "npm run *": "allow"
        }
      }
    },
    "code-reviewer": {
      "description": "Reviews code for best practices",
      "mode": "subagent",
      "permission": {
        "edit": "deny",
        "bash": "deny"
      }
    }
  }
}
```

::right::

# Built-in Agents

**Primary** (cycle with Tab):
- `build` — full access (default)
- `plan` — edits/bash require ask

**Subagents** (@ mention or auto):
- `general` — full access, parallel tasks
- `explore` — read-only, fast codebase search

**Hidden system agents:**
- `compaction` — auto-compacts long contexts
- `title` — generates session titles
- `summary` — session summaries

<!-- Notes:
You override built-in agents by name in config. The `permission.task` option lets you control which subagents an agent can spawn — useful for building orchestrator→worker hierarchies. Hidden agents run automatically and aren't user-selectable.
-->

---
layout: default
---

# What you'll build

In the next two demos you'll go from zero to a working agentic workflow.

- **Goal:** scaffold and analyze real code with OpenCode — no manual edits
- **Step 1:** Use Plan mode to review an architecture before touching files
- **Step 2:** Switch to Build mode and watch the agent execute the plan
- **Step 3:** Run a non-interactive analysis pass suitable for CI pipelines

**Expected outcome:** a scaffolded Obsidian plugin and a structured refactoring report, produced entirely by the agent under your permission rules.

---
layout: default
---

# Demo 1: Obsidian Plugin Scaffold

**Goal:** Use OpenCode to scaffold a new Obsidian plugin from scratch.

Setup:
```bash
cd workshop-agentic/demo-repo/obsidian-plugin
opencode
```

Steps we'll follow:
1. Switch to **Plan mode** (Tab) — ask for architecture overview
2. Review the plan together
3. Switch to **Build mode** (Tab) — execute
4. Watch agent: read existing examples → write plugin boilerplate → run `npm install`
5. Use `/undo` to revert one change and re-prompt

What to observe:
- Tool calls streamed live (bash, write, read)
- Permission prompts for npm commands
- How the agent reasons about file structure

<!-- Notes:
Switch to terminal now. We have an empty obsidian-plugin directory. I'll type a natural language prompt: "Scaffold a new Obsidian plugin that shows word count in the status bar. Use TypeScript. Follow the official Obsidian plugin template structure." First let's watch it plan, then build. Pay attention to when the permission dialog appears.
-->

---
layout: default
---

# Demo 1: Walkthrough Notes

```
Plan output example:
1. Create manifest.json with plugin metadata
2. Create main.ts with Plugin class extending Plugin
3. Create styles.css for status bar styling
4. Create package.json with esbuild config
5. Run npm install

Build execution:
[write] manifest.json          → auto-allow (new file)
[write] main.ts                → auto-allow (new file)
[bash] npm install             → PERMISSION PROMPT
  > once | always | reject
[bash] npm run build           → PERMISSION PROMPT
```

Key observations:
- Agent reads `obsidian` npm package types to understand the API
- Glob searches for existing examples before writing
- Context7 MCP could provide live Obsidian API docs

<!-- Notes:
After the demo, highlight: the agent didn't just write boilerplate — it read the obsidian type definitions to understand the correct API surface. This is the difference between an LLM guessing and an agent with tools actually looking things up. The permission prompt for npm is expected — we haven't whitelisted npm in this config yet.
-->

---
layout: default
---

# Demo 2: CLI Plan Mode on Existing Repo

**Goal:** Analyze a messy CLI repo, get a refactoring plan — no changes made.

```bash
cd workshop-agentic/demo-repo/cli-fallback
opencode run --agent plan "Analyze this CLI codebase.
Identify the top 3 refactoring opportunities.
Output a structured plan with effort estimates."
```

This uses:
- `opencode run` — single-shot, non-interactive
- `--agent plan` — forces Plan mode (no edits)
- Stdout output suitable for CI pipelines

<!-- Notes:
Switch to terminal. The cli-fallback repo is a small Node CLI with some deliberate code smells. We'll run opencode in non-interactive mode — useful for CI gates, code review automation, or scheduled analysis jobs. The --agent plan flag ensures zero file modifications even if the model tries.
-->

---
layout: default
---

# Demo 2: Walkthrough

```bash
# Non-interactive analysis
opencode run --agent plan \
  "Find all TODO comments and create a prioritized issue list"

# Pipe output to a file
opencode run --agent plan \
  "Summarize the public API surface of this module" > api-summary.md

# With custom AGENTS.md context
OPENCODE_CONFIG=./opencode.ci.json opencode run \
  "Check for any hardcoded credentials or API keys"
```

Real-world CI pattern:
```yaml
# .github/workflows/ai-review.yml
- name: AI Code Review
  run: |
    opencode run --agent plan \
      "Review this PR diff for security issues. Be concise."
```

<!-- Notes:
The non-interactive mode is where OpenCode shines for automation. You can pipe its output, use it in GitHub Actions, run scheduled analysis. The key is always using --agent plan or a custom deny-all agent in CI — never let an automated pipeline run with full build permissions.
-->

---
layout: default
---

# Skills — Reusable Instruction Sets

Skills are named `SKILL.md` files loaded on-demand by agents.

```
.opencode/skills/git-release/SKILL.md
~/.config/opencode/skills/deploy-checklist/SKILL.md
```

```markdown
---
name: git-release
description: Create consistent releases and changelogs
license: MIT
compatibility: opencode
---

## What I do
- Draft release notes from merged PRs
- Propose a version bump
- Provide a copy-pasteable `gh release create` command

## When to use me
Use when preparing a tagged release.
```

Agent sees available skills in tool description → loads on demand via `skill({ name: "git-release" })`

<!-- Notes:
Skills solve the "system prompt bloat" problem. Instead of putting every workflow into AGENTS.md, you write a SKILL.md. The agent sees a list of available skills and loads the full content only when relevant. Skills can be permissioned — `deny` hides them from the agent entirely, `ask` prompts before loading.
-->

---
layout: default
---

# Real-World Patterns

**Pattern 1: Trust Tiers**
```
read-only tier:    plan agent, explore subagent
restricted tier:   git allow, npm allow, rm deny
full-trust tier:   only in dev, never in CI
```

**Pattern 2: Per-Agent MCP Scoping**
```json
{ "tools": { "my-mcp*": false },
  "agent": { "research": { "tools": { "my-mcp*": true } } } }
```
→ MCP tools only available to the agent that needs them

**Pattern 3: Skills for Team Workflows**
```
.opencode/skills/release-checklist/SKILL.md
.opencode/skills/pr-template/SKILL.md
.opencode/skills/security-review/SKILL.md
```
→ Shared, versioned, Git-committed team knowledge

**Pattern 4: AGENTS.md as Living Docs**
Update after every significant architecture decision.

<!-- Notes:
These four patterns have emerged from real production use. Trust tiers let you be paranoid in CI and permissive locally. MCP scoping prevents context bloat. Skills replace one-off prompting. And AGENTS.md becomes the most-read doc in your repo because the AI reads it every single session.
-->

---
layout: default
---

# Pitfalls & Anti-Patterns

**❌ "Allow everything" in shared environments**
```json
{ "permission": "allow" }  // NEVER in CI or shared machines
```

**❌ Secrets in config files**
```json
{ "headers": { "Authorization": "Bearer sk-abc123" } }  // bad
{ "headers": { "Authorization": "Bearer {env:MY_KEY}" } } // good
```

**❌ Ignoring `doom_loop` warnings**
Three identical tool calls = agent is stuck. Intervene, don't ignore.

**❌ Giant AGENTS.md**
The whole file is injected every session. Keep it focused, use Skills for detail.

**❌ No `/init` before starting**
Without AGENTS.md, the agent guesses your conventions. Run `/init` first.

**✅ Always start with Plan mode for unfamiliar codebases**

<!-- Notes:
The doom_loop protection is important — when an agent calls the same tool three times with identical input, it's looping. OpenCode will ask permission to continue. That's your cue to give the agent different context or rephrase the task. The "allow everything in CI" trap is easy to fall into when demo-ing — never do it in real pipelines.
-->

---
layout: default
---

# Q&A — Discussion Prompts

<br/>

**For the audience:**

1. Where in your current workflow would an agentic step add the most value?

2. What's the riskiest thing you'd worry about giving an agent access to?

3. Has anyone tried MCP servers beyond the built-ins? What worked?

<br/>

**Resources:**
- Docs: https://opencode.ai/docs
- GitHub: https://github.com/anomalyco/opencode
- Discord: https://opencode.ai/discord
- This workshop: `workshop-agentic/` in the Q-Summit repo

<!-- Notes:
Open it up to the room. The best discussion usually comes from question 2 — people have strong intuitions about what's scary. That's actually healthy: it means they're thinking about trust boundaries, which is exactly the right mindset for working with agentic systems safely.
-->

---
layout: center
---

# Thank You

**Workshop materials:**

```bash
git clone <q-summit-repo>
cd workshop-agentic
# Follow README.md
```

<br/>

**OpenCode:**
`curl -fsSL https://opencode.ai/install | bash`

<br/>

Questions, feedback, follow-up: use the Q-Summit Discord channel **#agentic-coding**

<!-- Notes:
All materials are in the repo. The README has quick-start instructions and links to all docs sources we used today. If you hit issues getting OpenCode running, the Discord is very active and the maintainers respond quickly. Thanks for attending — go build something with it today.
-->
