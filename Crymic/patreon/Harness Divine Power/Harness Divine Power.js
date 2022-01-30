// Use Midi-qol + Item Macro. That will trigger resouce consumption.
(async()=>{
    let actorD = canvas.tokens.get(args[0].tokenId).actor;
    if(actorD.data.data.spells.spell1.max === 0) return ui.notifications.error(`No spell slots found on ${actorD.name}`);
    let itemD = args[0].item;
    let rollData = await actorD.getRollData();
    let prof = Math.ceil(rollData.prof/2);
    let inputText = "";
    if (hasAvailableSlot(actor)) {
        // Get options for available slots
        for (let i = 1; i <= prof; i++) {
            let chosenSpellSlots = getSpellSlots(actorD, i);
            let minSlots = chosenSpellSlots.value;
            let maxSlots = chosenSpellSlots.max;
            if (minSlots != maxSlots){
                inputText += `<div class="form-group"><label for="spell${i}">Spell Slot Level ${i} [${minSlots}/${maxSlots}]</label><input id="spell${i}" name="spellSlot" value="${i}" type="radio"></div>`;
            }
        }
        new Dialog({
            title: itemD.name,
            content: `<form><p>Choose 1 spell slot to restore</p><hr>${inputText}</form>`,
            buttons: {
                recover: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "Recover",
                    callback: async (html) => {
                        let selected_slot = html.find('input[name="spellSlot"]:checked');
                        let slot = "";
                        let num = "";
                        for(let i = 0; i < selected_slot.length; i++) {
                            slot = selected_slot[i].id;
                            num = selected_slot[i].value;
                        }
                        spell_refund(actorD, slot);
                        let roll_results = `<div>Regains 1 spell slot, Level ${num}.</div>`;
                        const chatMessage = game.messages.get(args[0].itemCardId);
                        let content = duplicate(chatMessage.data.content);
                        const searchString =  /<div class="midi-qol-saves-display">[\s\S]*<div class="end-midi-qol-saves-display">/g;
                        const replaceString = `<div class="midi-qol-saves-display"><div class="end-midi-qol-saves-display">${roll_results}`;
                        content = content.replace(searchString, replaceString);
                        chatMessage.update({content: content});
                    }
                }
            }
        }).render(true);
    } else {
        return ui.notifications.warn(`You aren't missing any spell slots.`);    
    }
    
    async function spell_refund(actorD, slot, num) {
      let actor_data = duplicate(actorD.data._source);
      actor_data.data.spells[`${slot}`].value = actor_data.data.spells[`${slot}`].value + 1;
      await actorD.update(actor_data);
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