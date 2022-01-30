//###########################################
// PLEASE READ FIRST
// Midi-QoL "On Use" Macro.
// Remove damage from item, let the macro deal it.
//###########################################
if(args[0].hitTargets.length > 0){
  let target = canvas.tokens.get(args[0].hitTargets[0]._id);
  let undead = ["undead", "fiend"].some(type => (target.actor.data.data.details.type || "").toLowerCase().includes(type));
  if (undead){
    let damageRoll = new Roll(`2d6`).roll({async:false});
    game.dice3d?.showForRoll(damageRoll);
    new MidiQOL.DamageOnlyWorkflow(actor, token, damageRoll.total, "radiant", [target], damageRoll, {flavor: `(Radiant)`, itemCardId: args[0].itemCardId, useOther: false});
    setFumes(target);
  }
}
