import { checkbox, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getAllServers, getAllProfiles, type McpServer, type McpProfile } from './registry.js';
import { getCurrentServers } from './config-manager.js';

export async function showServerSelection(): Promise<string[]> {
  // Display header
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const toolPath = join(__dirname, '..');

  console.log('');
  console.log(chalk.bold.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold.cyan('  Claude MCP Configuration Tool'));
  console.log(chalk.gray(`  Location: ${toolPath}`));
  console.log(chalk.bold.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log('');

  const servers = getAllServers();
  const currentServers = getCurrentServers();

  const choices = Object.values(servers).map(server => ({
    name: `${server.name} - ${server.description}`,
    value: server.name,
    checked: currentServers.includes(server.name),
  }));

  if (choices.length === 0) {
    console.log(chalk.yellow('No MCP servers available in registry'));
    return [];
  }

  const selected = await checkbox({
    message: 'Select MCP servers to enable:',
    choices,
    pageSize: 15,
  });

  return selected;
}

export async function confirmChanges(added: string[], removed: string[]): Promise<boolean> {
  if (added.length === 0 && removed.length === 0) {
    console.log(chalk.blue('No changes to apply'));
    return false;
  }

  console.log('');
  if (added.length > 0) {
    console.log(chalk.green('✓ Servers to add:'));
    added.forEach(name => console.log(`  ${chalk.green('+')} ${name}`));
  }

  if (removed.length > 0) {
    console.log(chalk.red('✗ Servers to remove:'));
    removed.forEach(name => console.log(`  ${chalk.red('-')} ${name}`));
  }

  console.log('');
  return await confirm({
    message: 'Apply these changes?',
    default: true,
  });
}

export function displayStatus(): void {
  const servers = getAllServers();
  const currentServers = getCurrentServers();

  console.log(chalk.bold('\nCurrent MCP Configuration:'));

  if (currentServers.length === 0) {
    console.log(chalk.yellow('  No MCP servers configured'));
  } else {
    currentServers.forEach(name => {
      const server = servers[name];
      if (server) {
        console.log(chalk.green(`  ✓ ${name}`) + chalk.gray(` (${server.description})`));
      } else {
        console.log(chalk.yellow(`  ✓ ${name}`) + chalk.gray(' (unknown - not in registry)'));
      }
    });
  }

  const availableServers = Object.keys(servers).filter(name => !currentServers.includes(name));

  if (availableServers.length > 0) {
    console.log(chalk.bold('\nAvailable servers not enabled:'));
    availableServers.forEach(name => {
      const server = servers[name];
      console.log(chalk.gray(`    ${name}`) + chalk.gray(` (${server.description})`));
    });
  }

  console.log('');
}

export function displayList(): void {
  const servers = getAllServers();

  console.log(chalk.bold('\nAvailable MCP Servers:'));

  if (Object.keys(servers).length === 0) {
    console.log(chalk.yellow('  No servers available'));
  } else {
    Object.values(servers).forEach(server => {
      console.log(chalk.cyan(`  ${server.name}`));
      console.log(chalk.gray(`    ${server.description}`));
      console.log(chalk.gray(`    Tags: ${server.tags.join(', ')}`));
      console.log(chalk.gray(`    Tools: ${server.tools.slice(0, 3).join(', ')}${server.tools.length > 3 ? '...' : ''}`));
      console.log('');
    });
  }
}

export function displayProfiles(): void {
  const profiles = getAllProfiles();

  console.log(chalk.bold('\nAvailable Profiles:'));

  if (Object.keys(profiles).length === 0) {
    console.log(chalk.yellow('  No profiles available'));
  } else {
    Object.values(profiles).forEach(profile => {
      console.log(chalk.cyan(`  ${profile.name}`));
      console.log(chalk.gray(`    ${profile.description}`));
      console.log(chalk.gray(`    Servers: ${profile.servers.join(', ')}`));
      console.log('');
    });
  }
}

export function displaySuccess(message: string): void {
  console.log(chalk.green(`\n✓ ${message}\n`));
}

export function displayError(message: string): void {
  console.log(chalk.red(`\n✗ ${message}\n`));
}

export function displayInfo(message: string): void {
  console.log(chalk.blue(`\nℹ ${message}\n`));
}
