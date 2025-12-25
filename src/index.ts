#!/usr/bin/env node

import { Command } from 'commander';
import { getAllProfiles, getAllServers } from './registry.js';
import { getCurrentServers, addServers, removeServers, clearServers, writeMcpConfig, ensureSettingsFile } from './config-manager.js';
import { showServerSelection, displayStatus, displayList, displayProfiles, displaySuccess, displayError, displayInfo, confirmChanges } from './ui.js';
import { applyProfile, applyMultiple } from './profiles.js';

const program = new Command();

program
  .name('claude-config')
  .description('Profile-based MCP server configuration manager for Claude Code')
  .version('1.0.0');

// Interactive mode (default command)
program
  .action(async () => {
    try {
      const selected = await showServerSelection();

      const changed = writeMcpConfig(selected);
      ensureSettingsFile();

      if (changed) {
        displaySuccess('Configuration updated successfully');
      } else {
        displayInfo('Configuration unchanged');
      }
    } catch (error) {
      if ((error as any).name === 'ExitPromptError') {
        displayInfo('Cancelled');
      } else {
        displayError(`Error: ${(error as Error).message}`);
        process.exit(1);
      }
    }
  });

// Profile/server commands - check if args are profile names or server names
const profiles = getAllProfiles();
const servers = getAllServers();
const profileNames = Object.keys(profiles);
const serverNames = Object.keys(servers);

// Get all non-flag arguments after the command
const args = process.argv.slice(2).filter(arg => !arg.startsWith('-'));

// Check if first argument is a known profile or server name
if (args.length > 0 && (profileNames.includes(args[0]) || serverNames.includes(args[0]))) {
  // Check if it's a commander command
  const commandNames = ['list', 'status', 'profiles', 'add', 'remove', 'clear'];
  if (!commandNames.includes(args[0])) {
    // Multiple profiles/servers: combine them
    if (args.length > 1) {
      applyMultiple(args);
      process.exit(0);
    }
    // Single profile: use the original logic for backward compatibility
    else if (profileNames.includes(args[0])) {
      applyProfile(args[0]);
      process.exit(0);
    }
    // Single server name: treat as single-item multi-apply
    else {
      applyMultiple(args);
      process.exit(0);
    }
  }
}

// List command
program
  .command('list')
  .description('List all available MCP servers')
  .action(() => {
    displayList();
  });

// Status command
program
  .command('status')
  .description('Show current MCP configuration')
  .action(() => {
    displayStatus();
  });

// Profiles command
program
  .command('profiles')
  .description('List available profiles')
  .action(() => {
    displayProfiles();
  });

// Add command
program
  .command('add <servers...>')
  .description('Add specific MCP servers')
  .action((servers: string[]) => {
    try {
      addServers(servers);
      displaySuccess(`Added servers: ${servers.join(', ')}`);
    } catch (error) {
      displayError(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Remove command
program
  .command('remove <servers...>')
  .description('Remove specific MCP servers')
  .action((servers: string[]) => {
    try {
      removeServers(servers);
      displaySuccess(`Removed servers: ${servers.join(', ')}`);
    } catch (error) {
      displayError(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Clear command
program
  .command('clear')
  .description('Clear all MCP servers')
  .action(async () => {
    try {
      const current = getCurrentServers();
      if (current.length === 0) {
        displayInfo('No servers configured');
        return;
      }

      const { confirm } = await import('@inquirer/prompts');
      const shouldClear = await confirm({
        message: `Remove all ${current.length} configured servers?`,
        default: false,
      });

      if (shouldClear) {
        clearServers();
        displaySuccess('All servers removed');
      } else {
        displayInfo('Cancelled');
      }
    } catch (error) {
      displayError(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program.parse();
