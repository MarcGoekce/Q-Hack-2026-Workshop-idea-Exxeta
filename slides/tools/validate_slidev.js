#!/usr/bin/env node
/**
 * validate_slidev.js
 * Validates slides.md for a Slidev presentation.
 *
 * Checks:
 * 1. YAML frontmatter present at top of file
 * 2. No malformed `---` separators (e.g. extra dashes, trailing spaces breaking slide detection)
 * 3. All image references ![](path) point to files that exist in ../public/
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — one or more errors found
 */

const fs = require("fs");
const path = require("path");

const SLIDES_PATH = path.join(__dirname, "..", "slides.md");
const PUBLIC_DIR = path.join(__dirname, "..", "public");

let errors = [];
let warnings = [];

// ─── Read file ───────────────────────────────────────────────────────────────
if (!fs.existsSync(SLIDES_PATH)) {
  console.error(`ERROR: slides.md not found at ${SLIDES_PATH}`);
  process.exit(1);
}

const content = fs.readFileSync(SLIDES_PATH, "utf8");
const lines = content.split("\n");

// ─── Check 1: frontmatter present ────────────────────────────────────────────
if (!content.startsWith("---")) {
  errors.push("FAIL [frontmatter]: slides.md must start with '---' YAML frontmatter");
} else {
  // Find closing --- of frontmatter
  let frontmatterClose = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      frontmatterClose = i;
      break;
    }
  }
  if (frontmatterClose === -1) {
    errors.push("FAIL [frontmatter]: Opening '---' found but no closing '---' for frontmatter");
  } else {
    const fm = lines.slice(1, frontmatterClose).join("\n");
    const requiredKeys = ["theme", "title", "highlighter", "transition"];
    for (const key of requiredKeys) {
      if (!fm.includes(key + ":")) {
        warnings.push(`WARN [frontmatter]: Expected key '${key}' not found in frontmatter`);
      }
    }
    console.log(`  OK  [frontmatter]: Found and closed at line ${frontmatterClose + 1}`);
  }
}

// ─── Check 2: slide separators ───────────────────────────────────────────────
let slideCount = 0;
let inFrontmatter = content.startsWith("---");
let frontmatterDone = false;
let badSeparators = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Skip the opening frontmatter block
  if (!frontmatterDone) {
    if (i === 0 && line.trim() === "---") continue;
    if (i > 0 && line.trim() === "---" && !frontmatterDone) {
      frontmatterDone = true;
      continue;
    }
    if (i > 0 && !frontmatterDone) continue;
  }

  // After frontmatter: look for slide separators
  if (line.trim() === "---") {
    slideCount++;
  } else if (/^---\s+/.test(line) && line.trim() !== "---") {
    // Has trailing content after ---
    // Layout annotations like "--- layout: center" are valid in Slidev
    // But bare trailing spaces are a warning
    if (/^---\s+$/.test(line)) {
      badSeparators.push(`Line ${i + 1}: '${line}' has trailing whitespace after '---'`);
    }
  } else if (/^-{4,}$/.test(line.trim())) {
    badSeparators.push(`Line ${i + 1}: '${line.trim()}' looks like extra dashes (expected exactly '---')`);
  }
}

if (badSeparators.length > 0) {
  for (const b of badSeparators) {
    errors.push(`FAIL [separator]: ${b}`);
  }
} else {
  console.log(`  OK  [separators]: ${slideCount} slide separators found, none malformed`);
}

if (slideCount === 0) {
  errors.push("FAIL [separators]: No slide separators found — is this actually a Slidev deck?");
}

// ─── Check 3: image references exist in public/ ──────────────────────────────
const imgRegex = /!\[.*?\]\(([^)]+)\)/g;
let imgMatch;
let imgChecked = 0;
let imgMissing = [];

while ((imgMatch = imgRegex.exec(content)) !== null) {
  const imgPath = imgMatch[1];
  // Only check relative paths (not http/https/data: URIs)
  if (/^https?:\/\//.test(imgPath) || /^data:/.test(imgPath)) {
    warnings.push(`WARN [images]: External image reference skipped: ${imgPath}`);
    continue;
  }
  imgChecked++;
  // Resolve relative to public/ directory
  const resolved = path.join(PUBLIC_DIR, imgPath.replace(/^\//, ""));
  if (!fs.existsSync(resolved)) {
    imgMissing.push(`${imgPath} (expected at ${resolved})`);
  }
}

if (imgMissing.length > 0) {
  for (const m of imgMissing) {
    errors.push(`FAIL [images]: Referenced image not found in public/: ${m}`);
  }
} else if (imgChecked > 0) {
  console.log(`  OK  [images]: All ${imgChecked} local image reference(s) resolved in public/`);
} else {
  console.log(`  OK  [images]: No local image references to check`);
}

// ─── Report ──────────────────────────────────────────────────────────────────
console.log("");

if (warnings.length > 0) {
  console.log("Warnings:");
  for (const w of warnings) console.log("  " + w);
  console.log("");
}

if (errors.length > 0) {
  console.log(`Validation FAILED — ${errors.length} error(s):`);
  for (const e of errors) console.log("  " + e);
  process.exit(1);
} else {
  console.log(`Validation PASSED — slides.md looks good (${slideCount} slides)`);
  process.exit(0);
}
