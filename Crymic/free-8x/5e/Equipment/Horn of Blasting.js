// Hotbar macro. The user automatically rolls 1d100 per usage. If fails, the horn automatically explodes and deals damage to user using Midi-qol.
// The item then is overwritten to be useless trash.
let actorData = canvas.tokens.controlled[0]?.actor || game.user.character;   
let mItem = actorData ? actorData.items.find(i => i.name==="Horn of Blasting") : null;
let itemUpdate = duplicate(mItem);

let usage = new Roll(`1d100`).roll();
if (usage.total <= 20) {
let damageRoll = new Roll(`10d6`).roll();
let target = canvas.tokens.controlled[0];
MidiQOL.applyTokenDamage([{damage: damageRoll.total, type: "fire"}], damageRoll.total, new Set([target]), "Horn of Blasting", new Set());
let results_html = `<div class="dnd5e chat-card item-card"><header class="card-header flexrow"><img src="${itemD.img}" title="${itemD.name}" width="36" height="36"><h3 class="item-name">${itemD.name}</h3></header><div class="card-content">${itemD.data.description.chat}</div>
<div class="card-buttons"><div class="flexrow 1"><div style="text-align:center;text-transform:capitalize;">${itemD.data.save.ability} Saving Throw (DC ${itemD.data.save.dc})<div class="dice-roll"><div class="dice-result"><div class="dice-formula">${save_roll.result}</div><h4 class="dice-total">${save_roll.total}</h4></div></div></div></div></div><footer class="card-footer"><span>${itemD.data.level} Level</span><span>V</span><span>${itemD.data.activation.cost} ${itemD.data.activation.type} Action</span><span>${itemD.data.target.value} ${itemD.data.target.type}</span><span>${itemD.data.range.value} ${itemD.data.range.units}</span><span>${itemD.data.duration.value} ${itemD.data.duration.units}</span></footer></div>`;
ChatMessage.create({
					        user: game.user._id,
                            speaker: ChatMessage.getSpeaker({token: target}),
                            content: results_html
});

async function breakItem(){
itemUpdate.name = "Twisted Bent Horn";
itemUpdate.data.description.value = "Once a horn that brought variety, awe, wonder, or fear. Now is just a simple peice of trash.";
itemUpdate.data.activation.type = "";
itemUpdate.data.activation.cost = "";
itemUpdate.data.activation.condition = "";
itemUpdate.data.target.value = "";
itemUpdate.data.target.type = "";
itemUpdate.data.actionType = "";
itemUpdate.data.damage.parts = [];
itemUpdate.data.price = 0.02;
await actorData.updateEmbeddedEntity("OwnedItem", itemUpdate);
}
setTimeout(() => { breakItem(); }, 3000);
}
else {
game.dnd5e.rollItemMacro("Horn of Blasting");
}