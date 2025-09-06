/**
 * Utility functions for the Role-Grant Ritual Kit
 * Provides common functionality for ceremonial operations
 */

const fs = require('fs-extra');
const YAML = require('yaml');
const path = require('path');

/**
 * Load configuration files from the kit/config directory
 */
async function loadConfig(configName) {
  try {
    const configPath = path.join(__dirname, '../config', `${configName}.yaml`);
    const configFile = await fs.readFile(configPath, 'utf8');
    return YAML.parse(configFile);
  } catch (error) {
    console.error(`Error loading config ${configName}:`, error.message);
    return null;
  }
}

/**
 * Get current timestamp in ceremonial format
 */
function getCeremonialTimestamp() {
  const now = new Date();
  const options = {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  };
  return now.toLocaleString('en-US', options) + ' UTC';
}

/**
 * Generate a unique ceremony ID
 */
function generateCeremonyId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `ceremony_${timestamp}_${random}`;
}

/**
 * Validate user permissions for ceremonial actions
 */
async function validatePermissions(userId, requiredPermission) {
  const roles = await loadConfig('roles');
  if (!roles) return false;

  // This would typically check against Discord user roles
  // For now, returns true for demonstration
  console.log(`Validating permission '${requiredPermission}' for user ${userId}`);
  return true;
}

/**
 * Format ceremonial log entry
 */
function formatLogEntry(type, details) {
  return {
    id: generateCeremonyId(),
    type: type,
    timestamp: getCeremonialTimestamp(),
    details: details
  };
}

/**
 * Ensure data directory exists
 */
async function ensureDataDirectory() {
  const dataDir = path.join(__dirname, '../data');
  await fs.ensureDir(dataDir);
  return dataDir;
}

/**
 * Create ceremonial banner for console output
 */
function createCeremonialBanner(title) {
  const border = '═'.repeat(60);
  const spaces = ' '.repeat(Math.max(0, (60 - title.length) / 2));
  
  return [
    `╔${border}╗`,
    `║${spaces}${title}${spaces}║`,
    `╚${border}╝`
  ].join('\n');
}

module.exports = {
  loadConfig,
  getCeremonialTimestamp,
  generateCeremonyId,
  validatePermissions,
  formatLogEntry,
  ensureDataDirectory,
  createCeremonialBanner
};