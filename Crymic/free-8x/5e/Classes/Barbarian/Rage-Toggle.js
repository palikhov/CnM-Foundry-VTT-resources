//###########################################################################
// READ FIRST!!!!!!!!!!!!!!!!!!!
// Hotbar macro for toggling on and off using Active Effects
// Some parts of this macro require Midi-qol and DAE for full effect.
//##########################################################################
let actorD = game.user.character ?? canvas.tokens.controlled[0].actor;
let level = actorD.data.data.details.cr ?? actorD.classes.barbarian.data.data.levels;
let gameRound = game.combat ? game.combat.round : 0;
let itemD = actorD.items.getName("Rage");
let the_message = "";
if (actorD.effects.find(i => i.data.label === "Rage")) {
    let rage_id = await actorD.effects.find(i => i.data.label === "Rage").id;
    await actorD.deleteEmbeddedDocuments("ActiveEffect", [rage_id]);
    the_message = `<em>${actorD.name}'s Rage wears off.</em>`;
} else {
    let effectData = {
        label: itemD.name,
        icon: itemD.img,
        disabled: false,
        duration: { rounds: 10, seconds: 60, startRound: gameRound, startTime: game.time.worldTime },
        origin: itemD.uuid,
        changes: [
            { "key": "data.bonuses.mwak.damage", "value": `+${(Math.ceil(Math.floor(level / (9 - (Math.floor(level / 9))) + 2)))}`, "mode": CONST.ACTIVE_EFFECT_MODES.CUSTOM, "priority": 20 },
            { "key": "data.traits.dr.value", "value": "slashing", "mode": CONST.ACTIVE_EFFECT_MODES.CUSTOM, "priority": 20 },
            { "key": "data.traits.dr.value", "value": "bludgeoning", "mode": CONST.ACTIVE_EFFECT_MODES.CUSTOM, "priority": 20 },
            { "key": "data.traits.dr.value", "value": "piercing", "mode": CONST.ACTIVE_EFFECT_MODES.CUSTOM, "priority": 20 }
        ]
    }
    await actorD.createEmbeddedDocuments("ActiveEffect", [effectData]);
    the_message = `<em>${actor.name} starts to Rage!</em>`;
}
ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker({ actor: actorD }),
    content: the_message,
    type: CONST.CHAT_MESSAGE_TYPES.EMOTE
});
