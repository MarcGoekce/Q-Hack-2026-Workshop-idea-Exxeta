import { App, Modal, Notice, Plugin, requestUrl } from "obsidian";

export default class OpenCodeDemoPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "opencode-generate-note",
      name: "Generate Note",
      callback: () => this.generateNote(),
    });
    console.log("OpenCode Demo plugin loaded");
  }

  async generateNote() {
    new Notice("OpenCode: Generating note...");
    try {
      const response = await requestUrl({
        url: "http://localhost:3333/generate",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "generate-note" }),
      });
      new ResultModal(this.app, response.json?.result ?? "(no result)").open();
    } catch {
      new ResultModal(this.app, "[MOCK] OpenCode offline fallback.").open();
    }
  }
}

class ResultModal extends Modal {
  result: string;
  constructor(app: App, result: string) { super(app); this.result = result; }
  onOpen() {
    this.contentEl.createEl("h2", { text: "OpenCode Result" });
    this.contentEl.createEl("pre", { text: this.result });
  }
  onClose() { this.contentEl.empty(); }
}
