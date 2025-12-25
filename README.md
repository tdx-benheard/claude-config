# claude-config

Profile-based MCP server configuration manager for Claude Code.

## Overview

`claude-config` (shortcut: `cc`) makes it effortless to configure MCP (Model Context Protocol) servers for Claude Code projects. Instead of manually editing JSON configuration files, use this tool to interactively select servers or apply predefined profiles.

## Features

- **Interactive mode**: Select servers from a visual checklist
- **Profile shortcuts**: Quickly apply common configurations (`tickets`, `web`, `tdx`, `full`)
- **Smart configuration**: Automatically updates `.mcp.json` and `.claude/settings.local.json`
- **Server management**: Add, remove, or clear individual servers
- **Custom servers**: Register your own MCP servers and create custom profiles
- **Status display**: See what's currently configured

## Installation

```bash
git clone <repo-url>
cd claude-config
npm install
npm run build

# Add to PATH (Windows)
# The bin directory is already in your PATH if you followed setup
```

## Usage

### The `cc` Command

The simplest way to use this tool is via the `cc` shortcut:

```bash
# Interactive mode - select servers, then start Claude
cc

# Profile mode - apply profile and start Claude
cc tickets
cc web
cc tickets web  # Combine multiple profiles

# Just configure without starting Claude
claude-config tickets
```

### Interactive Mode

Launch the interactive server selection:

```bash
cc
# or
claude-config
```

Use spacebar to select/deselect servers, then press Enter to apply.

### Quick Profiles

Apply predefined profiles:

```bash
# Ticket management (tdx-tickets-mcp)
cc tickets

# Browser automation (web-agent-mcp)
cc web

# Projects (tdx-projects-mcp)
cc project

# Time tracking (tdx-api-time-mcp)
cc time

# Combine multiple
cc tickets web
cc tickets project time
```

### Management Commands

```bash
# List available servers
claude-config list

# Show current configuration
claude-config status

# Show available profiles
claude-config profiles

# Add specific servers
claude-config add tdx-tickets-mcp web-agent-mcp

# Remove specific servers
claude-config remove web-agent-mcp

# Clear all servers
claude-config clear
```

## Available MCP Servers

### tdx-tickets-mcp
TeamDynamix Tickets API - Manage tickets, search, update, and run reports

### tdx-api-time-mcp
TeamDynamix Time API - Track time entries, create timesheets

### tdx-projects-mcp
TeamDynamix Projects & Issues API - Manage projects and issues

### web-agent-mcp
Browser automation with Playwright - Navigate, click, type, screenshot

## How It Works

When you run the tool, it:

1. Creates/updates `.mcp.json` in your project root with selected server configurations
2. Creates/updates `.claude/settings.local.json` with `enableAllProjectMcpServers: true`
3. Preserves any existing configurations not managed by the tool

## Registry Files

### Built-in Registry
Located in `registry/mcp-registry.json` - contains predefined server configurations

### Built-in Profiles
Located in `registry/mcp-profiles.json` - contains profile definitions

### Custom Configuration
Create custom servers and profiles in `~/.claude-config/`:
- `custom-servers.json` - Your custom MCP servers
- `custom-profiles.json` - Your custom profiles

Custom definitions override built-in ones with the same name.

## The `cc` Shortcut

The `bin/cc.bat` script provides a convenient shortcut that:
1. Configures your MCP servers (interactive or profile-based)
2. Automatically starts Claude Code afterwards

**How it works:**
```bash
cc              # Interactive mode → start Claude
cc tickets      # Apply tickets profile → start Claude
cc tickets web  # Apply multiple profiles → start Claude
```

The `cc.bat` file must be in your PATH for this to work.

## Development

```bash
# Build
npm run build

# Watch mode
npm run watch

# Test
npm test
```

## Project Structure

```
claude-config/
├── bin/
│   ├── claude-mcp.js      # CLI entry point
│   └── cc.bat             # Shortcut: configure + start Claude
├── src/
│   ├── index.ts           # Main CLI logic
│   ├── registry.ts        # Registry loader
│   ├── config-manager.ts  # Config file operations
│   ├── ui.ts              # Interactive UI
│   └── profiles.ts        # Profile management
├── registry/
│   ├── mcp-registry.json  # Built-in servers
│   └── mcp-profiles.json  # Built-in profiles
└── package.json
```

## License

MIT

## Author

Ben Heard
