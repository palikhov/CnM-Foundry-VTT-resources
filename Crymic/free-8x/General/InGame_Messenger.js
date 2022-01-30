(async()=>{
let tokenOptions = "";
let gmOptions = "";
let offLine = "";
let players_list = await game.users.entities;
for(let i = 0; i < players_list.length; i++) {
let t = await players_list[i];
let offLine = t.active != true  ? "opacity:0.5;" : "opacity:1;";
if((!game.user.isGM) && (t.character != null) && (t.character.name != game.user.character.name)) {
     tokenOptions +=`<div id="character" style="display:inline-block;margin:2px;padding:4px"><input type="checkbox" id="${t.character.name}" name="sendTo" value="${t.character.name}" hidden><label for="${t.character.name}" style="width:35px;height:35px;display:block;"><img style="${offLine}" src="${t.character.img}"></label></div>`;
}
if((game.user.isGM) && (t.character != null)) {
     tokenOptions +=`<div id="character" style="display:inline-block;margin:2px;padding:4px"><input type="checkbox" id="${t.character.name}" name="sendTo" value="${t.character.name}" hidden><label for="${t.character.name}" style="width:35px;height:35px;display:block;"><img style="${offLine}" src="${t.character.img}"></label></div>`;
}
}
$(document).ready(function(){
$('.chatBox #character input[type="checkbox"]').click(function(){
            if($(this).prop("checked") == true){
            $(this).parent().css({"background-color": "orange"});
            }
            else if($(this).prop("checked") == false){
            $(this).parent().css({"background-color": "transparent"});
            }
});
});
if(!game.user.isGM){
   gmOptions = `<div id="character" style="display:inline-block;margin:2px;padding:4px"><input type="checkbox" id="${game.user.getUsers(3)[0].name}" name="sendTo" value="${game.user.getUsers(3)[0].name}" hidden><label for="${game.user.getUsers(3)[0].name}" style="width:35px;height:35px;display:block;"><img  src="${game.user.getUsers(3)[0].avatar}"></label></div>`;
}

let the_content = `<p>Select players to message.</p><form class="chatBox">${tokenOptions}${gmOptions}<hr><textarea id="theMessage" rows="5" cols"50" placeholder="Enter your message here"></textarea></form>`;
new Dialog({
    title: `InGame Messenger`,
    content: the_content,
    buttons: {
        message: {
            icon : `<i class="far fa-comments"></i>`,
            label: "Send",
            callback : async (html) => {
            let selected_list = html.find('[name=sendTo]');
            for(let i = 0; i < selected_list.length; i++) {
            let selected_player = await selected_list[i].id;
            let selected_check = await selected_list[i].checked;
            let get_message = html.find('#theMessage')[0].value;
            let sent_message = `<div><h4 style="background-color:blue;padding:5px 2px;color:#fff;border-top:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;margin-bottom:0;">Whispered Message</h4><div style="border:1px solid #000;background-color:#fff;padding:4px;">${get_message}</div></div>`;
            let msg_target = "";
            if (selected_player && selected_check){
            console.log(msg_target);
            let chatData = {
                user: game.user._id,
                content: sent_message,
                whisper : ChatMessage.getWhisperRecipients(selected_player),
                speaker: ChatMessage.getSpeaker({token: actor})
               
            };
            ChatMessage.create(chatData, {});
            }}
        }
    }
    }
}).render(true);
})();
