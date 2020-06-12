const skillList = {
  Common: [],
};
for (var attr in actor.data.data.attributes) {
   console.log("in loop to fill array");
   console.log(attr);
   skillList.Common.push(attr);
}
function createListOfSkills() {
  let output = "";
  for (var skillType in skillList) {
    if (output !== "") {
      output += "</optgroup>";
    }
    if (skillList.hasOwnProperty(skillType)) {    
      output += `<optgroup label="${skillType} Skills">`;
      skillList[skillType].map((x) => {
        console.log(x);
        output += `<option value="${x}">${x}</option>`;
      });
    }
  }
  output += "</optgroup>";
  return output;
}

let applyChanges = false;
if (!actor) {
  new Dialog({
    title: `Select a Token to use this macro.`,
    content: `<h2>Select a Token to use this macro.</h2>`,
    buttons: {
      no: {
        icon: "<i class='fas fa-times'></i>",
        label: `Close`,
      },
    },
    default: "no",
    close: (html) => {},
  }).render(true);
} else {
  console.log(actor);
  new Dialog({
    title: `Skill Roll`,
    content: `
    <form>
      <div class="form-group">
        <label>Choose a Skill:</label>
        <select id="skill" name="skill">
        ${createListOfSkills()}
        </select>
      </div>
    </form>
    `,
    buttons: {
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: `Roll Skill`,
        callback: () => (applyChanges = true),
      },
      no: {
        icon: "<i class='fas fa-times'></i>",
        label: `Cancel`,
      },
    },
    default: "yes",
    close: (html) => {
      if (!actor) {
        applyChanges = false;
      }
      if (applyChanges) {
        let skillToRoll = html.find('[name="skill"]')[0].value;
        let skillMod;
        console.log(skillToRoll);
        if (typeof actor.data.data.attributes[skillToRoll] != "undefined") {
          skillMod = actor.data.data.attributes[skillToRoll].value;
        } else {
          skillMod = 0;
        }

        let r = new Roll(
          `${String(skillToRoll).toUpperCase()} ― 2d10 + @skill`,
          {
            skill: skillMod,
          }
        );

        r.roll();
        r.toMessage();
      }
    },
  }).render(true);
}
