// Inspired off Kekilla's Trap macro
// args[0] = DC 
// args[1] = Type
// args[2] = ID
// in Trigger Happy @Token[Name_of_Trap] @Trigger[capture move] @ChatMessage[/DetectTrap DCnum "Door, Item or Trap" "TRAP ID or Wall ID"]
(async ()=>{
let passTest = await actor.data.data.skills.prc.passive;
let skillTest = await actor.rollSkill('prc', {fastForward:true, chatMessage: false});
let skillMax = Math.max(passTest, skillTest.total);
console.log(`Perception Score of ${skillMax} vs ${args[0]}`);
if ((skillMax) >= args[0]){
    if (args[1] === "Door"){
      if(canvas.walls.get(args[2]).data.door === 2){
       canvas.walls.get(args[2]).update({"door" : 1});
       let sent_message = `You have spotted a hidden door!`;
       let chatData = {
                user: game.user._id,
                content: sent_message,
                whisper : ChatMessage.getWhisperRecipients(actor.name),
                speaker: ChatMessage.getSpeaker({alias: "Door"})
            };
            ChatMessage.create(chatData, {});
        }
    }
    if (args[1] === "Trap"){
     if(canvas.tokens.get(args[2]).data.hidden){
        canvas.tokens.get(args[2]).update({"hidden": false});
        let sent_message = `You have spotted a trap!`;
       let chatData = {
                user: game.user._id,
                content: sent_message,
                whisper : ChatMessage.getWhisperRecipients(actor.name),
                speaker: ChatMessage.getSpeaker({alias: "Trap"})
            };
            ChatMessage.create(chatData, {});
        }
    }
    if (args[1] === "Item"){
     if(canvas.tokens.get(args[2]).data.hidden){
        canvas.tokens.get(args[2]).update({"hidden": false});
        let sent_message = `You have spotted something!`;
       let chatData = {
                user: game.user._id,
                content: sent_message,
                whisper : ChatMessage.getWhisperRecipients(actor.name),
                speaker: ChatMessage.getSpeaker({token: actor})
            };
            ChatMessage.create(chatData, {});
        }
    }
}
})();
