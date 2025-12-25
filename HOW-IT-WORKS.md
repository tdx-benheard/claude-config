# How claude-mcp-cli Works

## The Premise

**The Problem:**
Manually configuring MCP servers for Claude Code projects is tedious and error-prone. You have to:
- Remember exact server paths
- Edit JSON files by hand
- Know the correct configuration structure
- Configure multiple files (`.mcp.json` and `.claude/settings.local.json`)

**The Solution:**
A CLI tool that presents available MCP servers in a menu, lets you select what you want, and automatically configures everything correctly.

---

## How It Works - Step by Step

### Step 1: The Registry (What's Available)

The tool maintains a registry of available MCP servers in:
```
C:\source\mcp\claude-mcp-cli\registry\mcp-registry.json
```

**Built-in servers:**
- **tdx-tickets-mcp** - TeamDynamix ticket management
- **tdx-api-time-mcp** - TeamDynamix time tracking
- **tdx-projects-mcp** - TeamDynamix projects & issues
- **web-agent-mcp** - Browser automation with Playwright

Each entry includes the complete configuration: command, arguments, environment variables, tools, etc.

### Step 2: You Choose What You Want

Navigate to your project directory and run the tool using one of these methods:

#### Method A: Interactive Selection (Checkbox Menu)
```bash
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js
```
- Shows a checklist with all available servers
- Use **spacebar** to select/deselect
- Press **Enter** to apply changes
- Tool shows what will be added/removed and asks for confirmation

#### Method B: Quick Profile (Instant Setup)
```bash
# Ticket management tools
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js tickets

# Browser automation
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js web

# All TeamDynamix APIs
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js tdx

# Everything
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js full
```

#### Method C: Direct Commands (Surgical Changes)
```bash
# Add specific servers
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js add web-agent-mcp tdx-tickets-mcp

# Remove specific servers
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js remove web-agent-mcp

# Clear everything
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js clear
```

#### Method D: Information Commands
```bash
# List all available servers
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js list

# Show current configuration
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js status

# Show available profiles
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js profiles
```

### Step 3: The Tool Configures Everything Automatically

When you make a selection, the software:

1. **Creates/updates `.mcp.json`** in your project root
   - Contains full server configurations (command, args, env vars)
   - Only includes the servers you selected
   - Preserves the file if it already exists, just updates `mcpServers` section

2. **Creates/updates `.claude/settings.local.json`**
   - Sets `enableAllProjectMcpServers: true`
   - Tells Claude Code to automatically load all servers from `.mcp.json`
   - Preserves any other settings you have

3. **Validates everything** before writing
   - Checks that servers exist in the registry
   - Validates JSON structure
   - Shows you what changed

4. **Shows success/error messages**
   - Green checkmark for success
   - Red X for errors with explanation
   - Summary of what was configured

### Step 4: Start Claude Code

Once configured, simply start Claude Code in your project directory:
```bash
claude
```

Claude Code will automatically:
- Read `.mcp.json`
- Load all configured MCP servers
- Make their tools available during your conversation

---

## What You Have to Do

### One-Time Setup (Already Done!)
The tool is already built and working at:
```
C:\source\mcp\claude-mcp-cli
```

No additional installation needed. You can use it immediately.

### Per-Project Usage

**Every time you want to configure a project:**

1. **Navigate to your project directory**
   ```bash
   cd C:\source\myproject
   ```

2. **Run the tool**
   ```bash
   node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js tickets
   ```

3. **Start Claude Code**
   ```bash
   claude
   ```

That's it! Claude will have the configured MCP servers loaded.

---

## What the Software Does Automatically

The tool handles all the complexity for you:

1. **Reads the registry** - Knows all available MCP servers and their configurations
2. **Validates selections** - Ensures servers exist before applying
3. **Writes correct JSON** - No typos, correct structure, proper paths
4. **Handles both files** - Updates both `.mcp.json` and settings
5. **Preserves existing config** - Doesn't destroy other settings
6. **Shows clear feedback** - Visual confirmation of changes
7. **Supports rollback** - Ask for confirmation before applying changes

---

## Missing Pieces for Full Convenience

The tool **works perfectly right now**, but these optional enhancements would make it even easier to use:

### 1. Global Command Access ⚠️ Minor Inconvenience

**Current state:**
```bash
# Must type full path
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js tickets
```

**Desired state:**
```bash
# Just type command name
claude-mcp tickets
```

**How to fix:**
```bash
cd C:\source\mcp\claude-mcp-cli
npm link
```

This creates a global `claude-mcp` command. May require PATH setup depending on your system configuration.

### 2. Wrapper Script Integration ⭐ Optional but Convenient

**Current state:** Two-step process
```bash
# Step 1: Configure
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js tickets

# Step 2: Start Claude
claude
```

**Desired state:** One command does both
```bash
# Configure AND start Claude
claude tickets
```

**How to set up:**

1. **Locate your Claude executable**
   - Probably: `C:\Users\ben.heard\AppData\Local\Claude\claude.exe`
   - Or wherever Claude Code is installed

2. **Rename the original executable**
   ```bash
   cd C:\Users\ben.heard\AppData\Local\Claude
   ren claude.exe claude-real.exe
   ```

3. **Copy the wrapper script**
   ```bash
   copy C:\source\mcp\claude-mcp-cli\bin\claude.bat C:\Users\ben.heard\AppData\Local\Claude\claude.bat
   ```

4. **Ensure directory is in PATH**
   - Should already be if `claude` command works

**How the wrapper works:**
- `claude tickets` → Runs `claude-mcp tickets`, then starts `claude-real.exe`
- `claude mcp` → Runs `claude-mcp` interactively (doesn't start Claude)
- `claude` (no args) → Passes through to `claude-real.exe` immediately
- `claude <other args>` → Passes through to `claude-real.exe`

### 3. Custom Servers Support ✅ Ready to Use

**Current state:**
Only the 4 built-in servers are available.

**Desired state:**
Add your own custom MCP servers to the menu.

**How to use:**

Create `C:\Users\ben.heard\.claude-mcp\custom-servers.json`:

```json
{
  "servers": {
    "my-custom-server": {
      "name": "my-custom-server",
      "description": "My custom MCP server",
      "tags": ["custom"],
      "config": {
        "type": "stdio",
        "command": "node",
        "args": ["C:/path/to/my-server/dist/index.js"],
        "env": {
          "MY_API_KEY": "secret123"
        }
      },
      "tools": ["my_tool_1", "my_tool_2"]
    }
  }
}
```

Your custom servers will:
- Appear in the `list` command
- Be selectable in interactive mode
- Override built-in servers with the same name

**Create custom profiles:**

Create `C:\Users\ben.heard\.claude-mcp\custom-profiles.json`:

```json
{
  "profiles": {
    "my-workflow": {
      "name": "my-workflow",
      "description": "My custom workflow",
      "servers": ["tdx-tickets-mcp", "web-agent-mcp", "my-custom-server"]
    }
  }
}
```

Then use: `node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js my-workflow`

---

## Current Status Summary

### ✅ Fully Working Right Now

- **Core CLI tool** (`list`, `status`, `profiles`, `add`, `remove`, `clear`)
- **Profile application** (`tickets`, `web`, `tdx`, `full`)
- **Configuration file generation** (`.mcp.json`, `.claude/settings.local.json`)
- **Registry system** (built-in servers, custom server support)
- **Validation and error handling**
- **Status display and feedback**

### ⚠️ Works but Inconvenient

- Must type full path to `claude-mcp.js`
  - **Fix**: Run `npm link` (5 seconds)

- Two-step process (configure, then start Claude)
  - **Fix**: Set up wrapper script (2 minutes)

### ❌ Not Set Up Yet (Optional)

- Wrapper script not installed in Claude directory
- Global `claude-mcp` command not linked

---

## Example Workflow

### Scenario: Setting Up a New Project for Ticket Management

**What you do:**
```bash
# 1. Navigate to your project
cd C:\source\myproject

# 2. Apply the tickets profile
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js tickets

# 3. Start Claude
claude
```

**What the tool does:**
1. Reads `registry/mcp-registry.json` and `registry/mcp-profiles.json`
2. Looks up the "tickets" profile → finds it needs: `tdx-tickets-mcp`, `tdx-api-time-mcp`
3. Reads the configurations for those two servers
4. Creates `C:\source\myproject\.mcp.json`:
   ```json
   {
     "mcpServers": {
       "tdx-tickets-mcp": { /* full config */ },
       "tdx-api-time-mcp": { /* full config */ }
     }
   }
   ```
5. Creates `C:\source\myproject\.claude\settings.local.json`:
   ```json
   {
     "enableAllProjectMcpServers": true
   }
   ```
6. Shows: ✓ Profile "tickets" applied successfully

**What Claude Code does:**
1. Starts up
2. Reads `.mcp.json` in your project
3. Sees `enableAllProjectMcpServers: true` in settings
4. Launches both MCP servers as child processes
5. Makes their tools available: `tdx_get_ticket`, `tdx_search_tickets`, `tdx_get_time_report`, etc.

---

## Troubleshooting

### "Server not found in registry"
The server name doesn't exist. Run `list` to see available servers:
```bash
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js list
```

### "Profile not found"
The profile name doesn't exist. Run `profiles` to see available profiles:
```bash
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js profiles
```

### MCP servers not loading in Claude Code
1. Check that `.mcp.json` exists in your project root
2. Check that `.claude/settings.local.json` has `enableAllProjectMcpServers: true`
3. Restart Claude Code
4. Check server paths are correct (servers must be built with `npm run build`)

### Command not found (after npm link)
Your npm global bin directory might not be in PATH. Find it with:
```bash
npm config get prefix
```
Add `<prefix>/bin` (or `<prefix>` on Windows) to your PATH.

---

## Quick Reference

### All Commands

```bash
# Interactive selection
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js

# Apply profile
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js [tickets|web|tdx|full]

# Management
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js list
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js status
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js profiles
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js add <server1> <server2> ...
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js remove <server1> <server2> ...
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js clear
```

### Files Created by Tool

In your project directory:
- `.mcp.json` - MCP server configurations
- `.claude/settings.local.json` - Claude Code settings

### Tool Location

```
C:\source\mcp\claude-mcp-cli\
├── bin/claude-mcp.js       ← Run this file
├── registry/
│   ├── mcp-registry.json   ← Built-in servers
│   └── mcp-profiles.json   ← Built-in profiles
└── ...
```

### Custom Configuration

```
C:\Users\ben.heard\.claude-mcp\
├── custom-servers.json     ← Your servers
└── custom-profiles.json    ← Your profiles
```

---

## Bottom Line

✅ **The tool works perfectly right now**

You can immediately configure MCP servers for any project:
```bash
cd your-project
node C:/source/mcp/claude-mcp-cli/bin/claude-mcp.js tickets
claude
```

The "missing pieces" are just convenience features to make it faster to invoke (shorter command, one-step wrapper).
