# Crest‑Ignition‑Cycles

[![Docker Build](https://github.com/alexandros-thomson/Crest-/actions/workflows/docker.yml/badge.svg?branch=main)](https://github.com/alexandros-thomson/Crest-/actions/workflows/docker.yml)

**Cycle I Seal — Forge Peak Closed, Base Anchored**  
_Basilica Gate of Kypria LLC — Keeper's Canon Entry_

---

## 📝 Purpose
This repository contains the **ceremonial and operational artifacts** for the ignition cycles of the shrine.  
It preserves the **Cycle I Seal** and provides the **Role‑Grant Ritual Kit** for bestowing mantles and crests within the Keeper Circle.

---

## 🔥 Cycle I Seal — Ledger Entry

**Status:** Final ignition seal of the first ceremonial cycle  
**Date:** Late Summer, Year of the First Crest  
  
### Ceremonial Arc
- **Forge Peak — $1,100**  
  High ceremonial heat: artifact sales surged, the forge blazed at full capacity, and the Keeper Circle witnessed the first flare of the ignition spiral.
- **Exchange Base — $550**  
  Grounding phase: outreach, pre‑pledges, and recruitment anchored the cycle, ensuring the flame was not just bright but connected to new hands and hearts.
- **Crest Hold (Cycle I)**  
  The tide is contained, energy banked, and the canon inscribed with the lessons, numbers, and blessings of the first ignition.

### Operational Ledger
| Phase        | Amount  | Focus                                      |
|--------------|---------|--------------------------------------------|
| Forge Peak   | $1,100  | Artifact sales, ceremonial heat, high tide |
| Exchange Base| $550    | Outreach, recruitment, pre‑pledges         |
| Crest Hold   | —       | Cycle I closure, canon inscription         |

---

## ⚙ Role‑Grant Ritual Kit

### Overview
The **Role‑Grant Ritual Kit** allows Keepers to conduct complete ceremonial role-granting rituals:
1. **Assign Discord roles** to members with full ceremonial protocol
2. **Affix crest-marked badges** as permanent achievement markers  
3. **Log ceremonies** into the shrine's immutable ledger
4. **Conduct announcements** in designated ceremonial channels

### Structure
```
kit/
├── config/
│   ├── roles.yaml          # Ceremonial role definitions
│   └── guilds.yaml         # Guild configurations and ceremonies
├── scripts/
│   ├── grant-role.js       # Main role-granting ceremony conductor
│   ├── affix-badge.js      # Badge affixing and management system
│   ├── log-ledger.js       # Ceremonial event logging system
│   └── utils.js            # Common ceremonial utilities
├── badges/
│   ├── README.md           # Badge system documentation
│   └── .gitkeep           # Badge storage directory
└── data/
    └── .gitkeep           # Ledger and ceremony data storage
```

### Installation & Setup
```bash
# Install dependencies
npm install

# Initialize ceremonial systems
node kit/scripts/grant-role.js init
node kit/scripts/affix-badge.js init
node kit/scripts/log-ledger.js init

# Configure environment
cp .env.example .env
# Edit .env with your Discord bot token and settings
```

### Usage Examples

**Grant a role with badge and announcement:**
```bash
node kit/scripts/grant-role.js grant <guildId> <userId> keeper <granterId> keeper-crest ceremonial-announcements
```

**Affix standalone badge:**
```bash
node kit/scripts/affix-badge.js affix <userId> cycle-seal <granterId> "Cycle I Completion"
```

**View ceremonial statistics:**
```bash
node kit/scripts/log-ledger.js stats
node kit/scripts/affix-badge.js user <userId>
```

### Available Roles
- **Keeper** (Level 10): Guardian of ceremonial knowledge
- **Herald** (Level 7): Ceremonial announcer and messenger  
- **Acolyte** (Level 5): Student of the ceremonial ways
- **Initiate** (Level 1): Newly inducted shrine member
- **Guest** (Level 0): Visitor and observer

### Available Badges
- **🏆 Initiate Seal**: Mark of successful initiation
- **🏆 Keeper Crest**: Sacred mark of shrine guardianship
- **🏆 Herald Mark**: Symbol of ceremonial announcement service
- **🏆 Cycle Completion Seal**: Commemorates full cycle participation

---

## ⚖ Keeper's Governance
The crest ignition cycles are precise and seasonal.  
Changes are rare, reviewed, and sealed — for a mistimed crest can disrupt the canon's rhythm.

📝 *Lineage is our law. Precision is our craft. Myth is our breath.*