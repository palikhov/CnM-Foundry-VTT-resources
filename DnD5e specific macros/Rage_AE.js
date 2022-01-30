if(!token) return;
const rageResourceName = "Rage - Charges";
const effectLabel = "Rage";
let hasAvailableResource = token.actor.type === "npc" ? true : false;
const level = token.actor.type === "npc" ? actor.data.data.details.cr : actor.items.find(i=> i.name === "Barbarian" && i.type === "class").data.data.levels;
const gameRound = game.combat ? game.combat.round : 0;
let message = "";
const effect = token.actor.effects.find(e => e.data.label === effectLabel);

if (effect) {
    let rageId = effect.id;
    await token.actor.deleteEmbeddedDocuments("ActiveEffect", [rageId]);
    message = `<i>${actor.name} is no longer raging.</i>`;
} 
else {
    let resourceKey = "";
    if(actor.data.type === "character"){
        resourceKey = Object.keys(token.actor.data.data.resources).find(k => token.actor.data.data.resources[k].label === `${rageResourceName}`);
        if (resourceKey && token.actor.data.data.resources[resourceKey].value > 0) hasAvailableResource = true;
        if(!hasAvailableResource) return ui.notifications.warn("You are out of charges to Rage.");
    }
    const effectData = {
        label : effectLabel,
        icon : "systems/dnd5e/icons/skills/affliction_24.jpg",
        changes: [{
            "key": "data.bonuses.mwak.damage",        
            "value": `+${(Math.ceil(Math.floor(level/(9-(Math.floor(level/9)))+2)))}`,
            "mode": 2,
            "priority": 20
            },{
            "key": "data.traits.dr.value",
            "value": "slashing",
            "mode": 2,
            "priority": 20
            },{
            "key": "data.traits.dr.value",
            "value": "bludgeoning",
            "mode": 2,
            "priority": 20
            },{
            "key": "data.traits.dr.value",
            "value": "piercing",
            "mode": 2,
            "priority": 20
            }
        ],
        disabled: false,
        duration: {rounds: (level > 14 ? 1000 : 10), seconds: (level > 14 ? 6000 : 60),startRound: gameRound, startTime: game.time.worldTime},
    };
    await token.actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
    message = `<em>${actor.name} is RAAAAAAAGING</em>`;
    if(actor.data.type === "character"){
        let newResources = duplicate(actor.data.data.resources);
        newResources[resourceKey].value--;
        await actor.update({"data.resources": newResources});
    }
    
}
ChatMessage.create({
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({actor}),
    content: message,
    type: CONST.CHAT_MESSAGE_TYPES.EMOTE,
});
