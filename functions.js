//Extracts the ID from an repeating attribure like repeating_specialized-skills_XXXXXXXXXXX_stat:
const getUID = function (value) {
  const regexp = /-.{19}(?=_)|-.{19}$/g;
  const valueAsString = String(value);
  const match = valueAsString.match(regexp);
  return match ? match.join() : "";
};

//Check if event was originated by player:
const isEventPlayerOriginated = event => {
  return (event.sourceType && event.sourceType === 'player')
};

//Makes sure an value is Array:
const safeguardArray = value => {
  if(value) return (Array.isArray(value)) ? value : [value];
  return [];
};

//Makes sure a value is an Array with unique keys:
const safeguardUniqueArray = value => {
  value = safeguardArray(value);
  return Array.from(new Set(value));
};

//Makes sure a value is Function:
const safeguardFunction = value => {
  return (typeof value === 'function') ? value : () => {};
};

//Makes sure a value is an Integer
const safeguardInteger = function (value, defaultValue = 0) {
  return value && !isNaN(value) ? parseInt(value) : defaultValue;
};

//Gets the stat, rank and total attribute for a group of skills:
const getSkillRelatedAttributes = skills => {
  skills = safeguardArray(skills);
  const skillRelatedAttributes = ['stat', 'rank', 'total'];
  
  let attributes = [];
  skills.forEach(skill => {
    skillRelatedAttributes.forEach(attribute => {
      attributes.push(`${skill}_${attribute}`);
    });
    attributes = attributes.concat(globalAttributesbyCategory.generalSkills[skill]);
  });

  const uniqueAttributes = safeguardUniqueArray(attributes);
  return uniqueAttributes;
};

//Updates a list of general skills
const updateGeneralSkills = skills => {
  skills = safeguardArray(skills);

  skillRelatedAttributes = getSkillRelatedAttributes(skills);

  getAttrs(skillRelatedAttributes, values => {
    skills.forEach(skill => {
      const update = {};

      //Calculate stat
      const rank = safeguardInteger(values[`${skill}_rank`]);
      const relatedStats = globalAttributesbyCategory.generalSkills[skill];
      const statA = safeguardInteger(values[relatedStats[0]]);
      const statB = safeguardInteger(values[relatedStats[1]]);
      const stat = (rank > 0) ? Math.max(statA, statB) : Math.min(statA, statB);
      update[`${skill}_stat`] = stat;

      //Calculate total
      const total = stat + rank;
      update[`${skill}_total`] = total;

      setAttrs(update);
    });
  });
};

//Updates a list of specialized skills OR All the skills if no list is passed:
const processSpecializedSkills = uids => {
  let relatedAttributes = globalAttributesbyCategory.stats;
  const prefix = 'repeating_specialized-skills';
  uids.forEach(uid => {
    relatedAttributes.push(`${prefix}_${uid}_name`);
    relatedAttributes.push(`${prefix}_${uid}_stat`);
    relatedAttributes.push(`${prefix}_${uid}_rank`);
  });
  getAttrs(relatedAttributes, values => {
    const update = {};
    uids.forEach(uid => {
      const stat = safeguardInteger(values[values[`${prefix}_${uid}_stat`]]);
      const rank = safeguardInteger(values[`${prefix}_${uid}_rank`]);
      const total = stat + rank;
      update[`${prefix}_${uid}_total`] = total;
    });
    setAttrs(update);
  });
};
const updateSpecializedSkills = uids => {
  uids = safeguardArray(uids);
  if(uids.length === 0) {
    getSectionIDs('specialized-skills', ids => {
      processSpecializedSkills(ids)
    });
  } else {
    processSpecializedSkills(uids);
  }
};