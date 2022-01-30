// DAE macro to infest, macro deals the damage till death @target @actor
if (args[0] === "on") {
    let token = canvas.tokens.get(args[1]);
    let numGrub = new Roll('1d4').roll();
    token.toggleEffect("systems/dnd5e/icons/skills/affliction_13.jpg", {active:true});
    token.actor.setFlag("world", "rotGrub", numGrub.total);
} else if (args[0] === "each") {
    const lastArg = args[args.length-1];
    let tactor;
    if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
    else tactor = game.actors.get(lastArg.actorId);
    let token = canvas.tokens.get(lastArg.tokenId);
    let item = lastArg.efData.flags.dae.itemData;
    let numGrub = token.getFlag("world", "rotGrub");
    let damageRoll = new Roll(`${numGrub}d6`).roll();
    let the_message = `<div class="dnd5e chat-card item-card midi-qol-item-card" data-actor-id="${tactor.id}" data-item-id="${item.id}"><header class="card-header flexrow"><img src="${item.img}" title="${item.name}" width="36" height="36"><h3 class="item-name">Rot Grub Infestation</h3></header><div class="card-content" style="display: none;">${item.data.description.value}</div></div>`;
    new MidiQOL.DamageOnlyWorkflow(actor, token, damageRoll.total, "piercing", [token], damageRoll, {flavor: the_message, speaker: ChatMessage.getSpeaker({actor: args[2]})});
    if(tactor.getRollData().attributes.hp.value === 0){
        tactor.deleteEmbeddedEntity("ActiveEffect", lastArg.effectId);
        token.actor.unsetFlag("world", "rotGrub");
        token.toggleEffect("systems/dnd5e/icons/skills/affliction_13.jpg", {active:false});
    }
}
if(args[0]==="off"){
    let token = canvas.tokens.get(args[1]);
    token.toggleEffect("systems/dnd5e/icons/skills/affliction_13.jpg", {active:false});
    token.actor.unsetFlag("world", "rotGrub");
}
