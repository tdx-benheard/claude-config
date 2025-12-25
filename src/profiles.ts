import { getProfile, getAllProfiles, getAllServers } from './registry.js';
import { writeMcpConfig, ensureSettingsFile } from './config-manager.js';
import { displayError, displaySuccess, displayInfo } from './ui.js';

export function applyProfile(profileName: string, additionalServers: string[] = []): void {
  const profile = getProfile(profileName);

  if (!profile) {
    displayError(`Profile "${profileName}" not found`);
    const available = Object.keys(getAllProfiles());
    if (available.length > 0) {
      console.log(`Available profiles: ${available.join(', ')}`);
    }
    process.exit(1);
  }

  const servers = [...profile.servers, ...additionalServers];
  const changed = writeMcpConfig(servers);
  ensureSettingsFile();

  if (changed) {
    displaySuccess(`Profile "${profileName}" applied successfully`);
    console.log(`Enabled servers: ${servers.join(', ')}`);
  } else {
    displayInfo(`Profile "${profileName}" already active`);
  }
}

export function applyMultiple(args: string[]): void {
  const profiles = getAllProfiles();
  const servers = getAllServers();
  const allServers = new Set<string>();
  const appliedProfiles: string[] = [];
  const appliedServers: string[] = [];

  for (const arg of args) {
    // Check if it's a profile
    if (profiles[arg]) {
      appliedProfiles.push(arg);
      profiles[arg].servers.forEach(s => allServers.add(s));
    }
    // Check if it's a server name
    else if (servers[arg]) {
      appliedServers.push(arg);
      allServers.add(arg);
    }
    // Unknown
    else {
      displayError(`Unknown profile or server: "${arg}"`);
      console.log(`\nAvailable profiles: ${Object.keys(profiles).join(', ')}`);
      console.log(`Available servers: ${Object.keys(servers).join(', ')}`);
      process.exit(1);
    }
  }

  if (allServers.size === 0) {
    displayError('No servers to configure');
    process.exit(1);
  }

  const serverList = Array.from(allServers);
  const changed = writeMcpConfig(serverList);
  ensureSettingsFile();

  if (changed) {
    displaySuccess('Configuration applied successfully');

    if (appliedProfiles.length > 0) {
      console.log(`Applied profiles: ${appliedProfiles.join(', ')}`);
    }
    if (appliedServers.length > 0) {
      console.log(`Added servers: ${appliedServers.join(', ')}`);
    }
    console.log(`Enabled servers: ${serverList.join(', ')}`);
  } else {
    displayInfo('Configuration unchanged');
  }
}
