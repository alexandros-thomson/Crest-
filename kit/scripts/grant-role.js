/**
 * Role Grant Ceremony System
 * Main script for conducting role-granting rituals
 */

const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const { loadConfig, validatePermissions, createCeremonialBanner } = require('./utils');
const CeremonialLedger = require('./log-ledger');
const BadgeAffixer = require('./affix-badge');
require('dotenv').config();

class RoleGranter {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
      ]
    });
    
    this.ledger = new CeremonialLedger();
    this.badgeAffixer = new BadgeAffixer();
    this.isReady = false;
  }

  /**
   * Initialize the Discord client
   */
  async initialize() {
    console.log(createCeremonialBanner('ROLE-GRANT RITUAL KIT'));
    console.log('🔥 Initializing ceremonial connections...');

    return new Promise((resolve, reject) => {
      this.client.once('ready', async () => {
        console.log(`✨ Connected to Discord as ${this.client.user.tag}`);
        await this.ledger.initialize();
        await this.badgeAffixer.initialize();
        this.isReady = true;
        resolve();
      });

      this.client.once('error', reject);

      // Login with bot token
      if (process.env.DISCORD_TOKEN) {
        this.client.login(process.env.DISCORD_TOKEN).catch(reject);
      } else {
        console.log('⚠️  No DISCORD_TOKEN found, running in offline mode');
        this.isReady = true;
        resolve();
      }
    });
  }

  /**
   * Grant a role to a user with full ceremony
   */
  async grantRole(guildId, userId, roleName, grantedBy, options = {}) {
    if (!this.isReady) {
      await this.initialize();
    }

    console.log(`🎭 Beginning role grant ceremony for ${roleName}`);

    try {
      // Load role configuration
      const roleConfig = await loadConfig('roles');
      if (!roleConfig || !roleConfig.roles[roleName]) {
        console.error(`Role '${roleName}' not found in configuration`);
        return false;
      }

      const role = roleConfig.roles[roleName];
      console.log(`📜 Role: ${role.name} - ${role.description}`);

      // Validate permissions
      const hasPermission = await validatePermissions(grantedBy, 'grant_roles');
      if (!hasPermission) {
        console.error(`User ${grantedBy} lacks permission to grant roles`);
        return false;
      }

      let discordSuccess = true;

      // Attempt Discord role assignment if connected
      if (this.client.user && guildId) {
        try {
          const guild = await this.client.guilds.fetch(guildId);
          const member = await guild.members.fetch(userId);
          
          // Find or create the Discord role
          let discordRole = guild.roles.cache.find(r => r.name === role.name);
          
          if (!discordRole) {
            discordRole = await guild.roles.create({
              name: role.name,
              color: role.color,
              reason: `Ceremonial role creation: ${role.description}`
            });
            console.log(`🎨 Created Discord role: ${role.name}`);
          }

          // Assign the role
          await member.roles.add(discordRole);
          console.log(`👑 Discord role assigned to ${member.user.tag}`);

        } catch (error) {
          console.error(`Discord role assignment failed: ${error.message}`);
          discordSuccess = false;
        }
      } else {
        console.log('📴 Discord offline - role grant recorded ceremonially only');
      }

      // Log the ceremony
      await this.ledger.logEvent('role_grant', {
        role: roleName,
        recipient: userId,
        granter: grantedBy,
        guild: guildId,
        discord_success: discordSuccess,
        ceremony_options: options
      });

      // Affix associated badge if configured
      if (options.badge) {
        await this.badgeAffixer.affixBadge(
          userId, 
          options.badge, 
          grantedBy, 
          `role_grant_${roleName}`
        );
      }

      // Send ceremonial announcement if channel specified
      if (options.announceChannel && this.client.user) {
        try {
          const guild = await this.client.guilds.fetch(guildId);
          const channel = guild.channels.cache.find(c => c.name === options.announceChannel);
          
          if (channel) {
            await channel.send(`🎭 **Ceremonial Announcement**\n\n` +
                              `<@${userId}> has been granted the role of **${role.name}**\n` +
                              `*${role.description}*\n\n` +
                              `Ceremony conducted by <@${grantedBy}>`);
          }
        } catch (error) {
          console.error(`Failed to send announcement: ${error.message}`);
        }
      }

      console.log(`✨ Role grant ceremony completed successfully`);
      return true;

    } catch (error) {
      console.error(`Role grant ceremony failed: ${error.message}`);
      return false;
    }
  }

  /**
   * List available roles
   */
  async listRoles() {
    const roleConfig = await loadConfig('roles');
    if (!roleConfig) {
      console.log('No role configuration found');
      return;
    }

    console.log(createCeremonialBanner('AVAILABLE CEREMONIAL ROLES'));
    
    Object.entries(roleConfig.roles).forEach(([key, role]) => {
      console.log(`👑 ${role.name} (${key})`);
      console.log(`   ${role.description}`);
      console.log(`   Level: ${role.level} | Color: ${role.color}`);
      console.log(`   Permissions: ${role.permissions.join(', ')}`);
      console.log('');
    });
  }

  /**
   * Disconnect from Discord
   */
  async disconnect() {
    if (this.client.user) {
      await this.client.destroy();
      console.log('🔥 Ceremonial connections closed');
    }
  }
}

// CLI Interface
if (require.main === module) {
  const granter = new RoleGranter();
  const args = process.argv.slice(2);
  const command = args[0];

  async function runCommand() {
    switch (command) {
      case 'init':
        await granter.initialize();
        console.log('✨ Role Granter ready for ceremonies');
        await granter.disconnect();
        break;

      case 'list':
        await granter.listRoles();
        break;

      case 'grant':
        const [, guildId, userId, roleName, grantedBy] = args;
        if (!guildId || !userId || !roleName || !grantedBy) {
          console.log('Usage: node grant-role.js grant <guildId> <userId> <roleName> <grantedBy>');
          process.exit(1);
        }
        
        const success = await granter.grantRole(guildId, userId, roleName, grantedBy, {
          badge: args[5] || null,
          announceChannel: args[6] || null
        });
        
        await granter.disconnect();
        process.exit(success ? 0 : 1);
        break;

      case 'stats':
        await granter.ledger.displayStatistics();
        break;

      default:
        console.log(createCeremonialBanner('ROLE-GRANT RITUAL KIT'));
        console.log('Available commands:');
        console.log('  init                     - Initialize the ceremonial system');
        console.log('  list                     - List available roles');
        console.log('  grant <guild> <user> <role> <granter> [badge] [channel] - Grant a role');
        console.log('  stats                    - Display ceremonial statistics');
    }
  }

  runCommand().catch(error => {
    console.error('Ceremonial error:', error.message);
    process.exit(1);
  });
}

module.exports = RoleGranter;