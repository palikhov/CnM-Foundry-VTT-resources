// Midi-qol On Use
(async()=>{
if(args[0].spellLevel > 1){
const actorD = game.actors.get(args[0].actor._id);
const spellLevel = Math.max(5,args[0].spellLevel);
let inputText = "";
if (hasAvailableSlot(actorD)) {
    // Get options for available slots
    for (let i = 1; i <= spellLevel ; i++) {
        let chosenSpellSlots = getSpellSlots(actorD, i);   
        let minSlots = chosenSpellSlots.value;
        let maxSlots = chosenSpellSlots.max;
        if (minSlots != maxSlots){
            inputText += `<div class="form-group"><label for="spell${i}">Spell Slot Level ${i} [${minSlots}/${maxSlots}]</label><input id="spell${i}" name="spellSlot" value="${i}" type="radio"></div>`;
        }
    }
new Dialog({
        title: "Expert Divination",
        content: `<form><p>Choose 1 spell slot to restore</p><hr>${inputText}</form>`,
        buttons: {
            recover: {
                icon: '<i class="fas fa-check"></i>',
                label: "Recover",
                callback: async (html) => {
                let total = html.find('input[type="checkbox"]:checked').length;
                let selected_slot = html.find('input[name="spellSlot"]:checked');
                let slot = "";
                let rank = "";
                for(let i = 0; i < selected_slot.length; i++) {
                slot = selected_slot[i].id;
                rank = selected_slot[i].value;
                }
                spell_refund(actorD, slot, rank);
            }
        }
    }
}).render(true);

} else {
let roll_results = `<div><p style="text-align:center"><b>Expert Divination</b>: No missing spell slots.</p></div>`;
const chatMessage = game.messages.get(args[0].itemCardId);
let content = duplicate(chatMessage.data.content);    
const searchString =  /<div class="midi-qol-bonus-roll">[\s\S]*<div class="end-midi-qol-bonus-roll">/g;
const replaceString = `<div class="midi-qol-bonus-roll"><div class="end-midi-qol-bonus-roll">${roll_results}`;
content = content.replace(searchString, replaceString);
chatMessage.update({content: content});
    }
}

async function spell_refund(actorD, slot, rank) {
    let actor_data = duplicate(actorD._data);
    actor_data.data.spells[`${slot}`].value = actor_data.data.spells[`${slot}`].value + 1;
    await actorD.update(actor_data);
    let roll_results = `<div><p style="text-align:center"><b>Expert Divination</b>: Regained a level ${rank} spell slot.</p></div>`;
    const chatMessage = game.messages.get(args[0].itemCardId);
    let content = duplicate(chatMessage.data.content);
    const searchString =  /<div class="midi-qol-bonus-roll">[\s\S]*<div class="end-midi-qol-bonus-roll">/g;
    const replaceString = `<div class="midi-qol-bonus-roll"><div class="end-midi-qol-bonus-roll">${roll_results}`;
    content = content.replace(searchString, replaceString);
    chatMessage.update({content: content});
}
	
function getSpellSlots(actorD, level) {
    return actorD.data.data.spells[`spell${level}`];
}

function hasAvailableSlot(actorD) {
    for (let slot in actorD.data.data.spells) {
        if (actorD.data.data.spells[slot].value < actorD.data.data.spells[slot].max) {
            return true;
        }
    }
    return false;
}
})();