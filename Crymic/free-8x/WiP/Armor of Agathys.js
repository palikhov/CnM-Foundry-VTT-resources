// this macro is buggy atrm.

let target = canvas.tokens.get(args[1])
let tempHP = 5 * (Number(args[2]) || 1);
let itemD = args[3];
let dmgType = "cold";
let ActorUpdate = game.macros.getName("ActorUpdate");
let ActorSetFlag = game.macros.getName("ActorSetFlag");
let ActorUnSetFlag = game.macros.getName("ActorUnSetFlag");

function healthCheck(attack){
let attacked = attack.hitTargets;
attacked.forEach(async (attacked) =>{
if ((attacked.actor.data.name === target.name) && (attack.item.data.type === "weapon") && (attack.item.data.data.actionType === "mwak")) {
let attacker = attack.actor.token;
MidiQOL.applyTokenDamage([{damage: tempHP, type: [dmgType]}], tempHP, new Set([attacker]), itemD.name, new Set());
let dmg_html = `<div class="dnd5e chat-card item-card"><header class="card-header flexrow"><img src="${itemD.img}" title="${itemD.name}" width="36" height="36"><h3 class="item-name">${itemD.name}</h3></header><div class="card-content">${itemD.data.description.value}</div><div class="card-buttons"><div class="flexrow 1"><div style="text-align:center">(${dmgType})<div class="dice-roll"><div class="dice-result"><h4 class="dice-total">${tempHP}</h4></div></div></div></div></div></div>`;
	ChatMessage.create({
					        user: game.user._id,
                            speaker: ChatMessage.getSpeaker({token: attack.actor}),
                            content: dmg_html
});
console.log(attack.damageTotal);
console.log(await attacked.actor.data.data.attributes.hp.temp);
if (attack.damageTotal >= await attacked.actor.data.data.attributes.hp.temp) {
turnOff();
}
}
});
}

async function turnOff(){
console.log("shutting down");
await Hooks.off("midi-qol.RollComplete", healthCheck);
ActorUnSetFlag.execute(args[1], "world", "aoa_hookID");
DynamicEffects.applyActive(itemD.name, false, "spell")
}

if (args[0] === "on") {
const hookId = Hooks.on("midi-qol.RollComplete", healthCheck);
ActorSetFlag.execute(args[1], "world", "aoa_hookID", hookId);
ActorUpdate.execute(args[1], {"data.attributes.hp.temp" : tempHP});
}

if (args[0] === "off") {
Hooks.off("midi-qol.RollComplete", healthCheck);
ActorUnSetFlag.execute(args[1], "world", "aoa_hookID");
}