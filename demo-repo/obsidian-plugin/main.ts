import {
  App,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  requestUrl,
} from "obsidian";

interface OpenCodeDemoSettings {
  endpoint: string;
}

const DEFAULT_SETTINGS: OpenCodeDemoSettings = {
  endpoint: "http://localhost:3333",
};

export default class OpenCodeDemoPlugin extends Plugin {
  settings: OpenCodeDemoSettings;

  async onload() {
    await this.loadSettings();

    // Command: Generate Note via OpenCode agent
    this.addCommand({
      id: "opencode-generate-note",
      name: "Generate Note",
      callback: () => this.generateNote(),
    });

    // Command: Ask OpenCode about current file
    this.addCommand({
      id: "opencode-ask-about-file",
      name: "Ask about current file",
      callback: () => this.askAboutFile(),
    });

    this.addSettingTab(new OpenCodeSettingTab(this.app, this));
    console.log("OpenCode Demo plugin loaded");
  }

  async generateNote() {
    const activeFile = this.app.workspace.getActiveFile();
    const context = activeFile ? `Active file: ${activeFile.basename}` : "No active file";

    new Notice("OpenCode: Generating note...");

    try {
      const response = await requestUrl({
        url: `${this.settings.endpoint}/generate`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, task: "generate-note" }),
      });
      new GenerateResultModal(this.app, response.json?.result ?? "(no result)").open();
    } catch {
      // Offline / mock fallback
      new GenerateResultModal(
        this.app,
        "[MOCK] OpenCode agent would generate a note here.\n\n" +
          "In the live demo this calls the local MCP server and returns\n" +
          "an AI-generated note based on your vault context."
      ).open();
    }
  }

  async askAboutFile() {
    const file = this.app.workspace.getActiveFile();
    if (!file) {
      new Notice("OpenCode: No active file.");
      return;
    }
    const content = await this.app.vault.read(file);
    new Notice(`OpenCode: Analyzing "${file.basename}"...`);
    new GenerateResultModal(
      this.app,
      `[MOCK] OpenCode analysis of "${file.basename}":\n\n` +
        `This file has ${content.split("\n").length} lines.\n` +
        `Word count: ~${content.split(/\s+/).length}`
    ).open();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class GenerateResultModal extends Modal {
  result: string;
  constructor(app: App, result: string) {
    super(app);
    this.result = result;
  }
  onOpen() {
    this.contentEl.createEl("h2", { text: "OpenCode Result" });
    this.contentEl.createEl("pre", { text: this.result });
  }
  onClose() {
    this.contentEl.empty();
  }
}

class OpenCodeSettingTab extends PluginSettingTab {
  plugin: OpenCodeDemoPlugin;
  constructor(app: App, plugin: OpenCodeDemoPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "OpenCode Demo Settings" });
    new Setting(containerEl)
      .setName("Endpoint")
      .setDesc("Local OpenCode MCP server endpoint")
      .addText((text) =>
        text
          .setPlaceholder("http://localhost:3333")
          .setValue(this.plugin.settings.endpoint)
          .onChange(async (value) => {
            this.plugin.settings.endpoint = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
