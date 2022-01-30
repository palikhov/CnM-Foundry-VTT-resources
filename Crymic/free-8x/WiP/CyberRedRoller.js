(async ()=>{
const me = canvas.tokens.controlled[0].actor.getRollData();
console.log(me);
let confirmed = false;
let attributesOptions = "";
let skillOptions = "";
let get_attributes = Object.keys(me.attributes);
let get_skills = Object.keys(me.skills);

for(let i = 0; i < get_attributes.length; i++) {
let attr = get_attributes[i];
console.log(attr);
let attr_cap = attr.charAt(0).toUpperCase() + attr.slice(1);
 attributesOptions +=`<option value="attributes.${attr}">${attr_cap}</option>`;
}

for(let i = 0; i < get_skills.length; i++) {
let skill = get_skills[i];
console.log(skill);
let skill_cap = skill.charAt(0).toUpperCase() + skill.slice(1);
 skillOptions +=`<option value="skills.${skill}">${skill_cap}</option>`;
}

let the_content = `<form class="flexcol"><p>Pick which to roll.</p><div class="form-group"><label for="rollskillz">Roll Skill</label><select id="rollskillz"><option value="roleskills.exec.teamwork">Teamwork</option><option value="roleskills.fixer.operator">Operator</option><option value="roleskills.lawman.backup">Backup</option><option value="roleskills.media.credibility">Credibility</option><option value="roleskills.medtech.medicaltech">Medical Tech</option><option value="roleskills.medtech.medicine">Medicine</option><option value="roleskills.medtech.medtechcryo">Medtech Cryo</option><option value="roleskills.medtech.medtechpharma">Medtech Pharma</option><option value="roleskills.medtech.surgery">Surgery</option><option value="roleskills.netrunner.interface">Interface</option><option value="roleskills.netrunner.spd">Spd</option><option value="roleskills.nomad.moto">Moto</option><option value="roleskills.rockerboy.charismaticimpact">Charismatic Impact</option><option value="roleskills.solo.combatawareness">Combat Awareness</option><option value="roleskills.tech.fabricationexpertise">Fabrication Expertise</option><option value="roleskills.tech.fieldexpertise">Field Expertise</option><option value="roleskills.tech.inventionexpertise">Invention Expertise</option><option value="roleskills.tech.maker">Maker</option><option value="roleskills.tech.upgradeexpertise">Upgrade Expertise</option></select></div><div class="form-group"><label for="attrz">Attribute</label><select id="attrz">${attributesOptions}</select></div><div class="form-group"><label for="skillz">Skill</label><select id="skillz">${skillOptions}</select></div></form>`;
new Dialog({
	title: "Actor Roller",
	content: the_content,
	buttons: {
        one: { label: "Roll", callback: () => confirmed = true },
        cancel: { label: "Cancel", callback: () => confirmed = false }
    },
	close: html => {
        if (confirmed){
        let rollskillz = html.find('#rollskillz')[0].value;
        let attrz = html.find('#attrz')[0].value;
        let skillz = html.find('#skillz')[0].value;
        let base = me.dieRollCommand;
        new Roll(`${base} + @${rollskillz}.value + @${skillz}.value + @${attrz}.value`, actor.getRollData()).roll().toMessage();

        }        
    }
}).render(true);
})();