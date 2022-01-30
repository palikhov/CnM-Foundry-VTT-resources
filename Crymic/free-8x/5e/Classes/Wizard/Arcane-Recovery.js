//#####
// Midi-Qol on use only
// still needs some work to prevent over return.
//#####
(async()=>{
let actorD = game.actors.get(args[0].actor._id);
let level = await actorD.getRollData().classes.wizard.levels;
let numRec = Math.ceil(level/2);
if (hasAvailableSlot(actorD)) {

    // Get options for available slots
    let inputText = "";
    for (let i = 1; i <= 5; i++) {
        let chosenSpellSlots = getSpellSlots(actor, i);        
        let minSlots = Math.abs(chosenSpellSlots.value - chosenSpellSlots.max);
        let maxSlots = minSlots >= numRec ? numRec : minSlots;
        if (chosenSpellSlots.max > 0 && chosenSpellSlots.value < chosenSpellSlots.max ) {
            inputText += `<div class="form-group"><label for="spell${i}">Spell Slot Level ${i} [${chosenSpellSlots.value}/${chosenSpellSlots.max}]</label><input id="spell${i}" name="spell${i}" type="number" min="0" max="${maxSlots}"></div>`;
        }
    }
new Dialog({
        title: "Arcane Recovery",
        content: `
        <form>
        <p>You have regained <strong>${numRec}</strong> spell slots.</p>
                ${inputText}                   
        </form>
        `,
        buttons: {
            recover: {
                icon: '<i class="fas fa-check"></i>',
                label: "Recover",
                callback: async (html) => {
                    for (let i = 1; i <= 5; i++) {
			let numRes = html.find(`#spell${i}`).val();
            spell_refund(actorD, i, numRes);               
              }
            }
        }}
    }).render(true);

} else {
    return ui.notifications.warn(`You aren't missing any spell slots.`);    
}


function spell_refund(actorD, i, numRes) {
  let actor_data = duplicate(actorD.data._source);
  actor_data.data.spells[`spell${i}`].value = Number(actor_data.data.spells[`spell${i}`].value) + Number(numRes);
  actorD.update(actor_data);
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
