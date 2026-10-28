# 🔬 OpenClaw + Nous Hermes Autonomous Agent Lab

<p align="center">
  <a href="https://github.com/Jubayer-ahamed42/openclaw-hermes-agent-lab"><img src="https://img.shields.io/badge/GitHub-openclaw--hermes--agent--lab-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" /></a>
  <a href="#architecture--isolation-boundary"><img src="https://img.shields.io/badge/Architecture-Hermetic%20Sandbox-teal?style=for-the-badge" alt="Hermetic Sandbox" /></a>
  <a href="#nous-hermes-integration"><img src="https://img.shields.io/badge/Model-Nous%20Hermes-purple?style=for-the-badge" alt="Nous Hermes" /></a>
</p>

A completely isolated, production-grade local installation of **OpenClaw** integrated with the **Nous Hermes** agentic brain (powered by Nous Research via OmniRoute, OpenRouter, or custom OpenAI-compatible endpoints).

---

## 🏗️ Architecture & Isolation Boundary

All dependencies, configurations, logs, state files, and agent workspaces are strictly confined to this folder (`openclaw-hermes-agent-lab`).

```
openclaw-hermes-agent-lab\
├── .env                       # Local environment credentials (OPENROUTER_API_KEY, etc.)
├── .env.example               # Clean reference template for environment setup
├── .gitignore                 # Excludes node_modules, keys, state, and runtime logs
├── package.json               # Local npm scripts and dependencies
├── config\
│   └── openclaw.json5         # Gateway & Nous Hermes configuration
├── workspace\                 # Isolated sandbox for agent file and script execution
├── test_hermes_openclaw.js    # Automated verification and benchmark suite
├── run_lab.bat                # Windows interactive 1-click launcher
└── README.md                  # Complete documentation and user guide
```

### Strict Isolation Guarantees:
- **`OPENCLAW_HOME=./.openclaw`**: Prevents OpenClaw from polluting or reading global `%USERPROFILE%\.openclaw`.
- **`OPENCLAW_CONFIG_PATH=./config/openclaw.json5`**: Explicitly pins the control plane configuration inside the project folder.
- **`OPENCLAW_STATE_DIR=./.openclaw/state`**: Keeps sessions, state, and credentials locally isolated.
- **`workspace/`**: The agent's file system and terminal execution tools are scoped to this directory.

---

## ⚡ Quick Start Guide

### 1. Configure Your API Key
Open `.env` (or copy `.env.example` to `.env`) and add your OpenRouter API key:

```ini
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
```
*(Get a key from [OpenRouter.ai](https://openrouter.ai/keys))*.

### 2. Launch Using the Windows 1-Click Launcher
Double-click `run_lab.bat` or run in terminal:
```cmd
run_lab.bat
```
This launches an interactive menu:
- **[1] Start Interactive Chat**: Chat with Nous Hermes directly in your terminal.
- **[2] Start OpenClaw Gateway**: Launch the multi-channel gateway (CLI, Telegram, etc.).
- **[3] Check Gateway Status**: Inspect running services and health.
- **[4] Run Verification Benchmark**: Run automated tests verifying OpenClaw <-> Hermes communication.
- **[5] Run Diagnostics (Doctor)**: Health check validating paths, configuration schema, and dependencies.
- **[6] Edit Configuration**: Open `config\openclaw.json5`.
- **[7] Edit Credentials**: Open `.env`.
- **[8] Open Workspace**: View generated files in Windows Explorer.

---

## 🧠 Brain Configuration: Nous Hermes

OpenClaw connects to Nous Hermes using OpenRouter (or any OpenAI-compatible API).

### Supported Hermes Models:
| Model Name | Slug / Identifier | Use Case |
| :--- | :--- | :--- |
| **Hermes 3 (405B)** *(Default Primary)* | `openrouter/nousresearch/hermes-3-llama-3.1-405b` | Complex reasoning, autonomous agentic coding, robust tool calling |
| **Hermes 3 (70B)** *(Default Fast)* | `openrouter/nousresearch/hermes-3-llama-3.1-70b` | Fast interactions, quick responses, lightweight tasks |
| **Hermes 2 Pro (8B)** | `openrouter/nousresearch/hermes-2-pro-llama-3-8b` | Ultra-low latency, budget friendly |

### Using a Local LLM Runtime (Optional)
If you run Hermes locally via LM Studio, vLLM, or an OpenAI-compatible gateway:
1. Update `.env`:
   ```ini
   LOCAL_LLM_BASE_URL=http://127.0.0.1:1234/v1
   LOCAL_LLM_API_KEY=not-needed
   ```
2. Update primary model in `config/openclaw.json5`:
   ```json5
   "primary": "local/hermes-3"
   ```

---

## 🛠️ Execution Capabilities & Tools (The Body)

The agent is empowered with full autonomous capabilities:

1. **File System Tool (`fs`)**:
   - Allows Hermes to create, read, inspect, and organize files strictly inside `./workspace/`.
2. **Terminal / Execution Tool (`exec`)**:
   - Allows Hermes to execute Python scripts, shell scripts, and system commands within `./workspace/`.
3. **Web Search & Fetch**:
   - OpenClaw can retrieve external web context and documentation dynamically.

---

## 💬 Messaging Gateway (CLI & Telegram)

### Interactive CLI Mode
Run in PowerShell or CMD:
```powershell
npm run chat
```

### Telegram Bot Integration
1. Open [@BotFather](https://t.me/botfather) on Telegram and create a new bot (`/newbot`).
2. Copy the bot token into `.env`:
   ```ini
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
   ```
3. In `config/openclaw.json5`, set `"enabled": true` under `"channels.telegram"`.
4. Start the gateway:
   ```powershell
   npm run gateway
   ```
5. Message your bot on Telegram! OpenClaw uses `dmPolicy: "pairing"`, meaning the bot will ask you to approve your Telegram account on first message for security.

---

## 🧪 Verification & Live Benchmark Test

Run the automated test suite:
```powershell
npm run test:hermes
```

### What This Test Verifies:
1. Validates isolated environment paths and configuration integrity.
2. Checks Node.js and Python runtime availability.
3. Sends an autonomous coding task to Nous Hermes:
   - Hermes creates `workspace/hello_hermes.py`.
   - Hermes executes `python hello_hermes.py` using its terminal tool.
   - Hermes verifies and returns the output.
4. Asserts that the file was generated and executed successfully on your local machine.

---

## 📋 Available NPM Commands

| Command | Action |
| :--- | :--- |
| `npm run chat` | Launch terminal chat session with Hermes |
| `npm run gateway` | Start background multi-channel gateway |
| `npm run gateway:status` | Check gateway status |
| `npm run doctor` | Run OpenClaw diagnostic health check |
| `npm run test:hermes` | Run automated Hermes verification benchmark |
| `npm run openclaw -- <cmd>` | Run any OpenClaw subcommand in the isolated environment |
