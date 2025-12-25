import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { getAllServers, type McpServerConfig } from './registry.js';

const MCP_JSON = '.mcp.json';
const SETTINGS_FILE = '.claude/settings.local.json';

export interface McpJsonConfig {
  mcpServers: Record<string, McpServerConfig>;
}

export interface SettingsConfig {
  enableAllProjectMcpServers?: boolean;
  [key: string]: unknown;
}

export function findProjectRoot(): string {
  // Use current working directory
  return process.cwd();
}

export function getMcpJsonPath(): string {
  return join(findProjectRoot(), MCP_JSON);
}

export function getSettingsPath(): string {
  return join(findProjectRoot(), SETTINGS_FILE);
}

export function readMcpConfig(): McpJsonConfig {
  const mcpPath = getMcpJsonPath();

  if (existsSync(mcpPath)) {
    try {
      const content = readFileSync(mcpPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.warn(`Warning: Failed to parse ${MCP_JSON}:`, (error as Error).message);
    }
  }

  return { mcpServers: {} };
}

export function writeMcpConfig(serverNames: string[]): boolean {
  const mcpPath = getMcpJsonPath();
  const allServers = getAllServers();

  // Get current configuration
  const currentServers = getCurrentServers();
  const currentSet = new Set(currentServers);
  const newSet = new Set(serverNames);

  // Check if configuration is unchanged
  const hasChanges =
    currentSet.size !== newSet.size ||
    !Array.from(newSet).every(s => currentSet.has(s));

  if (!hasChanges) {
    return false; // No changes needed
  }

  // Build mcpServers object with only selected servers
  const mcpServers: Record<string, McpServerConfig> = {};
  for (const name of serverNames) {
    const server = allServers[name];
    if (server) {
      mcpServers[name] = server.config;
    } else {
      console.warn(`Warning: Server "${name}" not found in registry`);
    }
  }

  const config: McpJsonConfig = { mcpServers };

  // Write the file
  writeFileSync(mcpPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');
  return true; // Changes were made
}

export function readSettings(): SettingsConfig {
  const settingsPath = getSettingsPath();

  if (existsSync(settingsPath)) {
    try {
      const content = readFileSync(settingsPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.warn(`Warning: Failed to parse settings:`, (error as Error).message);
    }
  }

  return {};
}

export function ensureSettingsFile(): void {
  const settingsPath = getSettingsPath();
  const settingsDir = dirname(settingsPath);

  // Create .claude directory if it doesn't exist
  if (!existsSync(settingsDir)) {
    mkdirSync(settingsDir, { recursive: true });
  }

  // Read existing settings or create new
  const settings = readSettings();

  let needsWrite = false;

  // Ensure enableAllProjectMcpServers is set to true
  if (!settings.enableAllProjectMcpServers) {
    settings.enableAllProjectMcpServers = true;
    needsWrite = true;
  }

  // Remove disabledMcpjsonServers if it exists (cleanup from old approach)
  if ('disabledMcpjsonServers' in settings) {
    delete settings.disabledMcpjsonServers;
    needsWrite = true;
  }

  if (needsWrite) {
    writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf-8');
  }
}

export function getCurrentServers(): string[] {
  const config = readMcpConfig();
  return Object.keys(config.mcpServers);
}

export function addServers(serverNames: string[]): void {
  const current = getCurrentServers();
  const combined = [...new Set([...current, ...serverNames])];
  writeMcpConfig(combined);
  ensureSettingsFile();
}

export function removeServers(serverNames: string[]): void {
  const current = getCurrentServers();
  const remaining = current.filter(name => !serverNames.includes(name));
  writeMcpConfig(remaining);
  ensureSettingsFile();
}

export function clearServers(): void {
  writeMcpConfig([]);
  ensureSettingsFile();
}
