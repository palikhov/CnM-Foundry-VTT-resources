// Execute as GM
// args[0] = DC 
// args[1] = Type
// args[2] = ID
(async ()=>{
let target = token.actor;
let passTest = await target.data.data.skills.prc.passive;
let skillTest = await target.rollSkill('prc', {fastForward:true, chatMessage: false});
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
    let get_trap = canvas.tokens.placeables.find(t=>t.name === args[2]);
     if(get_trap.data.hidden){
        get_trap.update({"hidden": !get_trap.data.hidden});
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
}
})();