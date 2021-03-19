const getUID = function(value) {
  const regexp = /-.{19}(?=_)|-.{19}$/g;
  const valueAsString = String(value);
  const match = valueAsString.match(regexp);
  return (match) ? match.join() : "";
};

const updateSkill = function(statAttribute, rankAttribute, totalAttribute) {
  getAttrs([statAttribute, rankAttribute], values => {
    const stat = (values[statAttribute] && !isNaN(values[statAttribute])) ? parseInt(values[statAttribute]): 0;
    const rank = (values[rankAttribute] && !isNaN(values[rankAttribute])) ? parseInt(values[rankAttribute]): 0;
    const total = stat + rank;
    const update = {
      [totalAttribute]: total
    };
    setAttrs(update);
  });
};

["art", "atheletics", "ceremony", "charm", "coercion", "computers", "crafting", "cybernetics", "deception", "farming", "first-aid", "herbalism", "husbandry", "investigation", "knowledge", "language", "medicine", "melee-weapons", "music", "performance", "piloting", "ranged-weapons", "science", "skulduggery", "stealth", "survival", "tracking", "unarmed-combat"].forEach(skill => {
  on(`change:${skill}_stat change:${skill}_rank`, eventinfo => {
    updateSkill(`${skill}_stat`, `${skill}_rank`, `${skill}_total`);
  })
});

on('change:repeating_specialized-skills:stat change:repeating_specialized-skills:rank', eventinfo => {
  const uid = getUID(eventinfo.sourceAttribute);
  const prefix = `repeating_specialized-skills_${uid}`;
  updateSkill(`${prefix}_stat`, `${prefix}_rank`, `${prefix}_total`);
});

//# sourceURL=coyoteandcrow.js