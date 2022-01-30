// Midi-qol on use.
// Create a feature called Nourishing Fire. This will auto grab the card details and spit them out when done.
if(args[0].damageTotal > 0){
let actorD = game.actors.get(args[0].actor._id);
let target = canvas.tokens.get(args[0].tokenId);
let level = Number(args[0].spellLevel);
let getItem = actorD.items.getName("Nourishing Fire");
let damageRoll = new Roll(`@abilities.cha.mod + ${level}`, actorD.getRollData()).roll();
new MidiQOL.DamageOnlyWorkflow(actorD, target, damageRoll.total, "healing", [target], damageRoll, {flavor: `(Healing)`, itemData: getItem, itemCardId: "new"});
}