// Sets a listerner to update a skill when its rank changes
Object.keys(globalAttributesbyCategory.generalSkills).forEach(skill => {
  on(`change:${skill}_rank`, event => {
    if(!isEventPlayerOriginated(event)) return;
    updateGeneralSkills(skill);
    console.log(`Updating General Skill: ${skill}`);
  });
});

//Sets a listerner to update the specializedskill total on changes to stats and ranks:
on(
  "change:repeating_specialized-skills:stat change:repeating_specialized-skills:rank",
  eventinfo => {
    const uid = getUID(eventinfo.sourceAttribute);
    updateSpecializedSkills(uid);
    console.log(`Updating General Skill: ${uid}`);
  }
);

//Sets a listerner to update skills that a linked to a specific stats
const skillsByAttributes = globalAttributesbyCategory.skillsByAttribute();
Object.keys(skillsByAttributes).forEach(attribute => {
  on(`change:${attribute}`, eventinfo => {
    const skills = skillsByAttributes[attribute];
    updateGeneralSkills(skills);
    updateSpecializedSkills();
    console.log(`Updating General Skill: ${skills.join(', ')}`);
    console.log(`Updating All Specialized Skills`);
  });
});

//# sourceURL=coyoteandcrow.js
