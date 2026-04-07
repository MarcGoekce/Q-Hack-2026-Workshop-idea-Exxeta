# Rehearsal Notes

## Overall timing targets

| Demo | Target | Hard max |
|---|---|---|
| Demo 1 — Obsidian Plugin | 8–10 min | 12 min |
| Demo 2 — CLI Fallback | 8–10 min | 12 min |
| Buffer / Q&A per demo | 2–3 min | — |
| **Total demo block** | **20–26 min** | **30 min** |

---

## Known issues

### Demo 1 — Obsidian Plugin

| Issue | Likelihood | Impact |
|---|---|---|
| OpenCode response time >20s | Medium | Low — scripted talking points fill the gap |
| Obsidian plugin fails to reload | Low | Medium — switch to terminal walkthrough |
| `requestUrl` CORS / network error | Medium | None — offline fallback triggers, which demonstrates the feature |
| OpenCode auth expiry | Low | High — pre-authenticate before session; keep mock mode ready |

### Demo 2 — CLI Fallback

| Issue | Likelihood | Impact |
|---|---|---|
| `opencode` not on PATH | Medium | Low — `./run-demo.sh` works without it |
| API rate limit mid-demo | Low | Medium — switch to `./run-demo.sh` (mock mode) |
| Wrong terminal font size | Medium | Medium — set to 18pt before stage |
| Forgot to reset checkpoint | Medium | Low — `cp -r checkpoint-2/. .` fixes it |

---

## "If this fails, do this" — quick recovery map

### Obsidian plugin won't load
```bash
# Switch to terminal-only walkthrough
cd demo-repo/obsidian-plugin
cat checkpoint-1/main.ts     # show starting point
cat main.ts                  # show finished state
cat .opencode/agents/coder.md  # show agent config
```
Say: "Let me show you the code diff directly — same story, no plugin required."

### OpenCode not authenticated / 401 error
```bash
# Show the tool works (even if auth is broken)
opencode --version
opencode --help

# Then switch to mock
cd demo-repo/cli-fallback
./run-demo.sh   # mock mode — no auth needed
```
Say: "In a real session you'd run `opencode auth` first — let me show the mock
output which is representative of what you'd see."

### OpenCode TUI freezes
- Press `Ctrl+C` to exit
- Say: "Let me show the pre-recorded output"
- Switch to: `cat mock-responses/plan-output.txt`

### Live edit permission prompt doesn't appear
- Check `opencode.json` has `"edit": "ask"` not `"edit": "allow"`
- Reset: `cp checkpoint-2/opencode.json .`

### Wrong demo directory (ran from wrong folder)
```bash
pwd   # check where you are
cd /path/to/workshop-agentic/demo-repo/cli-fallback
```

---

## Pre-demo checklist (run 30 min before)

- [ ] `opencode --version` prints without error
- [ ] `opencode auth status` shows authenticated (or mock mode confirmed)
- [ ] Obsidian open with test vault, `opencode-demo` plugin loaded
- [ ] Terminal font size: 18pt, window maximised
- [ ] `run-demo.sh` is executable: `chmod +x run-demo.sh`
- [ ] checkpoint states verified: `diff checkpoint-1 checkpoint-2` shows only `opencode.json` added
- [ ] Mock mode tested: `./run-demo.sh` completes without errors
- [ ] Slide deck open on second display (presenter view)

---

## Audience pacing notes

- **Pause after plan output** — audience needs ~5s to read the terminal
- **Spell out the permission prompt** — most people have never seen `edit: ask`
- **Don't rush the diff** — the before/after is the punchline
- **Questions welcome at any pause** — the `[Press Enter to continue]` prompts are
  intentional breathing room
