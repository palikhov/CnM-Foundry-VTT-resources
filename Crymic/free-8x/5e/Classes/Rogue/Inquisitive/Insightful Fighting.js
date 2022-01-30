// Requires GM macro Cub_Condition.
// in Cub add a condition called "Deception". in DAE, use Item macro with @target @item
let Cub_Condition = game.macros.getName("Cub_Condition");
let target = canvas.tokens.get(args[1])
let itemD = args[2];

if (args[0] === "on") {
    let sneak = actor.items.find(i => i.name==="Sneak Attack");
    let me_roll = game.cub.hasCondition("Deception", target) ? await actor.rollSkill('ins', {disadvantage: true, chatMessage : false, fastForward: true }) : await actor.rollSkill('ins', {chatMessage : false, fastForward: true });
    let target_roll = await target.actor.rollSkill('dec', {chatMessage : false, fastForward: true });    
    if (me_roll.total > target_roll.total) {
        let result_html = `<p><em>${actor.name} catches ${target.name} off guard.</em> ${me_roll.total} vs ${target_roll.total} skill check</p>`;
        ChatMessage.create({
                            user: game.user._id,
                            speaker: ChatMessage.getSpeaker({token: actor}),
                            content: result_html
    });

        sneak.roll();
    }
    else {
    Cub_Condition.execute(args[1], "Deception", "add");
    let result_html = `<p><em>${actor.name} fails to find ${target.name}s weakness spot.</em> ${target_roll.total} vs ${me_roll.total} skill check</p>`;
        ChatMessage.create({
                            user: game.user._id,
                            speaker: ChatMessage.getSpeaker({token: actor}),
                              content: result_html
    });
    return ui.notifications.warn(`Any futher attempts to ${itemD.name} on ${target.name} will be at a <strong>Disadvantage</strong>`);
    }
}