# Badge Collection System

The Badge Collection System manages ceremonial badges and crest markings within the shrine's ritual framework. Each badge represents a significant achievement or milestone in a member's ceremonial journey.

## Available Badges

### 🏆 Initiate Seal
**Mark of the newly inducted shrine member**
- **Purpose**: Awarded upon successful completion of initiation ceremony
- **Color**: Blue (#45B7D1)
- **Requirements**: Complete entrance ritual and guild orientation

### 🏆 Keeper Crest  
**Sacred mark of the shrine keeper**
- **Purpose**: Highest ceremonial honor, reserved for guardians of the canon
- **Color**: Gold (#FFD700)
- **Requirements**: Demonstrated mastery of ceremonial arts and leadership

### 🏆 Herald Mark
**Symbol of the ceremonial announcer**
- **Purpose**: Granted to those who serve as messengers and event coordinators
- **Color**: Orange (#FF6B35)
- **Requirements**: Active participation in ceremony announcements

### 🏆 Cycle Completion Seal
**Commemorates the completion of a ceremonial cycle**
- **Purpose**: Marks participation in a full ignition cycle
- **Color**: Purple (#9B59B6)
- **Requirements**: Present for cycle opening, maintenance, and closing ceremonies

## Badge Management Commands

```bash
# Initialize badge system
node kit/scripts/affix-badge.js init

# List all available badges
node kit/scripts/affix-badge.js list

# Affix a badge to a user
node kit/scripts/affix-badge.js affix <userId> <badgeName> <grantedBy> [ceremony]

# View user's badge collection
node kit/scripts/affix-badge.js user <userId>
```

## Badge Storage Structure

Badges are stored as JSON files in the `kit/badges/` directory:

```json
{
  "name": "badge-name",
  "title": "Display Title",
  "description": "Badge description",
  "color": "#hexcolor",
  "created": "ISO timestamp",
  "ceremonies": [
    {
      "id": "ceremony_id",
      "userId": "discord_user_id",
      "grantedBy": "granter_user_id", 
      "timestamp": "ISO timestamp",
      "ceremony": "ceremony_type"
    }
  ]
}
```

## Integration with Role System

Badges can be automatically affixed during role-granting ceremonies by specifying the badge parameter:

```bash
node kit/scripts/grant-role.js grant <guild> <user> <role> <granter> <badgeName>
```

## Ceremonial Significance

Each badge represents not just an achievement, but a ceremonial milestone that connects the bearer to the shrine's ongoing legacy. The badge system maintains detailed records of each affixing ceremony, creating a permanent record in the shrine's ledger.

---

*"Each badge carries the weight of ceremony, the spark of achievement, and the promise of continued growth within the canon."*