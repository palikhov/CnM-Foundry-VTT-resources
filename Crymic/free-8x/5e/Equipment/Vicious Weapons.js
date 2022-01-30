//######################################
// Read First!!!!!!!!!!!!!!!!!!!!!!!!!!!
// MidiQOL "on use" macro
// Macro deals additional damage
//######################################

if((args[0].hitTargets.length > 0) && (args[0].isCritical)){
    let target = canvas.tokens.get(args[0].hitTargets[0]._id);
    let actorD = game.actors.get(args[0].actor._id);
    let tokenD = canvas.tokens.get(args[0].tokenId);
    let damageType = args[0].damageDetail[0].type;
    let damageRoll = new Roll('2d6').roll({async:false});
    new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, damageType, [target], damageRoll, {flavor: `Vicious Damage (${damageType})`, damageList: args[0].damageList, itemCardId: args[0].itemCardId});
}
