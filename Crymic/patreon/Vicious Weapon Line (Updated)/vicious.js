// Midi-Qol on use, let the macro deal additional damage.
if (args[0].isCritical) {
  let tokenD = canvas.tokens.get(args[0].tokenId);
  let actorD = game.actors.get(args[0].actor._id);
  let target = canvas.tokens.get(args[0].hitTargets[0].id);
  let itemD = args[0].item;
  let damageType = args[0].damageDetail[0].type;
  let damageRoll = new Roll(itemD.data.formula).evaluate({ async: false });
  new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, damageType, [target], damageRoll, { flavor: `(Vicious Critical (${CONFIG.DND5E.damageTypes[damageType]}))`, damageList: args[0].damageList, itemCardId: args[0].itemCardId });
}