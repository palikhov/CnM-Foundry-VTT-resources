// Make a token for Earthen Hand with both of the attacks on it.
// Midi-qol Item Macro On Use, make sure to set target as a 5 feet Cube
(async()=>{
let itemName = "Earthen Hand";
const target = game.actors.getName(itemName);
let summon = duplicate(target.data.token);
let owner = game.user.id;
let find_template = await canvas.templates.history.filter(temp => temp.data[0].user === owner);
let get_count = await find_template.length -1;
let location = await find_template[get_count].data[0];
let snap = await canvas.grid.getSnappedPosition(location.x, location.y, 1);
summon.x = await snap.x;
summon.y = await snap.y;
await canvas.tokens.createMany(summon);
await canvas.templates.get(location._id).delete();
game.Gametime.doIn({minutes:1}, async () => {
let delete_Token = game.macros.getName("Delete_Token");
if (canvas.tokens.placeables.find(t=>t.name===itemName)){
await delete_Token.execute(itemName);
}
});
})();

// Hotbar button macro
// Setup DAE on Grasp attack to add Restrained Condition on failed saving throw.
(async()=>{
let summon = "Earthen Hand";
let selectOption = "";
if (canvas.tokens.placeables.find(i=> i.name === summon)){
if(game.user.targets.size != 1) return ui.notifications.error(`Please select a target.`);
let target = canvas.tokens.get(Array.from(game.user.targets)[0].id);
if (game.cub.hasCondition("Restrained", target)){
selectOption = `<option value="Crush">Crush</option>`;
} else {
selectOption = `<option value="Grasp">Grasp</option>`;
}
let the_content = `<p>Pick an Attack</p><form><div class="form-group"><select id="attack">${selectOption}</select></div></form>`;
new Dialog({
	title: `Maximilian's Earthen Grasp`,
	content: the_content,
	buttons: {
		one: {label: "Attack", callback: async (html) => {
            let attack = html.find('#attack')[0].value;			
            await canvas.tokens.placeables.find(t=>t.name === summon).actor.items.find(i=> i.name=== attack).roll();
				}
			}
        }
}).render(true);
}
else {
await game.dnd5e.rollItemMacro("Maximilian's Earthen Grasp");
}
})();
// ### DAE Macro in Item Macro for Grasp
const Cub_Condition = game.macros.getName("Cub_Condition");
const lastArg = args[args.length-1];
console.log("Until Save args are ", ...args);
const me = canvas.tokens.placeables.find(i=> i.name === "Earthen Hand");
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
let target = canvas.tokens.get(lastArg.tokenId);
let item = lastArg.efData.flags.dae.itemData;

(async()=>{
if(args[0]==="on"){
 Cub_Condition.execute(target.id, "Restrained", "add");
}

if (args[0] === "each") {
  const saveType = item.data.save.ability;
  const DC = item.data.save.dc;
    let save = (await tactor.rollAbilitySave(saveType, {fastForward: true, chatMessage: false}));
    let saveResult = "";
    if (save.total >= DC) {
      await tactor.deleteEmbeddedEntity("ActiveEffect", lastArg.effectId);
      saveResult = `saves`;
      Cub_Condition.execute(target.id, "Restrained", "remove");
    }
    else {
      saveResult = `fails`;
    }
      let the_message = `<div class="dnd5e chat-card item-card midi-qol-item-card" data-actor-id="${tactor.id}" data-item-id="${item.id}"><header class="card-header flexrow"><img src="${item.img}" title="${item.name}" width="36" height="36"><h3 class="item-name">${item.name}</h3></header><div class="card-content" style="display: none;">${item.data.description.value}</div><div class="card-buttons"><div><div class="flexrow 1"><div class="midi-qol-attack-roll"><div class="end-midi-qol-attack-roll"></div></div></div><div class="flexrow 1"><div class="midi-qol-damage-roll"><div class="end-midi-qol-damage-roll"></div></div></div></div><div class="flexrow 1"><div class="midi-qol-other-roll"><div class="end-midi-qol-other-roll"></div></div></div><div class="midi-qol-hits-display"><div class="end-midi-qol-hits-display"></div></div><div class="midi-qol-saves-display"><div data-item-id="${item.id}"><div class="midi-qol-nobox midi-qol-bigger-text">${item.name} DC ${DC} ${CONFIG.DND5E.abilities[saveType]} Saving Throw:</div><div><div class="midi-qol-nobox"><div class="midi-qol-bigger-text"><span></span></div><div class="midi-qol-flex-container"><div class="midi-qol-target-npc midi-qol-target-name" id="${tactor.id}"> ${target.name}</div><div>${saveResult} with ${save.total}</div><div><img src="${target.data.img}" height="30" style="border:0px"></div></div></div></div></div><div class="end-midi-qol-saves-display"></div></div></div></div>`;
      ChatMessage.create({
            speaker: ChatMessage.getSpeaker({token: target.name}),
            content: the_message,
            });
  }
})();
