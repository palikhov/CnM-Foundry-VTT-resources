(async()=>{
let Cub_Condition = game.macros.getName("Cub_Condition");
let ActiveEffect = game.macros.getName("ActiveEffect");
const flagId = "blindDeaf_" + args[0].actor._id;
console.log(args[0]);
if(await args[0].failedSaves.length > 0){
const itemD = await args[0].actor.items.find(i=> i.name==="Blindness/Deafness");
let failed_list = "";
let spell_max =  args[0].failedSaves.length === Number(args[0].spellLevel -1) ? Number(args[0].spellLevel -1 ) : args[0].failedSaves.length > Number(args[0].spellLevel -1) ? Number(args[0].spellLevel -1) : args[0].failedSaves.length;
let failedSaved = await args[0].failedSaves;
for(let i = 0; i < spell_max; i++){
let failed_target = await failedSaved[i];
if(game.cub.hasCondition("Blinded", canvas.tokens.get(failed_target._id))){
failed_list += `<div class="form-group"><label for="failed"><small>${failed_target.name}</small></label><select id="failed"><option value="Deafened">Deafened</option></select><input type="text" id="ftarget" value="${failed_target._id}" hidden></div>`;
}    
else if(game.cub.hasCondition("Deafened", canvas.tokens.get(failed_target._id))){
failed_list += `<div class="form-group"><label for="failed"><small>${failed_target.name}</small></label><select id="failed"><option value="Blinded">Blinded</option></select><input type="text" id="ftarget" value="${failed_target._id}" hidden></div>`;
} else {
failed_list += `<div class="form-group"><label for="failed"><small>${failed_target.name}</small></label><select id="failed"><option value="Blinded">Blinded</option><option value="Deafened">Deafened</option></select><input type="text" id="ftarget" value="${failed_target._id}" hidden></div>`;
    }
}
new Dialog({
		title: `Blindness/Deafness : Spell Level ${args[0].spellLevel}`,
		content: `<h3 style="text-align:center;">Pick a Condition to Apply</h3><form>${failed_list}</form>`,
		buttons: {
		apply: {label: "Apply", callback: async (html) => {
		for(let i = 0; i < spell_max; i++){
        let apply_con = await html.find('select#failed')[i].value;
        let get_target = await html.find('input#ftarget')[i].value;
        const find_target = await canvas.tokens.get(get_target);
		Cub_Condition.execute(find_target, apply_con, "add");
		const hookId = Hooks.on("updateCombat", combatRound);
		await DAE.setFlag(find_target, flagId, hookId);
		game.Gametime.doIn({minutes:1}, async () => {
		Cub_Condition.execute(find_target, ["Deafened", "Blindness"], "remove");
		await DAE.unsetFlag(find_target, flagId);
		await ActiveEffect.execute(find_target, itemD.name, "remove");
		            });
		        }
            }
	    }
	}
}).render(true);
}
async function combatRound(combat, update) {
  if (!("round" in update || "turn" in update)) return;
  if (combat.combatant.tokenId === find_target.id) {
      game.Gametime.doIn({seconds:6}, async () => {
      await saveThrow(find_target);
      });
  }
}

function saveThrow(find_target){
let save_roll =  await find_target.actor.rollAbilitySave('con', {fastForward: true });
if (save_roll.total > itemD.data.save.dc) {    
    cleanse(find_target);
    let save_result = `${find_target.name} successfully made their saving throw ${save_roll.total} [DC ${itemD.data.save.dc}]`;
    ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({token: find_target}),
        content: save_result
    });	
	} 
}
// Condition Removal
async function cleanse(find_target){
	Hooks.off("updateCombat", combatRound);
    Cub_Condition.execute(find_target, ["Deafened", "Blindness"], "remove");
	await DAE.unsetFlag(find_target, flagId);
	await ActiveEffect.execute(find_target, itemD.name, "remove");
}
})();
