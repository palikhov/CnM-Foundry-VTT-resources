// This macro just simply tells the person they're inpsired. in DAE @target @classes.bard.level
if (args[0] === "on") {
let target = canvas.tokens.get(args[1]);
let classlvl = (args[2])/5;
let dieBonus = 5 + Math.ceil(classlvl+2*0.5) + classlvl;
let bonusDie = Math.min(12, dieBonus);
ChatMessage.create({
 user: game.user._id,
 speaker: ChatMessage.getSpeaker(),
  content: `For the next 10 minutes, you have a bonus 1d${bonusDie} to use towards an ability check, attack roll, or saving throw.`,
  whisper: ChatMessage.getWhisperRecipients(`${target.name}`),
});
}
