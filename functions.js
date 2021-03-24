//Extracts the ID from an repeating attribure like repeating_specialized-skills_XXXXXXXXXXX_stat:
const getUID = function (value) {
  const regexp = /-.{19}(?=_)|-.{19}$/g;
  const valueAsString = String(value);
  const match = valueAsString.match(regexp);
  return match ? match.join() : "";
};

const isEventPlayerOriginated = event => {
  return (event.sourceType && event.sourceType === 'player')
};

const safeguardArray = value => {
  if(value) return (Array.isArray(value)) ? value : [value];
  return [];
};

const safeguardUniqueArray = value => {
  value = safeguardArray(value);
  return Array.from(new Set(value));
};

const safeguardFunction = value => {
  return (typeof value === 'function') ? value : () => {};
};

const safeguardInteger = function (value, defaultValue = 0) {
  return value && !isNaN(value) ? parseInt(value) : defaultValue;
};

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

const updateGeneralSkills = (skills, callback) => {
  skills = safeguardArray(skills);
  callback = safeguardFunction(callback);

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

      setAttrs(update, callback);
    });
  });
};

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