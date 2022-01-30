//###########################################################################
// READ FIRST!!!!!!!!!!!!!!!!!!!
// Requires Midi-Qol On Use and DAE to be installed.
//##########################################################################
const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const itemD = lastArg.item;
const level = tactor.data.data.details.cr ?? tactor.classes.barbarian.data.data.levels;
const gameRound = game.combat ? game.combat.round : 0;
let the_message = "";
if (tactor.effects.find(i => i.data.label === itemD.name)) {
    let effect = await tactor.effects.find(ef => ef.data.label === itemD.name);
    await MidiQOL.socket().executeAsGM("removeEffects", { actorUuid: tactor.uuid, effects: [effectData] });
    the_message = `<em>${tactor.name}'s Rage wears off.</em>`;
} else {
    let effectData = {
        label: itemD.name,
        icon: itemD.img,
        disabled: false,
        duration: { rounds: 10, seconds: 60, startRound: gameRound, startTime: game.time.worldTime },
        origin: lastArg.uuid,
        changes: [
        { "key": "data.bonuses.mwak.damage", "value": `+${(Math.ceil(Math.floor(level / (9 - (Math.floor(level / 9))) + 2)))}`, "mode": CONST.ACTIVE_EFFECT_MODES.CUSTOM, "priority": 20 },
        { "key": "data.traits.dr.value","value": "slashing","mode": CONST.ACTIVE_EFFECT_MODES.CUSTOM, "priority": 20 },
        { "key": "data.traits.dr.value", "value": "bludgeoning", "mode": CONST.ACTIVE_EFFECT_MODES.CUSTOM, "priority": 20 },
        { "key": "data.traits.dr.value", "value": "piercing", "mode": CONST.ACTIVE_EFFECT_MODES.CUSTOM, "priority": 20 },
        { "key": "flags.midi-qol.advantage.ability.check.str", "value": CONST.ACTIVE_EFFECT_MODES.CUSTOM, "mode": 0, "priority": 30 },
        { "key": "flags.midi-qol.advantage.ability.save.str", "value": CONST.ACTIVE_EFFECT_MODES.CUSTOM, "mode": 0, "priority": 20 }
        ]
    }
    await MidiQOL.socket().executeAsGM("removeEffects", { actorUuid: tactor.uuid, effects: [effectData] });
    the_message = `<em>${tactor.name} starts to Rage!</em>`;
}
let chatMessage = game.messages.get(lastArg.itemCardId);
let content = await duplicate(chatMessage.data.content);
let searchString = /<div class="midi-qol-saves-display">[\s\S]*<div class="end-midi-qol-saves-display">/g;
let replaceString = `<div class="midi-qol-saves-display"><div class="end-midi-qol-saves-display">${the_message}`;
content = content.replace(searchString, replaceString);
await chatMessage.update({ content: content });
await ui.chat.scrollBottom();
