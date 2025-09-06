/**
 * Ceremonial Ledger Logger
 * Records all ritual activities and ceremonial events
 */

const fs = require('fs-extra');
const path = require('path');
const { formatLogEntry, ensureDataDirectory, createCeremonialBanner } = require('./utils');

class CeremonialLedger {
  constructor(ledgerPath = null) {
    this.ledgerPath = ledgerPath || path.join(__dirname, '../data/ritual-ledger.json');
  }

  /**
   * Initialize the ledger file if it doesn't exist
   */
  async initialize() {
    await ensureDataDirectory();
    
    if (!(await fs.pathExists(this.ledgerPath))) {
      const initialLedger = {
        shrine: "Basilica Gate of Kypria LLC",
        created: new Date().toISOString(),
        entries: [],
        cycles: [],
        statistics: {
          total_ceremonies: 0,
          roles_granted: 0,
          badges_affixed: 0
        }
      };
      
      await fs.writeJson(this.ledgerPath, initialLedger, { spaces: 2 });
      console.log(`📜 Ceremonial Ledger initialized at ${this.ledgerPath}`);
    }
  }

  /**
   * Read the current ledger
   */
  async readLedger() {
    try {
      return await fs.readJson(this.ledgerPath);
    } catch (error) {
      console.error('Error reading ledger:', error.message);
      return null;
    }
  }

  /**
   * Write to the ledger
   */
  async writeLedger(ledger) {
    try {
      await fs.writeJson(this.ledgerPath, ledger, { spaces: 2 });
      return true;
    } catch (error) {
      console.error('Error writing to ledger:', error.message);
      return false;
    }
  }

  /**
   * Log a ceremonial event
   */
  async logEvent(type, details) {
    await this.initialize();
    const ledger = await this.readLedger();
    
    if (!ledger) {
      console.error('Failed to read ledger for logging');
      return false;
    }

    const entry = formatLogEntry(type, details);
    ledger.entries.push(entry);
    
    // Update statistics
    if (type === 'role_grant') {
      ledger.statistics.roles_granted++;
    } else if (type === 'badge_affix') {
      ledger.statistics.badges_affixed++;
    }
    
    ledger.statistics.total_ceremonies++;

    const success = await this.writeLedger(ledger);
    
    if (success) {
      console.log(`📜 Logged ceremonial event: ${type} (ID: ${entry.id})`);
    }
    
    return success;
  }

  /**
   * Retrieve recent ceremonial activities
   */
  async getRecentActivities(limit = 10) {
    const ledger = await this.readLedger();
    if (!ledger) return [];

    return ledger.entries
      .slice(-limit)
      .reverse();
  }

  /**
   * Display ceremonial statistics
   */
  async displayStatistics() {
    const ledger = await this.readLedger();
    if (!ledger) {
      console.log('No ledger data available');
      return;
    }

    console.log(createCeremonialBanner('CEREMONIAL STATISTICS'));
    console.log(`Shrine: ${ledger.shrine}`);
    console.log(`Total Ceremonies: ${ledger.statistics.total_ceremonies}`);
    console.log(`Roles Granted: ${ledger.statistics.roles_granted}`);
    console.log(`Badges Affixed: ${ledger.statistics.badges_affixed}`);
    console.log(`Ledger Created: ${new Date(ledger.created).toLocaleDateString()}`);
  }
}

// CLI Interface
if (require.main === module) {
  const ledger = new CeremonialLedger();
  
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'init':
      ledger.initialize().then(() => {
        console.log('✨ Ceremonial Ledger ready for use');
      });
      break;
      
    case 'stats':
      ledger.displayStatistics();
      break;
      
    case 'recent':
      const limit = parseInt(args[1]) || 10;
      ledger.getRecentActivities(limit).then(activities => {
        console.log(createCeremonialBanner('RECENT ACTIVITIES'));
        activities.forEach(activity => {
          console.log(`[${activity.timestamp}] ${activity.type}: ${JSON.stringify(activity.details)}`);
        });
      });
      break;
      
    default:
      console.log('Available commands: init, stats, recent [limit]');
  }
}

module.exports = CeremonialLedger;