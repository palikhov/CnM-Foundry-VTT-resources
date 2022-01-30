(async ()=>{
let confirmed = false;
let tokenOptions = "";
let token_list = canvas.tokens.placeables;
for(let i = 0; i < token_list.length; i++) {
let t = token_list[i];
 if (!t.actor.hasPlayerOwner){
 tokenOptions +=`<option value="${t.name}">${t.name}</option>`;
 }
}
let the_content = `<form><p>Pick an NPC to talk</p><div class="form-group"><select id="token_name">${tokenOptions}</select></div><div class="form-group"><textarea id="token_say" rows="5" cols="33" placeholder="Enter what they are saying"></textarea></div><div class="form-group"><select id="token_method"><option value="ic">In Character</option><option value="emote">Emote</option><option value="ooc">Out of Character</option></select>
</div></form>`;
let value = await new Promise((resolve)=>{
new Dialog({
    title: "List of Tokens",
    content: the_content,
    buttons: {
        roll: { label: "Say it!", callback: () => confirmed = true },
        cancel: { label: "Cancel", callback: () => confirmed = false }
    },
    close: html => {
        if (confirmed){
           let ftoken = html.find('#token_name')[0].value;
           let stoken = canvas.tokens.placeables.find(t=>t.name===ftoken);
           let token_message = html.find('#token_say')[0].value;
           let get_chat_type = html.find('#token_method')[0].value;
           let chat_type = get_chat_type === "ic" ? CONST.CHAT_MESSAGE_TYPES.IC : get_chat_type === "emote" ? CONST.CHAT_MESSAGE_TYPES.EMOTE : get_chat_type === "ooc" ? CONST.CHAT_MESSAGE_TYPES.OOC : "";
        ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({token: stoken}),
            content: token_message,
            type: chat_type
                }, {chatBubble : true });    
        }
    }
}).render(true);
});
return value;
})();