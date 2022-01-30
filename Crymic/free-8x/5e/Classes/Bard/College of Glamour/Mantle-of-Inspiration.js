// Requires a GM macro to update target's HP. https://github.com/kandashi/Macros/blob/master/Callback%20Macros/ActorUpdate.js
// Macro Item macro @target @classes.bard.levels
// If player, it gives temp hp. If npc it heals them for amounted temp hp.
if (args[0] === "on") {
let target = canvas.tokens.get(args[1]);
let classlvl = Math.floor(args[2]/5);
let ActorUpdate = game.macros.getName("ActorUpdate");
let totaltmp = Number(5 + (3*classlvl));
let thp = Math.min(14, totaltmp);
ActorUpdate.execute(args[1],{"data.attributes.hp.temp" : thp});
ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({token: actor}),
        whisper: ChatMessage.getWhisperRecipients(`${target.name}`),
        content: `You gain 8 temporary hit points and may move your character right now.`
});
}