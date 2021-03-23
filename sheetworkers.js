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

//Extracts the ID from an repeating attribure like repeating_specialized-skills_XXXXXXXXXXX_stat:
const getUID = function (value) {
  const regexp = /-.{19}(?=_)|-.{19}$/g;
  const valueAsString = String(value);
  const match = valueAsString.match(regexp);
  return match ? match.join() : "";
};

//Reads text attribute and return its value or 0 when not valid:
const getNumericValue = function (attribute, defaultValue = 0) {
  return attribute && !isNaN(attribute) ? parseInt(attribute) : defaultValue;
};

//Reads the stat and rank o the chosen skill and updates its total:
const updateSkillTotal = function (
  statAttribute,
  rankAttribute,
  totalAttribute
) {
  getAttrs([statAttribute, rankAttribute], values => {
    const stat = getNumericValue(values[statAttribute]);
    const rank = getNumericValue(values[rankAttribute]);
    const total = stat + rank;
    const update = {
      [totalAttribute]: total,
    };
    setAttrs(update);
  });
};

// Sets a listerner to update the skill total on changes to skills stats and ranks:
Object.keys(globalAttributesbyCategory.generalSkills).forEach(skill => {
  on(`change:${skill}_stat change:${skill}_rank`, eventinfo => {
    if (!eventinfo.sourceType || eventinfo.sourceType !== "player") {
      return;
    }

    updateSkillTotal(`${skill}_stat`, `${skill}_rank`, `${skill}_total`);
    console.log("Updating General Skills Totals");
  });
});

//Update a list of skills related to a specific attribure (Strength, Agility, ...):
const updateSkillsStats = function (skillList, callback = () => {}) {
  const skillAttributes = skillList.map(skill => {
    return `${skill}_rank`;
  });

  let statAttributes = [];
  skillList.forEach(skill => {
    statAttributes = statAttributes.concat(
      globalAttributesbyCategory.generalSkills[skill]
    );
  });

  const filteredStatAttributes = Array.from(new Set(statAttributes));
  getAttrs([...skillAttributes, ...filteredStatAttributes], values => {
    skillList.forEach(skill => {
      if (!isNaN(values[`${skill}_rank`])) {
        const relatedStats = globalAttributesbyCategory.generalSkills[skill];
        const statA = getNumericValue(values[relatedStats[0]]);
        const statB = getNumericValue(values[relatedStats[1]]);
        const stat =
          parseInt(values[`${skill}_rank`]) > 0
            ? Math.max(statA, statB)
            : Math.min(statA, statB);
        const update = {
          [`${skill}_stat`]: stat,
        };
        setAttrs(update, callback);
      }
    });
  });
};

//Sets a listerner to update skill stats on changes to linked stat:
const skillsByAttributes = globalAttributesbyCategory.skillsByAttribute();
Object.keys(skillsByAttributes).forEach(attribute => {
  on(`change:${attribute}`, eventinfo => {
    updateSkillsStats(skillsByAttributes[attribute]);
    console.log("Updating Skill Stat");
  });
});

// When a rank is changed, update stat:

Object.keys(globalAttributesbyCategory.generalSkills).forEach(skill => {
  on(`change:${skill}_rank`, eventinfo => {
    // const newRank = getNumericValue(eventinfo.newValue)
    updateSkillsStats([skill], () => {
      updateSkillTotal(`${skill}_stat`, `${skill}_rank`, `${skill}_total`);
    });
  });
});

//Sets a listerner to update the specializedskill total on changes to stats and ranks:
on(
  "change:repeating_specialized-skills:stat change:repeating_specialized-skills:rank",
  eventinfo => {
    const uid = getUID(eventinfo.sourceAttribute);
    const prefix = `repeating_specialized-skills_${uid}`;
    updateSkillTotal(`${prefix}_stat`, `${prefix}_rank`, `${prefix}_total`);
    console.log("Updating Specialized Skills Totals");
  }
);

//# sourceURL=coyoteandcrow.js
