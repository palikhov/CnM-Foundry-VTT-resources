//###########################################################################################
// Read First!!!!!!!!!!!!!!!!!!!!!!!!!!!
// MidiQOL "on use" macro
// Macro deals extra damage
//###########################################################################################
if((args[0].hitTargets.length > 0) && (args[0].isCritical)){
    let actorD = game.actors.get(args[0].actor._id);
    let tokenD = canvas.token.get(args[0].tokenD);
    let target = canvas.tokens.get(args[0].hitTargets[0]._id);
    let giant = ["giant"].some(type => (target.actor.data.data.details.type || "").toLowerCase().includes(type));
    if (giant) {
        let damageRoll = new Roll("2d6").roll({async:false});
        let damageType = args[0].damageDetail[0].type;
        new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, damageType, [target], damageRoll, {flavor: `Giant Slayer (${damageType})`, damageList: args[0].damageList, itemCardId: args[0].itemCardId});
    }
}
