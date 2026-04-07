# Rehearsal 2 — CLI Fallback Demo

**Target time:** 8–10 minutes  
**Demo directory:** `demo-repo/cli-fallback/`

---

## Run 1 — Full Live Flow (opencode installed)

### Pre-conditions
- `opencode` installed and authenticated
- Terminal open in `demo-repo/cli-fallback/`
- Bug is present (using checkpoint-2 state)
- Font size: 18pt minimum

---

### Script

**[0:00]** Set up checkpoint-2 state.

```bash
cp -r checkpoint-2/. .
```

**Say:** "Our starting point: a small TypeScript calculator project with a bug.
OpenCode config is already in place. Let's see what the agent makes of this."

---

**[0:45]** Show the code.

```bash
cat sample-repo/src/calculator.ts
```

**Say:** "Four arithmetic functions. One of them is wrong — but I'm not going
to tell OpenCode where the bug is. I'll just ask it to analyse the file."

---

**[1:30]** Run OpenCode in plan mode.

```bash
opencode run --plan "Find and fix any bugs in src/calculator.ts"
```

**Say while waiting (~5s):** "Plan mode shows us what the agent intends to do
before it touches any files. The permission config says `edit: ask`, so even
in non-plan mode it would ask before writing."

Expected output: agent identifies `divide()` returning `a * b` instead of `a / b`.

---

**[3:00]** Ask a natural language question.

```bash
opencode run "What does src/calculator.ts do? Any issues?"
```

**Say:** "Same finding, different framing. The agent explains the code and
highlights the bug. Notice it also suggests a zero-division guard — that
wasn't in my prompt."

---

**[4:30]** Apply the fix.

```bash
opencode run "Fix the bug in divide() — it should divide, not multiply"
```

OpenCode asks for edit permission — approve it.

**Say:** "Permission prompt — because `edit: ask` in our config. In a CI
environment you'd set this to `allow`. In a demo, `ask` makes the control
flow visible to the audience."

---

**[6:00]** Show the result.

```bash
cat sample-repo/src/calculator.ts
```

**Say:** "One line changed. The agent didn't touch anything else. That's the
minimal-change discipline we set in the agent config."

---

**[7:00]** Compare checkpoint-2 vs checkpoint-3.

```bash
diff checkpoint-2/sample-repo/src/calculator.ts checkpoint-3/sample-repo/src/calculator.ts
```

**Say:** "The checkpoint diff shows exactly what changed. You could use this
to step through the story without rerunning anything."

---

**[8:30]** Wrap up.

**Say:** "The agent found the bug, explained it, fixed it with minimal change,
and asked for permission before writing. All in under 8 minutes.
The `opencode.json` permissions are what keep it safe to run in live demos."

---

## Run 2 — Mocked / Offline Flow

### Use when
- OpenCode not installed / no auth
- Network unavailable

### Pre-conditions
- Terminal only
- `demo-repo/cli-fallback/` directory

---

### Script

**[0:00]** Show the bug.

```bash
./run-demo.sh
# This runs in mock mode by default
```

**Say:** "This scripted runner uses pre-recorded output from `mock-responses/`.
The story is identical — we're just playing back what OpenCode would have said."

Follow the prompts. The script pauses at each step for audience questions.

---

**[2:00]** Show plan-output.txt directly.

```bash
cat mock-responses/plan-output.txt
```

**Say:** "This is a realistic facsimile of OpenCode's plan output format.
The model, timing, token counts — all representative."

---

**[3:30]** Show the fix (checkpoint-3).

```bash
diff checkpoint-2/sample-repo/src/calculator.ts checkpoint-3/sample-repo/src/calculator.ts
```

**Say:** "The fixed version added a zero-division guard too. That's the
agent going slightly beyond the brief — which is usually what you want."

---

**[5:00]** Show the opencode.json permission config.

```bash
cat opencode.json
```

**Say:** "Three permission categories: bash is `ask`, edit is `ask`, read is `allow`.
This is the minimal safe config for a demo. In a real project you'd tune these
per-command."

---

**[6:30]** Wrap up.

**Say:** "Even offline, every piece of the story is here: the bug, the analysis,
the plan, the fix. The mock-responses folder is your safety net for any demo."

---

## Timing notes

| Segment | Run 1 (live) | Run 2 (mocked) |
|---|---|---|
| Setup / show code | 1:30 | 1:00 |
| Plan mode output | 2:00 | 1:30 |
| Apply fix | 2:30 | 2:00 |
| Comparison / wrap | 2:30 | 2:00 |
| **Total** | **~8:30** | **~6:30** |

---

## Recovery notes

| Problem | Recovery |
|---|---|
| `opencode` not on PATH | `which opencode || echo not found` → switch to `./run-demo.sh` (mock) |
| Auth error | Show the error message — "this is what auth failure looks like in the TUI" → switch to mock |
| Fix isn't applied (permission denied) | Re-run without `--plan` and approve the permission prompt |
| `cat` output too small | Zoom terminal before demo: `Ctrl+-` / `Ctrl++` |
| diff shows nothing | Forgot to copy checkpoint-2 back — `cp -r checkpoint-2/. .` to reset |
