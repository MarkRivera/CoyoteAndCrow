const statsAndSkills = {
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
    art: ["spirit", "will"],
    atheletics: ["strength", "agility"],
    ceremony: ["wisdom", "spirit"],
    charm: ["charisma", "perception"],
    coercion: ["charisma", "spirit"],
    computers: ["intelligence", "wisdom"],
    crafting: ["perception", "spirit"],
    cybernetics: ["intelligence", "wisdom"],
    deception: ["charisma", "will"],
    farming: ["intelligence", "endurance"],
    "first-aid": ["intelligence", "will"],
    herbalism: ["perception", "wisdom"],
    husbandry: ["charisma", "wisdom"],
    investigation: ["perception", "wisdom"],
    knowledge: ["intelligence", "wisdom"],
    language: ["perception", "wisdom"],
    medicine: ["intelligence", "wisdom"],
    "melee-weapons": ["strength", "endurance"],
    music: ["spirit", "perception"],
    performance: ["charisma", "spirit"],
    piloting: ["intelligence", "agility"],
    "ranged-weapons": ["perception", "agility"],
    science: ["intelligence", "perception"],
    skulduggery: ["perception", "charisma"],
    stealth: ["agility", "wisdom"],
    survival: ["endurance", "wisdom"],
    tracking: ["perception", "wisdom"],
    "unarmed-combat": ["strength", "intelligence"],
  },
  skillsByAttribute: function () {
    const list = {};
    statsAndSkills.stats.forEach(stat => {
      list[stat] = Object.keys(statsAndSkills.generalSkills).filter(skill => {
        return statsAndSkills.generalSkills[skill].indexOf(stat) > -1;
      });
    });
    return list;
  },
};

// I need an event listener that will listen to changes in stats, that will reflect on generalized skills
Object.keys(statsAndSkills.generalSkills).forEach(skill => {
  // Why is it ${skill}_stat in the previous sheet, but added as attr_${skill}stat in the pug sheet?
  on(`change:attr_${skill}stat`, () => {});
});
