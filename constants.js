const globalAttributesbyCategory = {
  stats: [
    "strength",
    "agility",
    "endurance",
    "intelligence",
    "perception",
    "wisdom",
    "spirit",
    "charisma",
    "will",
  ],
  generalSkills: {
    "art": ["spirit", "will"],
    "atheletics": ["strength", "agility"],
    "ceremony": ["wisdom", "spirit"],
    "charm": ["charisma", "perception"],
    "coercion": ["charisma", "spirit"],
    "computers": ["intelligence", "wisdom"],
    "crafting": ["perception", "spirit"],
    "cybernetics": ["intelligence", "wisdom"],
    "deception": ["charisma", "will"],
    "farming": ["intelligence", "endurance"],
    "first-aid": ["intelligence", "will"],
    "herbalism": ["perception", "wisdom"],
    "husbandry": ["charisma", "wisdom"],
    "investigation": ["perception", "wisdom"],
    "knowledge": ["intelligence", "wisdom"],
    "language": ["perception", "wisdom"],
    "medicine": ["intelligence", "wisdom"],
    "melee-weapons": ["strength", "endurance"],
    "music": ["spirit", "perception"],
    "performance": ["charisma", "spirit"],
    "piloting": ["intelligence", "agility"],
    "ranged-weapons": ["perception", "agility"],
    "science": ["intelligence", "perception"],
    "skulduggery": ["perception", "charisma"],
    "stealth": ["agility", "wisdom"],
    "survival": ["endurance", "wisdom"],
    "tracking": ["perception", "wisdom"],
    "unarmed-combat": ["strength", "intelligence"],
  },
  skillsByAttribute: function () {
    const list = {};
    globalAttributesbyCategory.stats.forEach(stat => {
      list[stat] = Object.keys(globalAttributesbyCategory.generalSkills).filter(
        skill => {
          return (
            globalAttributesbyCategory.generalSkills[skill].indexOf(stat) > -1
          );
        }
      );
    });
    return list;
  },
};