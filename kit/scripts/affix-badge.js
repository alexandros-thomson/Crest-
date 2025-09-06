/**
 * Badge Affixing System
 * Manages ceremonial badges and crest markings
 */

const fs = require('fs-extra');
const path = require('path');
const { createCeremonialBanner, generateCeremonyId } = require('./utils');
const CeremonialLedger = require('./log-ledger');

class BadgeAffixer {
  constructor() {
    this.badgeDir = path.join(__dirname, '../badges');
    this.ledger = new CeremonialLedger();
  }

  /**
   * Initialize badge directory and templates
   */
  async initialize() {
    await fs.ensureDir(this.badgeDir);
    
    // Create badge templates if they don't exist
    const badges = [
      {
        name: 'initiate-seal',
        title: 'Initiate Seal',
        description: 'Mark of the newly inducted shrine member',
        color: '#45B7D1'
      },
      {
        name: 'keeper-crest',
        title: 'Keeper Crest', 
        description: 'Sacred mark of the shrine keeper',
        color: '#FFD700'
      },
      {
        name: 'herald-mark',
        title: 'Herald Mark',
        description: 'Symbol of the ceremonial announcer',
        color: '#FF6B35'
      },
      {
        name: 'cycle-seal',
        title: 'Cycle Completion Seal',
        description: 'Commemorates the completion of a ceremonial cycle',
        color: '#9B59B6'
      }
    ];

    for (const badge of badges) {
      const badgeFile = path.join(this.badgeDir, `${badge.name}.json`);
      if (!(await fs.pathExists(badgeFile))) {
        await fs.writeJson(badgeFile, {
          ...badge,
          created: new Date().toISOString(),
          ceremonies: []
        }, { spaces: 2 });
      }
    }
  }

  /**
   * Affix a badge to a user
   */
  async affixBadge(userId, badgeName, grantedBy, ceremony = null) {
    await this.initialize();
    
    const badgeFile = path.join(this.badgeDir, `${badgeName}.json`);
    
    if (!(await fs.pathExists(badgeFile))) {
      console.error(`Badge '${badgeName}' does not exist`);
      return false;
    }

    try {
      const badge = await fs.readJson(badgeFile);
      const ceremonialEntry = {
        id: generateCeremonyId(),
        userId: userId,
        grantedBy: grantedBy,
        timestamp: new Date().toISOString(),
        ceremony: ceremony
      };

      badge.ceremonies.push(ceremonialEntry);
      await fs.writeJson(badgeFile, badge, { spaces: 2 });

      // Log to ceremonial ledger
      await this.ledger.logEvent('badge_affix', {
        badge: badgeName,
        recipient: userId,
        granter: grantedBy,
        ceremony: ceremony
      });

      console.log(`🏆 Badge '${badge.title}' affixed to user ${userId}`);
      return true;

    } catch (error) {
      console.error('Error affixing badge:', error.message);
      return false;
    }
  }

  /**
   * List available badges
   */
  async listBadges() {
    await this.initialize();
    
    const badgeFiles = await fs.readdir(this.badgeDir);
    const jsonBadges = badgeFiles.filter(file => file.endsWith('.json'));
    
    console.log(createCeremonialBanner('AVAILABLE BADGES'));
    
    for (const badgeFile of jsonBadges) {
      const badgePath = path.join(this.badgeDir, badgeFile);
      const badge = await fs.readJson(badgePath);
      console.log(`🏆 ${badge.title} (${badge.name})`);
      console.log(`   ${badge.description}`);
      console.log(`   Ceremonies: ${badge.ceremonies.length}`);
      console.log('');
    }
  }

  /**
   * Get badge history for a user
   */
  async getUserBadges(userId) {
    await this.initialize();
    
    const badgeFiles = await fs.readdir(this.badgeDir);
    const jsonBadges = badgeFiles.filter(file => file.endsWith('.json'));
    const userBadges = [];

    for (const badgeFile of jsonBadges) {
      const badgePath = path.join(this.badgeDir, badgeFile);
      const badge = await fs.readJson(badgePath);
      
      const userCeremonies = badge.ceremonies.filter(c => c.userId === userId);
      if (userCeremonies.length > 0) {
        userBadges.push({
          badge: badge,
          ceremonies: userCeremonies
        });
      }
    }

    return userBadges;
  }

  /**
   * Display user's badge collection
   */
  async displayUserBadges(userId) {
    const userBadges = await this.getUserBadges(userId);
    
    console.log(createCeremonialBanner(`BADGES FOR USER ${userId}`));
    
    if (userBadges.length === 0) {
      console.log('No badges found for this user.');
      return;
    }

    userBadges.forEach(({ badge, ceremonies }) => {
      console.log(`🏆 ${badge.title}`);
      console.log(`   ${badge.description}`);
      console.log(`   Earned: ${ceremonies.length} time(s)`);
      ceremonies.forEach(ceremony => {
        console.log(`   - ${new Date(ceremony.timestamp).toLocaleDateString()} by ${ceremony.grantedBy}`);
      });
      console.log('');
    });
  }
}

// CLI Interface
if (require.main === module) {
  const affixer = new BadgeAffixer();
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'init':
      affixer.initialize().then(() => {
        console.log('✨ Badge Affixer initialized');
      });
      break;

    case 'list':
      affixer.listBadges();
      break;

    case 'affix':
      const [, userId, badgeName, grantedBy, ceremony] = args;
      if (!userId || !badgeName || !grantedBy) {
        console.log('Usage: node affix-badge.js affix <userId> <badgeName> <grantedBy> [ceremony]');
        process.exit(1);
      }
      affixer.affixBadge(userId, badgeName, grantedBy, ceremony).then(success => {
        process.exit(success ? 0 : 1);
      });
      break;

    case 'user':
      const [, targetUserId] = args;
      if (!targetUserId) {
        console.log('Usage: node affix-badge.js user <userId>');
        process.exit(1);
      }
      affixer.displayUserBadges(targetUserId);
      break;

    default:
      console.log('Available commands: init, list, affix <userId> <badgeName> <grantedBy> [ceremony], user <userId>');
  }
}

module.exports = BadgeAffixer;