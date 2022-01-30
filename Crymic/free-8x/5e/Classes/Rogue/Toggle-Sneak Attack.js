// This macro is straight active effects toggle
const tokenD = canvas.tokens.get(args[0].tokenId);
const itemD = args[0].item;
const gameRound = game.combat ? game.combat.round : 0;
let level = tokenD.actor.data.type === "character" ? tokenD.actor.items.find(i => i.name === "Rogue").data.data.levels : tokenD.actor.data.data.details.level;
let the_message = "";
if (tokenD.actor.effects.find(ef => ef.data.label === itemD.name)) {
    let effect = await tokenD.actor.effects.find(ef => ef.data.label === itemD.name);
    await tokenD.actor.deleteEmbeddedDocuments("ActiveEffect", [effect.id]);
    the_message = `<em>${tokenD.name} is no longer <b>sneak attacking</b>.</em>`;
} else {
    let effectData = [{
        label: itemD.name,
        icon: itemD.img,
        duration: { rounds: 10, seconds: 60, startRound: gameRound, startTime: game.time.worldTime },
        flags: { dae: { itemData: itemD, macroRepeat: "none", specialDuration: ["DamageDealt"] } },
        origin: args[0].uuid,
        changes: [{
            "key": "data.bonuses.All-Damage",
            "mode": 0,
            "value": `${(Math.ceil(level / 2))}d6`,
            "priority": 0
        }]
    }];
    await tokenD.actor.createEmbeddedDocuments("ActiveEffect", effectData);
    the_message = `<em>${tokenD.name} is ready to <b>sneak attack</b>.</em>`;
}
let chatMessage = game.messages.get(args[0].itemCardId);
let content = await duplicate(chatMessage.data.content);
let searchString = /<div class="midi-qol-other-roll">[\s\S]*<div class="end-midi-qol-other-roll">/g;
let replaceString = `<div class="midi-qol-other-roll"><div class="end-midi-qol-other-roll">${the_message}`;
content = content.replace(searchString, replaceString);
await chatMessage.update({ content: content });
await ui.chat.scrollBottom();
