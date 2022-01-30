(async ()=>{
let confirmed = false;
let token_list = await canvas.tokens.placeables;
let targetOptions = "";
for(let i = 0; i < token_list.length; i++) {
let t = token_list[i];
let is_player = await t.actor.hasPlayerOwner === true ? "PC" : "NPC";
 targetOptions +=`<option value="${t.name}">${t.name} (${is_player})</option>`;
}
async function battleBox(){
let the_content = `<h2 style="text-align:center;">Who is Attacking?</h2>
<form>
<div class="form-group">
<label for="attacker">Attacker:</label>
<select id="attacker">${targetOptions}</select>
</div>
<div class="form-group">
<label for="atype">Attack Type</label>
<select id="atype"><option value="mwak">Melee Attack</option>
<option value="rwak">Ranged Attack</option>
<option value="msak">Melee Spell Attack</option><option value="rsak">Ranged Spell Attack</option></select></div>`;
new Dialog({
    title: "Monster Attack Manager",
    content: the_content,
    buttons: {
        roll: { label: "Attack!", callback: () => confirmed = true },
        cancel: { label: "Cancel", callback: () => confirmed = false }
    },
    close: html => {
        if (confirmed){
           (async ()=>{
           let ftoken = html.find('#attacker')[0].value;
           let target = await canvas.tokens.placeables.find(t=>t.name===ftoken);
           let attackType = html.find('#atype')[0].value;
           let target_data = await target.actor.getRollData();
           let get_prof = await target_data.prof;
           let get_spellcasting = await target_data.attr.spellcasting === null ? "int" : target_data.attr.spellcasting;
           let get_spell_stat = get_spellcasting === "str" ? target_data.abil.str.mod : get_spellcasting === "dex" ? target_data.abil.dex.mod : get_spellcasting === "con" ? target_data.abil.con.mod : get_spellcasting === "int" ? target_data.abil.int.mod : get_spellcasting === "wis" ? target_data.abil.wis.mod : get_spellcasting === "cha" ? target_data.abil.cha.mod : "";
           let atkBonus = attackType === "mwak" ? target_data.abil.str.mod : attackType === "rwak" ? target_data.abil.dex.mod : attackType === "msak" ? get_spell_stat : attackType === "rsak" ? get_spell_stat : "";
           let atkType = attackType === "mwak" ? "Melee Attack" : attackType === "rwak" ? "Ranged Attack" : attackType === "msak" ? "Melee Spell Attack" : attackType === "rsak" ? "Ranged Spell Attack" : "";
           let total = 22 + get_prof + atkBonus;
           let the_message = `<strong>${target.name}</strong> has launched a ${atkType}, roll DC (<strong>${total}</strong>) to avoid it!`;
           ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({token: target}),
            content: the_message,
            type: CONST.CHAT_MESSAGE_TYPES.IC
                });    
        })();
        battleBox();
        }
    }
}).render(true);
}
battleBox();
})();