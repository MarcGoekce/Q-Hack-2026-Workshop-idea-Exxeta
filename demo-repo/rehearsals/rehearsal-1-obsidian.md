# Rehearsal 1 — Obsidian Plugin Demo

**Target time:** 8–10 minutes  
**Demo directory:** `demo-repo/obsidian-plugin/`

---

## Run 1 — Full Live Flow (opencode + Obsidian running)

### Pre-conditions
- Obsidian open with test vault
- `opencode-demo` plugin installed and enabled
- `opencode` authenticated on presenter machine
- Terminal open in `demo-repo/obsidian-plugin/`
- Font size: 18pt minimum

---

### Script

**[0:00]** Open terminal. Show `checkpoint-1/` state.

```
cp checkpoint-1/manifest.json .
cp checkpoint-1/main.ts .
```

**Say:** "This is our starting point — a manifest and an empty plugin shell.
Watch how OpenCode takes us from zero to a working command palette integration."

---

**[0:45]** Run OpenCode.

```
opencode
```

**Say:** "OpenCode reads our project structure automatically. I'm going to ask
the coder agent to add a command that generates a note."

Type in OpenCode prompt:
```
@coder Add a "Generate Note" command to the plugin that calls localhost:3333/generate
and shows the result in a modal. Add an offline fallback.
```

**Say while waiting (~20s):** "Notice we're using @coder — that's the per-project
agent defined in `.opencode/agents/coder.md`. It has TypeScript and Obsidian API
context pre-loaded, and the permission rules we set earlier."

---

**[2:00]** OpenCode proposes changes. Walk through the diff.

**Say:** "It correctly used `requestUrl` instead of `fetch` — that's Obsidian's
HTTP API. And it added the offline fallback without being asked. The agent inferred
that from context."

Approve the edit (press `y` or Enter).

---

**[3:30]** Switch to checkpoint-2 to show MCP config.

```
cp checkpoint-2/opencode.json .
```

**Say:** "Now let's wire in the MCP server. This `opencode.json` tells OpenCode
where our local MCP server runs and what permissions it has. The `obsidian-notes`
server would give the agent real-time access to vault content."

Show `opencode.json` briefly in editor.

---

**[5:00]** Switch to Obsidian. Reload the plugin.

**Say:** "Back in Obsidian — let me reload the plugin and show the command palette."

Open Command Palette (Ctrl+P), type "OpenCode".

**Say:** "We see the two commands. Let me trigger 'Generate Note'."
Click — mock response shows in modal.

---

**[6:30]** Ask a follow-up question in OpenCode.

```
@coder What would happen if we called divide(10, 0) in the calculator?
```

**Say:** "This is the interactive loop — the agent stays in context. You can keep
building on the same session."

---

**[8:00]** Wrap up.

**Say:** "In 8 minutes we went from an empty plugin to a working command palette
integration with MCP wiring and an offline fallback. The agent understood the
Obsidian API constraints without us telling it explicitly — that came from the
`.opencode/agents/coder.md` configuration."

---

## Run 2 — Mocked / Offline Flow

### Use when
- No network, or OpenCode not authenticated
- Obsidian not available on demo machine

### Pre-conditions
- Terminal only — no Obsidian needed
- `demo-repo/obsidian-plugin/` directory

---

### Script

**[0:00]** Show project structure.

```bash
ls -la demo-repo/obsidian-plugin/
```

**Say:** "Without OpenCode running, we can still walk through the entire story
using the checkpoint folders as our before/after snapshots."

---

**[0:45]** Show checkpoint-1 (the before).

```bash
cat checkpoint-1/main.ts
```

**Say:** "This is where we start — just the skeleton. Four lines."

---

**[1:30]** Show the full implementation (the after).

```bash
cat main.ts
```

**Say:** "This is what OpenCode produced. Notice the offline fallback in the
catch block — the agent added that. Notice `requestUrl` instead of `fetch`.
These aren't coincidences; they come from the agent config in `.opencode/agents/coder.md`."

---

**[3:00]** Show `.opencode/agents/coder.md`.

```bash
cat .opencode/agents/coder.md
```

**Say:** "The frontmatter is the key bit. Mode, model, permission rules — all
declarative. This is how you scope an agent to a specific project."

---

**[5:00]** Show opencode.json / MCP config.

```bash
cat checkpoint-2/opencode.json
```

**Say:** "Checkpoint-2 adds the MCP server config. In a live demo this would
connect to your Obsidian vault via a local Node.js server."

---

**[6:30]** Wrap up.

**Say:** "Even offline, the story is clear: you configure the agent once,
the checkpoints show the progression, and the code quality speaks for itself."

---

## Timing notes

| Segment | Run 1 (live) | Run 2 (mocked) |
|---|---|---|
| Setup / checkpoint-1 | 1:00 | 0:45 |
| OpenCode interaction | 3:30 | 3:00 |
| Obsidian / plugin demo | 2:30 | — |
| Wrap-up | 1:00 | 1:00 |
| **Total** | **~8:00** | **~5:30** |

---

## Recovery notes

| Problem | Recovery |
|---|---|
| OpenCode takes >30s | Say: "While it's thinking, let me show you what it's going to produce" — switch to checkpoint-2 |
| Obsidian plugin won't load | "Let's do the terminal walkthrough" — switch to Run 2 script |
| `requestUrl` error | Expected in dev vault — the mock fallback triggers, which is actually what we want to show |
| OpenCode auth fails | `opencode --help` to show it's installed, then switch to mock mode |
