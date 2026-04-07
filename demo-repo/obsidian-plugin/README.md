# OpenCode Demo — Obsidian Plugin

A minimal Obsidian plugin that demonstrates agentic coding integration with [OpenCode](https://opencode.ai).

## What this demo shows

1. How OpenCode acts as a coding agent inside an existing TypeScript project
2. How `.opencode/AGENTS.md` scopes agent behaviour per-project
3. How per-agent configs (`agents/coder.md`) override permissions and set the model
4. How MCP servers can expose Obsidian vault data to the agent
5. The checkpoint-by-checkpoint evolution of the plugin

## Quick start (local)

```bash
# 1. Install dependencies (Obsidian plugin dev setup)
npm install

# 2. Build the plugin
npm run build

# 3. Copy to your test vault
cp main.js manifest.json styles.css ~/.obsidian/plugins/opencode-demo/

# 4. Enable "OpenCode Demo" in Obsidian → Settings → Community plugins

# 5. Open Command Palette (Ctrl+P) and run:
#    "OpenCode: Generate Note"
```

## Offline / mocked fallback

If the local MCP server (`localhost:3333`) is not running, every command automatically
falls back to a pre-written mock response. The demo works without network access.

To demonstrate: simply don't start the MCP server. The plugin will show
`[MOCK] OpenCode agent would generate a note here.`

## Checkpoint descriptions

| Checkpoint | State | What changed |
|---|---|---|
| `checkpoint-1/` | Initial scaffold | `manifest.json` + empty `main.ts` — *"This is where we start"* |
| `checkpoint-2/` | MCP wired | `opencode.json` added — *"Now OpenCode knows about our MCP server"* |
| (root) | Full implementation | Complete plugin with commands, modal, settings tab |

### Using checkpoints in the live demo

```bash
# Reset to checkpoint-1 (before anything)
cp checkpoint-1/manifest.json .
cp checkpoint-1/main.ts .

# Reset to checkpoint-2 (MCP wired, before full impl)
cp checkpoint-2/manifest.json .
cp checkpoint-2/main.ts .
cp checkpoint-2/opencode.json .
```

## OpenCode integration

```bash
# Start OpenCode in this directory
opencode

# Prompt the coder agent:
# @coder Add a command that summarises the 5 most recent notes in the vault
```

The `.opencode/agents/coder.md` agent is pre-configured with:
- Model: `anthropic/claude-sonnet-4-5`
- Mode: `build`
- Bash: `npm *` and `git *` allowed; `rm *` denied
- Read: all files except `*.env`

## Project structure

```
obsidian-plugin/
  manifest.json          Plugin metadata
  main.ts                Plugin implementation (commands, modal, settings)
  styles.css             Plugin styles
  opencode.json          Local OpenCode config (MCP servers, permissions)
  .opencode/
    AGENTS.md            Project-level agent rules
    agents/
      coder.md           Per-agent config for the "coder" agent
  checkpoint-1/          Initial state (manifest + empty main.ts)
  checkpoint-2/          MCP wired (opencode.json added)
  README.md              This file
```
