const globalAttributesbyCategory = {
  stats: ["strength", "agility", "endurance", "intelligence", "perception", "wisdom", "spirit", "charisma", "will"],
  generalSkills: {
    "art": ["spirit","will"],
    "atheletics": ["strength","agility"],
    "ceremony": ["wisdom","spirit"],
    "charm": ["charisma","perception"],
    "coercion": ["charisma","spirit"],
    "computers": ["intelligence","wisdom"],
    "crafting": ["perception","spirit"],
    "cybernetics": ["intelligence","wisdom"],
    "deception": ["charisma","will"],
    "farming": ["intelligence","endurance"],
    "first-aid": ["intelligence","will"],
    "herbalism": ["perception","wisdom"],
    "husbandry": ["charisma","wisdom"],
    "investigation": ["perception","wisdom"],
    "knowledge": ["intelligence","wisdom"],
    "language": ["perception","wisdom"],
    "medicine": ["intelligence","wisdom"],
    "melee-weapons": ["strength","endurance"],
    "music": ["spirit","perception"],
    "performance": ["charisma","spirit"],
    "piloting": ["intelligence","agility"],
    "ranged-weapons": ["perception","agility"],
    "science": ["intelligence","perception"],
    "skulduggery": ["perception","charisma"],
    "stealth": ["agility","wisdom"],
    "survival": ["endurance","wisdom"],
    "tracking": ["perception","wisdom"],
    "unarmed-combat": ["strength","intelligence"]
  },
  skillsByAttribute: function() {
    const list = {};
    globalAttributesbyCategory.stats.forEach(stat => {
      list[stat] = Object.keys(globalAttributesbyCategory.generalSkills).filter(skill => {
        return globalAttributesbyCategory.generalSkills[skill].indexOf(stat) > -1;
      });
    });
    return list;
  }
};

const getUID = function(value) {
  const regexp = /-.{19}(?=_)|-.{19}$/g;
  const valueAsString = String(value);
  const match = valueAsString.match(regexp);
  return (match) ? match.join() : "";
};

const getNumericValue = function(attribute, defaultValue=0) {
  return (attribute && !isNaN(attribute)) ? parseInt(attribute): defaultValue;
};

const updateSkillTotal = function(statAttribute, rankAttribute, totalAttribute) {
  getAttrs([statAttribute, rankAttribute], values => {
    const stat = getNumericValue(values[statAttribute]);
    const rank = getNumericValue(values[rankAttribute]);
    const total = stat + rank;
    const update = {
      [totalAttribute]: total
    };
    setAttrs(update);
  });
};

Object.keys(globalAttributesbyCategory.generalSkills).forEach(skill => {
  on(`change:${skill}_stat change:${skill}_rank`, eventinfo => {
    updateSkillTotal(`${skill}_stat`, `${skill}_rank`, `${skill}_total`);
  });
});

const updateSkillsStats = function(skillList) {
  const skillAttributes = skillList.map(skill => { 
    return `${skill}_rank`; 
  });
  let statAttributes = [];
  skillList.forEach(skill => {
    statAttributes = statAttributes.concat(globalAttributesbyCategory.generalSkills[skill]);
  });
  const filteredStatAttributes = Array.from(new Set(statAttributes));
  getAttrs([...skillAttributes, ...filteredStatAttributes], values => {
    skillList.forEach(skill => {
      if(!isNaN(values[`${skill}_rank`])) {
        const relatedStats = globalAttributesbyCategory.generalSkills[skill];
        const statA = getNumericValue(values[relatedStats[0]]);
        const statB = getNumericValue(values[relatedStats[1]]);
        const stat = Math.max(statA, statB);
        const update = {
          [`${skill}_stat`]: stat
        };
        setAttrs(update);
      }
    });
  });
}

const skillsByAttributes = globalAttributesbyCategory.skillsByAttribute();
Object.keys(skillsByAttributes).forEach(attribute => {
  on(`change:${attribute}`, eventinfo => {
    updateSkillsStats(skillsByAttributes[attribute]);
  });
});

on('change:repeating_specialized-skills:stat change:repeating_specialized-skills:rank', eventinfo => {
  const uid = getUID(eventinfo.sourceAttribute);
  const prefix = `repeating_specialized-skills_${uid}`;
  updateSkillTotal(`${prefix}_stat`, `${prefix}_rank`, `${prefix}_total`);
});

//# sourceURL=coyoteandcrow.js