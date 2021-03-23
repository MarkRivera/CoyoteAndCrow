"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var globalAttributesbyCategory = {
  stats: ["strength", "agility", "endurance", "intelligence", "perception", "wisdom", "spirit", "charisma", "will"],
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
    "unarmed-combat": ["strength", "intelligence"]
  },
  skillsByAttribute: function skillsByAttribute() {
    var list = {};
    globalAttributesbyCategory.stats.forEach(function (stat) {
      list[stat] = Object.keys(globalAttributesbyCategory.generalSkills).filter(function (skill) {
        return globalAttributesbyCategory.generalSkills[skill].indexOf(stat) > -1;
      });
    });
    return list;
  }
}; //Extracts the ID from an repeating attribure like repeating_specialized-skills_XXXXXXXXXXX_stat:

var getUID = function getUID(value) {
  var regexp = /-.{19}(?=_)|-.{19}$/g;
  var valueAsString = String(value);
  var match = valueAsString.match(regexp);
  return match ? match.join() : "";
}; //Reads text attribute and return its value or 0 when not valid:


var getNumericValue = function getNumericValue(attribute) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return attribute && !isNaN(attribute) ? parseInt(attribute) : defaultValue;
}; //Reads the stat and rank o the chosen skill and updates its total:


var updateSkillTotal = function updateSkillTotal(statAttribute, rankAttribute, totalAttribute) {
  getAttrs([statAttribute, rankAttribute], function (values) {
    var stat = getNumericValue(values[statAttribute]);
    var rank = getNumericValue(values[rankAttribute]);
    var total = stat + rank;

    var update = _defineProperty({}, totalAttribute, total);

    setAttrs(update);
  });
}; // Sets a listerner to update the skill total on changes to skills stats and ranks:


Object.keys(globalAttributesbyCategory.generalSkills).forEach(function (skill) {
  on("change:".concat(skill, "_stat change:").concat(skill, "_rank"), function (eventinfo) {
    if (!eventinfo.sourceType || eventinfo.sourceType !== "player") {
      return;
    }

    updateSkillTotal("".concat(skill, "_stat"), "".concat(skill, "_rank"), "".concat(skill, "_total"));
    console.log("Updating General Skills Totals");
  });
}); //Update a list of skills related to a specific attribure (Strength, Agility, ...):

var updateSkillsStats = function updateSkillsStats(skillList) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
  var skillAttributes = skillList.map(function (skill) {
    return "".concat(skill, "_rank");
  });
  var statAttributes = [];
  skillList.forEach(function (skill) {
    statAttributes = statAttributes.concat(globalAttributesbyCategory.generalSkills[skill]);
  });
  var filteredStatAttributes = Array.from(new Set(statAttributes));
  getAttrs([].concat(_toConsumableArray(skillAttributes), _toConsumableArray(filteredStatAttributes)), function (values) {
    skillList.forEach(function (skill) {
      if (!isNaN(values["".concat(skill, "_rank")])) {
        var relatedStats = globalAttributesbyCategory.generalSkills[skill];
        var statA = getNumericValue(values[relatedStats[0]]);
        var statB = getNumericValue(values[relatedStats[1]]);
        var stat = parseInt(values["".concat(skill, "_rank")]) > 0 ? Math.max(statA, statB) : Math.min(statA, statB);

        var update = _defineProperty({}, "".concat(skill, "_stat"), stat);

        setAttrs(update, callback);
      }
    });
  });
}; //Sets a listerner to update skill stats on changes to linked stat:


var skillsByAttributes = globalAttributesbyCategory.skillsByAttribute();
Object.keys(skillsByAttributes).forEach(function (attribute) {
  on("change:".concat(attribute), function (eventinfo) {
    updateSkillsStats(skillsByAttributes[attribute]);
    console.log("Updating Skill Stat");
  });
}); // When a rank is changed, update stat:

Object.keys(globalAttributesbyCategory.generalSkills).forEach(function (skill) {
  on("change:".concat(skill, "_rank"), function (eventinfo) {
    // const newRank = getNumericValue(eventinfo.newValue)
    updateSkillsStats([skill], function () {
      updateSkillTotal("".concat(skill, "_stat"), "".concat(skill, "_rank"), "".concat(skill, "_total"));
    });
  });
}); //Sets a listerner to update the specializedskill total on changes to stats and ranks:

on("change:repeating_specialized-skills:stat change:repeating_specialized-skills:rank", function (eventinfo) {
  var uid = getUID(eventinfo.sourceAttribute);
  var prefix = "repeating_specialized-skills_".concat(uid);
  updateSkillTotal("".concat(prefix, "_stat"), "".concat(prefix, "_rank"), "".concat(prefix, "_total"));
  console.log("Updating Specialized Skills Totals");
}); //# sourceURL=coyoteandcrow.js