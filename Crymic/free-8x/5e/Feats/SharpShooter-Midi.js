//#####################################
// READ THIS
// Requires Midi-QoL on use
//####################################
const target = canvas.tokens.get(args[0].tokenId).actor;
const itemD = args[0].item;
const gameRound = game.combat ? game.combat.round : 0;
let the_message = "";
if (target.effects.find(i => i.data.label === itemD.name)) {
    let effect = await target.effects.find(ef => ef.data.label === itemD.name);
    await MidiQOL.socket().executeAsGM("removeEffects", { actorUuid: target.uuid, effects: [effect.id] });    
    the_message = `<em>${target.name} is aiming <strong>Normally</strong> now.</em>`;
} else {
    let effectData = [{
        label: itemD.name,
        icon: itemD.img,
        duration: { rounds: 1, seconds: 6, startRound: gameRound, startTime: game.time.worldTime },
        origin: args[0].uuid,
        changes: [{
            "key": "data.bonuses.rwak.damage",
            "mode": 2,
            "value": 10,
            "priority": 20
        }, {
            "key": "data.bonuses.rwak.attack",
            "mode": 2,
            "value": "-5",
            "priority": 20
        }]
    }];
    await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: target.uuid, effects: effectData });    
    the_message = `<em>${target.name} is aiming <strong>Carefully</strong> now!</em>`;
}
let chatMessage = game.messages.get(args[0].itemCardId);
let content = await duplicate(chatMessage.data.content);
let searchString = /<div class="midi-qol-saves-display">[\s\S]*<div class="end-midi-qol-saves-display">/g;
let replaceString = `<div class="midi-qol-saves-display"><div class="end-midi-qol-saves-display">${the_message}`;
content = content.replace(searchString, replaceString);
await chatMessage.update({ content: content });
await ui.chat.scrollBottom();
