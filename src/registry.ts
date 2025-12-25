import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface McpServerConfig {
  type: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface McpServer {
  name: string;
  description: string;
  tags: string[];
  config: McpServerConfig;
  tools: string[];
}

export interface McpProfile {
  name: string;
  description: string;
  servers: string[];
}

export interface Registry {
  servers: Record<string, McpServer>;
}

export interface ProfileRegistry {
  profiles: Record<string, McpProfile>;
}

const USER_CONFIG_DIR = join(homedir(), '.claude-mcp');
const PACKAGE_REGISTRY = join(__dirname, '..', 'registry', 'mcp-registry.json');
const PACKAGE_PROFILES = join(__dirname, '..', 'registry', 'mcp-profiles.json');
const USER_SERVERS = join(USER_CONFIG_DIR, 'custom-servers.json');
const USER_PROFILES = join(USER_CONFIG_DIR, 'custom-profiles.json');

function loadJsonFile<T>(path: string, fallback: T): T {
  try {
    if (existsSync(path)) {
      const content = readFileSync(path, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn(`Warning: Failed to load ${path}:`, (error as Error).message);
  }
  return fallback;
}

export function getAllServers(): Record<string, McpServer> {
  const packageRegistry = loadJsonFile<Registry>(PACKAGE_REGISTRY, { servers: {} });
  const userRegistry = loadJsonFile<Registry>(USER_SERVERS, { servers: {} });

  // Merge registries (user servers override package servers)
  return { ...packageRegistry.servers, ...userRegistry.servers };
}

export function getAllProfiles(): Record<string, McpProfile> {
  const packageProfiles = loadJsonFile<ProfileRegistry>(PACKAGE_PROFILES, { profiles: {} });
  const userProfiles = loadJsonFile<ProfileRegistry>(USER_PROFILES, { profiles: {} });

  // Merge profiles (user profiles override package profiles)
  return { ...packageProfiles.profiles, ...userProfiles.profiles };
}

export function getServer(name: string): McpServer | undefined {
  const servers = getAllServers();
  return servers[name];
}

export function getProfile(name: string): McpProfile | undefined {
  const profiles = getAllProfiles();
  return profiles[name];
}

export function getUserConfigDir(): string {
  return USER_CONFIG_DIR;
}
