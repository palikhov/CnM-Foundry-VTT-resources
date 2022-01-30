// Execute as GM
(async()=>{
let DC = args[0];
let skillTest = args[1];
let skillName;
let tactor = game.actors.entities.find(a => a.name === args[2]);
let trapToken = canvas.tokens.placeables.find(t=>t.name === args[4]);
let item = tactor.items.find(i=>  i.name === args[3]);
let the_message;
let tools = token.actor.items.find(i=> i.name === "Thieves’ Tools");
let skillRoll;
if(tools) {
    skillRoll = await tools.rollToolCheck({fastForward: true});
    skillName = tools.name;
} else {
    skillRoll = await token.actor.rollSkill(skillTest, {fastForward: True});
    skillName = await CONFIG.DND5E.skills[skillTest];
}
game.dice3d?.showForRoll(skillRoll);
if(skillRoll.total >= DC){    
    the_message = `${token.name} successfully disarmed the ${item.name} trap.`;
    await trapToken.delete();
} else {
let oldTargets = game.user.targets;
game.user.targets = new Set().add(token);
new MidiQOL.TrapWorkflow(tactor, item, [token], trapToken.center);
the_message = `${token.name} failed in disarmed the ${item.name} trap. You hear strange sounds in the distance.`;
}
ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({alias: `${skillName} Skill Check`}),
        content: the_message,
});
})();