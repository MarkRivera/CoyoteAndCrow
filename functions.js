const safeguardArray = value => {
  return (Array.isArray(value)) ? value : [value];
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
  
  const attributes = [];
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
    const stat = getNumericValue(values[statAttribute]);
    const rank = getNumericValue(values[rankAttribute]);
    const total = stat + rank;
    const update = {
      [totalAttribute]: total,
    };
    setAttrs(update);

    skills.forEach(skill => {
      const update = {};

      //Calculate Rank
      const rank = safeguardInteger(values[`${skill}_rank`]);
      const relatedStats = globalAttributesbyCategory.generalSkills[skill];
      const statA = safeguardInteger(values[relatedStats[0]]);
      const statB = safeguardInteger(values[relatedStats[1]]);
      const stat = (rank > 0) ? Math.max(statA, statB) : Math.min(statA, statB);
      update[`${skill}_stat`] = stat;
      
      setAttrs(update, callback);
    });

  }, callback);
};