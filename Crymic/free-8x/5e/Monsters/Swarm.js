//######################################
// Read First!!!!!!!!!!!!!!!!!!!!!!!!!!!
// MidiQOL "on use" macro
// Remove damage from item, let the macro do it
//######################################
if(args[0].hitTargets.length > 0){
    let actorD = game.actors.get(args[0].actor);
    let tokenD = canvas.tokens.get(args[0].tokenId);
    let target = canvas.tokens.get(args[0].hitTargets[0]._id);
    let halfHp = tokenD.data.data.attributes.hp.max/2;
    let curtHp = tokenD.data.data.attributes.hp.value;
    let damageRoll;
    curtHp <= halfHp ? damageRoll = new Roll('2d4').roll() : damageRoll = new Roll('4d4').roll();
    new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, "piercing", [target], damageRoll, {flavor: `(Piercing)`, itemCardId: args[0].itemCardId});
}
