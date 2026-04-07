# Release Checklist

## Pre-workshop

### Slides & docs
- [ ] `npm install` in `slides/`
- [ ] `slidev build` succeeds (no errors, no broken imports)
- [ ] PDF handout exported to `docs/handout.pdf`
- [ ] All SVGs in `slides/public/` render correctly in browser
- [ ] `docs/TALK_TRACK.md` printed or open on secondary device

### Demo 1 — Obsidian Plugin
- [ ] Obsidian test vault created at known path
- [ ] `opencode-demo` plugin built: `npm run build` in `obsidian-plugin/`
- [ ] Plugin files copied to test vault: `main.js`, `manifest.json`, `styles.css`
- [ ] Plugin enabled in Obsidian → Settings → Community plugins
- [ ] Command palette (Ctrl+P) shows "OpenCode: Generate Note"
- [ ] Mock fallback verified: disable MCP server, run command, confirm modal shows mock text
- [ ] checkpoint-1 state verified: `cat checkpoint-1/main.ts` shows empty stub
- [ ] checkpoint-2 state verified: has `opencode.json`

### Demo 2 — CLI Fallback
- [ ] `chmod +x demo-repo/cli-fallback/run-demo.sh`
- [ ] Mock mode tested: `./run-demo.sh` completes without errors
- [ ] Bug present in working copy: `grep "a \* b" sample-repo/src/calculator.ts`
- [ ] checkpoint-2 state reset: `cp -r checkpoint-2/. demo-repo/cli-fallback/`
- [ ] `diff checkpoint-2/sample-repo/src/calculator.ts checkpoint-3/sample-repo/src/calculator.ts` shows exactly the fix

### OpenCode setup (live mode)
- [ ] `opencode` installed: `opencode --version` prints version
- [ ] `opencode` authenticated: `opencode auth status` shows active session
- [ ] `GITHUB_MCP_TOKEN` set in env (or fallback mock confirmed ready)
- [ ] Test run: `opencode run "Hello"` responds in <10s

### Presenter machine
- [ ] Terminal font: 18pt minimum
- [ ] Terminal window maximised before slides
- [ ] Obsidian window on primary display, terminal accessible via alt-tab
- [ ] Presenter notes display confirmed on secondary screen
- [ ] `asciinema` installed (optional — for recording)

---

## During workshop

### Slides
- [ ] Slides on projector (presenter view on laptop)
- [ ] Current slide number tracked against TALK_TRACK timing
- [ ] Slide clicker tested

### Demo 1
- [ ] Terminal ready in `demo-repo/obsidian-plugin/`
- [ ] Obsidian test vault open
- [ ] `checkpoint-1/` ready for reset (`cp checkpoint-1/*.* .`)
- [ ] Fallback plan confirmed (if live fails → switch to terminal walkthrough)

### Demo 2
- [ ] Terminal ready in `demo-repo/cli-fallback/`
- [ ] `run-demo.sh` in PATH or `./ `prefix ready
- [ ] `checkpoint-2/` state confirmed (bug present, opencode.json present)
- [ ] `./run-demo.sh` (mock) ready as instant fallback

---

## Post-workshop

- [ ] Recording uploaded (asciinema.org or internal drive)
- [ ] `.cast.placeholder` files replaced with real recordings
- [ ] `docs/handout.pdf` shared with attendees (email or link)
- [ ] Repo made public (if desired) — remove any credentials first
- [ ] Feedback form shared with attendees
- [ ] `rehearsals/rehearsal-notes.md` updated with what actually happened
