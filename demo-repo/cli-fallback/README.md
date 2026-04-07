# OpenCode Demo — CLI Fallback

A reproducible CLI demo showing OpenCode finding and fixing a bug in a small TypeScript project.
Works fully offline using `mock-responses/`.

## What this demo shows

1. OpenCode in **plan mode** — sees the code and produces a plan without making changes
2. OpenCode answering a natural-language question about the codebase
3. OpenCode proposing (and optionally applying) a fix
4. How `opencode.json` permission settings control what the agent can modify
5. The before/after story via checkpoint folders

## How to run

### Mocked (offline — no OpenCode needed)

```bash
cd demo-repo/cli-fallback
chmod +x run-demo.sh
./run-demo.sh
```

Shows pre-recorded output from `mock-responses/`. Safe to run anywhere.

### Live (requires OpenCode installed and authenticated)

```bash
cd demo-repo/cli-fallback
./run-demo.sh --live
```

OpenCode will actually analyse `sample-repo/src/calculator.ts` and interact.

### Manual live walkthrough

```bash
cd demo-repo/cli-fallback
opencode                  # opens interactive TUI

# Inside OpenCode, type:
# What does src/calculator.ts do? Any issues?
#
# Then:
# Fix the bug in divide() — it should divide, not multiply
```

## Checkpoint descriptions

| Checkpoint | State | What it represents |
|---|---|---|
| `checkpoint-1/` | Sample repo only | Starting point — no OpenCode config yet |
| `checkpoint-2/` | + opencode.json | OpenCode configured, bug still present |
| `checkpoint-3/` | + fix applied | After agent run — divide() is correct |

### Reset to a checkpoint

```bash
# Reset to checkpoint-1 (no opencode.json)
cp -r checkpoint-1/. .

# Reset to checkpoint-2 (ready to run)
cp -r checkpoint-2/. .
```

## Expected output (mock mode)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STEP 1 — The Code Under Review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// BUG: should be a / b
export function divide(a: number, b: number): number {
  return a * b;
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STEP 2 — OpenCode Analyses the Code
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[see mock-responses/plan-output.txt]
```

## Project structure

```
cli-fallback/
  sample-repo/
    src/
      calculator.ts    Simple calculator with intentional bug
      index.ts         Entry point that prints results
    package.json
    tsconfig.json
  opencode.json        Permission config (bash: ask, edit: ask, read: allow)
  run-demo.sh          Scripted demo runner (--live flag for real runs)
  mock-responses/
    plan-output.txt    Pre-recorded plan output showing bug found
    agent-answer.txt   Pre-recorded answer to "what does this code do?"
  checkpoint-1/        Sample repo, no config
  checkpoint-2/        Config added, bug present
  checkpoint-3/        Fix applied by agent
  README.md            This file
```
