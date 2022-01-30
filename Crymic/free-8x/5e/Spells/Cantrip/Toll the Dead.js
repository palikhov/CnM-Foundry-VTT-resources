//Midi-qol on use. Remove damage on item card. Let the macro handle it.
const lastArg = args[args.length - 1];
if (lastArg.failedSaves.length === 0) return {}
let target = canvas.tokens.get(lastArg.failedSaves[0].id);
let actorD = game.actors.get(lastArg.actor._id);
let tokenD = canvas.tokens.get(lastArg.tokenId);
let level = actorD.data.type === "character" ? actorD.data.data.details.level : tokenD.actor.data.data.details.cr;
let numDice = 1 + (Math.floor((level + 1) / 6));
let damageType = "necrotic";
let damageRoll = target.actor.data.data.attributes.hp.max != target.actor.data.data.attributes.hp.value ? new Roll(`${numDice}d12`).evaluate({ async: false }) : new Roll(`${numDice}d8`).evaluate({ async: false });
game.dice3d?.showForRoll(damageRoll);
new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, damageType, [target], damageRoll, { flavor: `(${CONFIG.DND5E.damageTypes[damageType]})`, itemCardId: lastArg.itemCardId });
