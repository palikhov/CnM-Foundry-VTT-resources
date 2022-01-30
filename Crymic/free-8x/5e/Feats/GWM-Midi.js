//#####################################
// READ THIS
// Requires Midi-QoL on use
//####################################
const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const itemD = lastArg.item;
const gameRound = game.combat ? game.combat.round : 0;
let the_message = "";
if (tactor.effects.find(i => i.data.label === itemD.name)) {
    let effect = await tactor.effects.find(ef => ef.data.label === itemD.name);
    await MidiQOL.socket().executeAsGM("removeEffects", { actorUuid: tactor.uuid, effects: [effect.id] });    
    the_message = `<em>${tactor.name} is swinging <strong>Normally</strong> now.</em>`;
} else {
    let effectData = [{
        label: itemD.name,
        icon: itemD.img,
        duration: { rounds: 1, seconds: 6, startRound: gameRound, startTime: game.time.worldTime },
        origin: lastArg.uuid,
        changes: [
         {"key": "data.bonuses.mwak.damage", "mode": CONST.ACTIVE_EFFECT_MODES.CUSTOM, "value": 10, "priority": 20},
         {"key": "data.bonuses.mwak.attack", "mode": CONST.ACTIVE_EFFECT_MODES.CUSTOM, "value": "-5", "priority": 20}
         ]
    }];
    await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: tactor.uuid, effects: effectData });    
    the_message = `<em>${tactor.name} is swinging <strong>Harder</strong> now!</em>`;
}
let chatMessage = game.messages.get(lastArg.itemCardId);
let content = await duplicate(chatMessage.data.content);
let searchString = /<div class="midi-qol-saves-display">[\s\S]*<div class="end-midi-qol-saves-display">/g;
let replaceString = `<div class="midi-qol-saves-display"><div class="end-midi-qol-saves-display">${the_message}`;
content = content.replace(searchString, replaceString);
await chatMessage.update({ content: content });
await ui.chat.scrollBottom();
