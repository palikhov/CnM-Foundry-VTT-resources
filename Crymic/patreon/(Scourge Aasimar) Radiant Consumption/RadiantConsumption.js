(async()=>{
const actorD = await game.actors.get(args[0].actor._id);
const level = Math.ceil(actorD.getRollData().details.level/2);
const myToken = canvas.tokens.get(actorD.getActiveTokens()[0].id);
const itemD = args[0].item;
if (args[0].actor.effects.find(i=> i.label === "Radiant Consumption")) {
let distance = 14.5;
const damageRoll = new Roll(`${level}`).roll();
let get_target = await canvas.tokens.placeables.filter(target => (canvas.grid.measureDistance(myToken.center, target.center) <= distance && myToken.id != target.id));
  for(let target of get_target){
    new MidiQOL.DamageOnlyWorkflow(actor, token, damageRoll.total, "radiant", [target], damageRoll, {flavor: `${itemD.name} - Damage Roll (radiant)`, itemCardId: args[0].itemCardId});
  }
}
if (!args[0].actor.effects.find(i=> i.label === "Radiant Consumption")) {
    let effectData = {
        label : itemD.name,
        icon : itemD.img,
        duration: {seconds: 60, startTime: game.time.worldTime},
        changes: [{
            "key": "data.bonuses.msak.damage",
            "mode": 0,
            "value": `${actorD.getRollData().details.level}[radiant]`,
            "priority": 0
        }, {
            "key": "data.bonuses.mwak.damage",
            "mode": 0,
            "value": `${actorD.getRollData().details.level}[radiant]`,
            "priority": 0
        }, {
            "key": "data.bonuses.rsak.damage",
            "mode": 0,
            "value": `${actorD.getRollData().details.level}[radiant]`,
            "priority": 0
        }, {
            "key": "data.bonuses.rwak.damage",
            "mode": 0,
            "value": `${actorD.getRollData().details.level}[radiant]`,
            "priority": 0
        },{
            "key": "macro.execute",
            "mode": 0,
            "value": `"RadiantConsumption" @actor`,
            "priority": 0
        }]
    };
    if(actorD.data.data.resources.tertiary.value != 1) return ui.notifications.warn(`You are out of the required resources.`);
    await actorD.createEmbeddedEntity("ActiveEffect", effectData);
    await actorD.update({"data.resources.tertiary.value" : null});
}
})();