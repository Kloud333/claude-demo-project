// ЩО ЦЕ: власний MCP Client клас — точний аналог того, що будували в
// курсі (модуль "Implementing a client"): обгортка над Client Session
// з SDK, яка ховає деталі з'єднання й дає прості методи. У
// mcp-server-demo/ цей шар пропущено (там client напряму з SDK) — тут
// навмисно додано, щоб приклад демонстрував ПОВНУ архітектуру з курсу:
// наш MCP Client клас → Client Session (SDK) → MCP Server.

const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const {
  StdioClientTransport,
} = require("@modelcontextprotocol/sdk/client/stdio.js");

class TodoMCPClient {
  constructor(command, args) {
    this._command = command;
    this._args = args;
    this._client = null;
  }

  // Піднімає server як subprocess (stdio) і встановлює session.
  async connect() {
    const transport = new StdioClientTransport({ command: this._command, args: this._args });
    this._client = new Client({ name: "todo-mcp-client", version: "1.0.0" });
    await this._client.connect(transport);
  }

  session() {
    if (!this._client) throw new Error("Not connected. Call connect() first.");
    return this._client;
  }

  // --- tools ---
  async listTools() {
    return (await this.session().listTools()).tools;
  }
  async callTool(name, input) {
    return this.session().callTool({ name, arguments: input });
  }

  // --- resources ---
  async listResources() {
    const direct = await this.session().listResources();
    const templated = await this.session().listResourceTemplates();
    return { direct: direct.resources, templated: templated.resourceTemplates };
  }
  async readResource(uri) {
    return (await this.session().readResource({ uri })).contents[0];
  }

  // --- prompts ---
  async listPrompts() {
    return (await this.session().listPrompts()).prompts;
  }
  async getPrompt(name, args = {}) {
    return (await this.session().getPrompt({ name, arguments: args })).messages;
  }

  // Акуратно закриває з'єднання (той самий resource-management, про
  // який курс попереджав — робимо це в одному місці, а не скрізь).
  async cleanup() {
    if (this._client) await this._client.close();
  }
}

module.exports = { TodoMCPClient };
