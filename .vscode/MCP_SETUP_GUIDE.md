# MCP (Model Context Protocol) Setup Guide

## ✅ MCP Configuration Complete!

Your VS Code is now configured to use MCP servers with GitHub Copilot.

## 📋 What's Configured

### MCP Server: Fetch

- **Purpose**: Fetch and analyze content from URLs
- **Command**: `python -m uv tool run mcp-server-fetch`
- **Note**: Uses Python's uv package manager (Windows compatible)

### Inputs

- **Render API Key**: Pre-configured with your key

## 🚀 How to Use

### Step 1: Start the MCP Server

1. Open `.vscode/mcp.json` in VS Code
2. Look for the **"Start"** button at the top of the file
3. Click **"Start"** to launch the MCP servers
4. The input dialog will appear - confirm your Render API key

### Step 2: Use in Copilot Chat

1. Click the **Copilot Chat** icon (💬) in VS Code
2. Select **"Agent"** from the popup menu
3. Click the **tools icon** (🔧) to see available MCP servers

### Step 3: Example Usage

In Copilot Chat, try:

- `Fetch https://web-res.onrender.com/api/v1/news`
- `Fetch https://github.com/your-repo`

## 🔧 Prerequisites

Make sure you have `uvx` installed:

```bash
pip install uv
```

## 🔄 Troubleshooting

- **Server not starting**: Install `uv` package manager
- **Tools not appearing**: Restart VS Code and click "Start" in mcp.json
- **Check logs**: View VS Code output panel for errors

## 📖 Resources

- [VS Code MCP Docs](https://code.visualstudio.com/docs/copilot/copilot-mcp)
- [MCP Specification](https://modelcontextprotocol.io/)

---

**Ready to use!** Open `.vscode/mcp.json` and click "Start" 🎉
