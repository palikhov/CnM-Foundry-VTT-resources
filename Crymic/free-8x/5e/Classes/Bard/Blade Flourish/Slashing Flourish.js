// Midi-qol On Use macro. Can use Cube 15 feet template. Will deal damage to all who aren't of the same dispposition as the bard.
// This macro handles damage, all resources are handled through the item itself.
(async()=>{
async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
let me = args[0].actor;
let target_list = args[0].hitTargets;
let level = me.items.find(i=> i.name===`Bard`).data.levels;
let bardicDice = (Math.round(level/5+0.5)*2)+4;
let selected_items = me.items.filter( i=> i.type === "weapon").sort((a,b) => a.name < b.name ? -1 : 1);
let itemList = "";
for(let i = 0; i < selected_items.length; i++) {
   let item = selected_items[i];
   itemList += `<option value="${item.name}">${item.name}</option>`;
}
new Dialog({
    title: "Slashing Flourish",
	content: `<form><p>Which weapond did you attack with?</p><div class="form-group"><label for="weapons">Weapon</label><select id="weapons">${itemList}</select></div><div class="form-group"><label for="crit">Critical Hit:</label><input id="crit" type="checkbox" name="criticalCheckbox"></div>
        </form>`,
	buttons: {
	    one: { label: "Attack", callback: async (html) => {
	       let get_weapon = html.find('#weapons')[0].value;
           let damageType = me.items.find(i => i.name===get_weapon).data.damage.parts[0][1];
           let criticalHit = html.find('[name=criticalCheckbox]')[0].checked;
           let baseDice = 1;
           if (criticalHit) baseDice *= 2;
	       let damageRoll = new Roll(`${baseDice}d${bardicDice}`).roll();
	       let target_attacked = [];
	       for(let x = 0; x < target_list.length; x++) {
	       let target = await target_list[x];
	       if (target.disposition != me.token.disposition){
	       target_attacked.push(`<div class="midi-qol-flex-container"><div>hits</div><div class="midi-qol-target-npc midi-qol-target-name" id="${target._id}"> ${target.name}</div><div><img src="${target.img}" width="30" height="30" style="border:0px"></div></div>`);
	       let ftarget = await canvas.tokens.placeables.find(t=>t.name===target.name);
	       new MidiQOL.DamageOnlyWorkflow(actor, token, damageRoll.total, damageType, [ftarget], damageRoll, {itemCardId: args[0].itemCardId})
	       }
	       }	       
	       await wait(1000);
		   let attack_list = target_attacked.join('');
	       let hit_results = `<div><div class="midi-qol-nobox">${attack_list}</div></div>`;
	       console.log(hit_results);
	       const chatMessage = await game.messages.get(args[0].itemCardId);
	       let content = await duplicate(chatMessage.data.content);
	       const searchString =  /<div class="midi-qol-hits-display">[\s\S]*<div class="end-midi-qol-hits-display">/g;
	       const replaceString = `<div class="midi-qol-hits-display"><div class="end-midi-qol-hits-display">${hit_results}`;
	       content = await content.replace(searchString, replaceString);
	       await chatMessage.update({content: content});
		}},
     }
}).render(true);
})();
