// Midi-Qol On Use Macro, Supports Damage Type and Critical Hit
(async ()=>{
async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
let me = args[0].actor;
let target = canvas.tokens.get(args[0].hitTargets[0]._id);
let level = me.items.find(i=> i.name===`Bard`).data.levels;
let bardicDice = level < 5 ? 6 : level >= 5 ? 8 : level >= 15 ? 12 : null;
let selected_items = me.items.filter( i=> i.type === "weapon").sort((a,b) => a.name < b.name ? -1 : 1);
let itemList = "";
for(let i = 0; i < selected_items.length; i++) {
   let item = selected_items[i];
   itemList += `<option value="${item.name}">${item.name}</option>`;
}
new Dialog({
	title: "Defensive Flourish",
	content: `<form><p>Which weapond did you attack with?</p><div class="form-group"><label for="weapons">Weapon</label><select id="weapons">${itemList}</select></div><div class="form-group"><label for="crit">Critical Hit:</label><input id="crit" type="checkbox" name="criticalCheckbox"></div></form>`,
	buttons: {
		one: { label: "Attack", callback: async (html) => {
			let get_weapon = html.find('#weapons')[0].value;
			let damageType = me.items.find(i => i.name===get_weapon).data.damage.parts[0][1];
			let criticalHit = html.find('[name=criticalCheckbox]')[0].checked;
			let baseDice = 1;
			if (criticalHit) baseDice *= 2;
			let damageRoll = new Roll(`${baseDice}d${bardicDice}`).roll();
			let maxRoll = Math.min(bardicDice, damageRoll.total);
			let flourishd = await actorD.effects.find(ef=> ef.label === "Defensive Flourish");
			if (!flourishd){
				const effectData = {
	            label : "Defensive Flourish",
	            icon : "systems/dnd5e/icons/skills/weapon_15.jpg",
	            changes: [{
	                "key": "data.attributes.ac.value",
	                "mode": 2,
	                "value": maxRoll,
	                "priority": 20
	            }]
           }    
           await actor.createEmbeddedEntity("ActiveEffect", effectData);
           game.Gametime.doIn({seconds:6}, async () => {
		   let defense_id = await actorD.effects.find(ef=> ef.label === "Defensive Flourish").id;
           await actor.deleteEmbeddedEntity("ActiveEffect", defense_id);
			});
           }
		   new MidiQOL.DamageOnlyWorkflow(actor, token, damageRoll.total, damageType, [target], damageRoll, {itemCardId: args[0].itemCardId})
		   await wait(2000);
		   let target_attacked = `<div class="midi-qol-flex-container"><div>hits</div><div class="midi-qol-target-npc midi-qol-target-name" id="${target._id}"> ${target.name}</div><div><img src="${target.data.img}" width="30" height="30" style="border:0px"></div></div>`;
		   let hit_results = `<div><div class="midi-qol-nobox">${target_attacked}</div></div>`;
		   const chatMessage = await game.messages.get(args[0].itemCardId);
		   let content = await duplicate(chatMessage.data.content);
		   const searchString =  '<div class="midi-qol-hits-display"></div>';
		   const replaceString = `<div class="midi-qol-hits-display">${hit_results}</div>`
		   content = await content.replace(searchString, replaceString);
		   await chatMessage.update({content: content});
		}},
     }
}).render(true);
})();