(async ()=>{
let confirmed = false;
let tokenOptions = "";
let token_list = canvas.tokens.placeables;
for(let i = 0; i < token_list.length; i++) {
let t = token_list[i];
 tokenOptions +=`<option value="${t.name}">${t.name}</option>`;
}
let the_content = `<form><p>Hit Points Updater</p><div class="form-group"><label for="token_name">Target</label><select id="token_name">${tokenOptions}</select></div><div class="form-group"><label for="damageDealt">Damage</label><input type="text" id="damageDealt"></div><div class="form-group"><label for="damage_type">Damage Type</label><select id="damage_type"><option value="Acid">Acid</option><option value="Blundgeoning">Blundgeoning</option><option value="Cold">Cold</option><option value="Fire">Fire</option><option value="Force">Force</option><option value="Lightning">Lightning</option><option value="Necrotic">Necrotic</option><option value="Piercing">Piercing</option><option value="Poison">Poison</option><option value="Psychic">Psychic</option><option value="Radiant">Radiant</option><option value="Slashing">Slashing</option><option value="Thunder">Thunder</option><option value="Healing">Healing</option>
</select></div></form>`;
new Dialog({
    title: "Damage Dealer",
    content: the_content,
    buttons: {
        roll: { label: "Deal it", callback: () => confirmed = true },
        cancel: { label: "Cancel", callback: () => confirmed = false }
    },
    close: html => {
        if (confirmed){
           let ntoken = html.find('#token_name')[0].value;
           let damageType = html.find('#damage_type')[0].value;
           let ftoken = canvas.tokens.placeables.find(t=>t.name===ntoken);
           let damageTotal = parseInt(html.find('#damageDealt')[0].value);
           let curtHp = ftoken.actor.data.data.attributes.hp.value;
           let set_message = "";
           if (damageType != "Healing"){
           ftoken.actor.update({"data.attributes.hp.value" : curtHp - damageTotal });
           set_message = `${ftoken.name} has taken ${damageTotal} points of ${damageType}.`;
           }
           else {
            ftoken.actor.update({"data.attributes.hp.value" : curtHp + damageTotal });
            set_message = `${ftoken.name} has regained ${damageTotal} hit points.`;
           }                     
        ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({token: ftoken}),
            content: set_message,
            type: CONST.CHAT_MESSAGE_TYPES.IC
                });    
        }
    }
}).render(true);
})();