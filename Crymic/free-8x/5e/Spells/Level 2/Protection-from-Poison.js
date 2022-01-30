// requires GM macro Cure_Condition
if (args[0] === "on") {
let target = canvas.tokens.get(args[1])
let effect = target.actor.effects.entries;
for (let i = 0; i < effect.length; i++){
let name = effect[i].data.label.toLowerCase();
if ((name === "poisoned") && (effect[i].isTemporary === `combat-utility-belt.` + name)) {
let element = "Poisoned";
game.macros.getName("Cub_Condition").execute(target.data._id, element, "remove");
ChatMessage.create({
user: game.user._id,
speaker: ChatMessage.getSpeaker({token: actor}),
content: actor.name + " cures " + target.data.name + " of 1 " + element + " Condition."
});	
}
}
}
