# Recording Guide

How to record demo sessions locally for async sharing, slide embeds, or backup playback.

---

## Recommended tools

| Tool | Best for | OS |
|---|---|---|
| `asciinema` | Terminal-only demos (CLI fallback) | Linux/macOS |
| OBS Studio | Full screen (Obsidian + terminal) | Linux/macOS/Windows |
| `vhs` (charmbracelet) | Scripted terminal recordings → GIF | Linux/macOS |

---

## Option A — asciinema (terminal demos)

### Install

```bash
# Ubuntu/Debian
sudo apt install asciinema

# macOS
brew install asciinema
```

### Record Demo 2 (CLI fallback)

```bash
cd demo-repo/cli-fallback

# Start recording
asciinema rec demo2-run1.cast

# Inside the recording, run:
./run-demo.sh --live   # or without --live for mock mode

# Stop recording
exit   # or Ctrl+D
```

### Record Demo 1 (Obsidian — terminal portion only)

```bash
cd demo-repo/obsidian-plugin

asciinema rec demo1-run1.cast

# Inside the recording:
cat checkpoint-1/main.ts
opencode   # (live) or walk through files manually (mock)

exit
```

### Play back

```bash
asciinema play demo2-run1.cast

# Slow it down
asciinema play --speed=0.5 demo2-run1.cast
```

### Upload to asciinema.org (optional)

```bash
asciinema upload demo2-run1.cast
# Returns a shareable URL
```

---

## Option B — OBS Studio (full screen with Obsidian)

### Setup

1. Download: https://obsproject.com/
2. Create a new Scene
3. Add source: **Display Capture** (full screen) or **Window Capture** (Obsidian window)
4. Add source: **Audio Input** (microphone) if narrating
5. Set output format: MP4, 1920×1080, 30fps

### Record

1. Open Obsidian + terminal side-by-side
2. Click **Start Recording** in OBS
3. Run through the rehearsal script
4. Click **Stop Recording**

### Output location

By default: `~/Videos/` on Linux, `~/Movies/` on macOS

---

## Option C — vhs (scripted GIF/MP4)

Best for short, reproducible segments.

### Install

```bash
brew install vhs   # macOS
# Or: go install github.com/charmbracelet/vhs@latest
```

### Example tape file (`demo2.tape`)

```
Output demo2.gif
Set FontSize 18
Set Width 1200
Set Height 600

Type "cd demo-repo/cli-fallback"
Enter
Sleep 500ms

Type "./run-demo.sh"
Enter
Sleep 2s

# etc.
```

### Run

```bash
vhs demo2.tape
# Produces demo2.gif
```

---

## Expected output files

After recording, place files in `rehearsals/`:

```
rehearsals/
  demo1-run1.cast    Full live Obsidian demo (asciinema)
  demo1-run2.cast    Mock/offline Obsidian walkthrough
  demo2-run1.cast    Full live CLI demo (asciinema)
  demo2-run2.cast    Mock CLI demo via run-demo.sh
```

The `.cast.placeholder` files in this directory contain reproduction instructions
for each recording.

---

## Compression / sharing

```bash
# Convert asciinema cast to GIF (requires agg)
# https://github.com/asciinema/agg
agg demo2-run1.cast demo2-run1.gif

# Compress MP4 (OBS output)
ffmpeg -i demo1-run1.mp4 -crf 23 -preset fast demo1-run1-compressed.mp4
```
