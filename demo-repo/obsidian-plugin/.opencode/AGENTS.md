# OpenCode Agents — Obsidian Plugin Demo

This project uses OpenCode with the following agent conventions:

## Default Behaviour
- Read all `.ts` files freely
- Ask before running bash commands that mutate state
- Never touch `.env` files

## Available Agents
- **coder** (`agents/coder.md`) — TypeScript/Obsidian API specialist
  Load with: `@coder` in your prompt

## Scope
This is a demo repo for the "Agentic Coding with OpenCode" workshop.
The coder agent should make minimal, focused changes and explain reasoning.

## Off-limits
- Do not modify `manifest.json` version field during demos
- Do not run `npm publish`
- Do not read or write `*.env` files
