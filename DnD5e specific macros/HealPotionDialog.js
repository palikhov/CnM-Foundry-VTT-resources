// Macro Author: Freeze#2689 (on discord)
// Macro version: 0.4
// Foundry Version: 0.8+
// DnD5e Version: 1.3+
// Prerequisites: Advanced Macros, midiQOL
//
// Usage: Add this macro for your players, so they can easily choose which potion to use from their inventory
// // //  the macro will find the specified items below.
// v 0.2 update: midiQOL changed how healing works with damageOnlyWorkflow, macro adjusted to reflect this + cosmetic update.
// v 0.3 update: improved the sorting function for the result to be iterable, saving a step.
// v 0.4 update: drink/give potion icon changes to the icon of the potion currently selected.

//////////////////////////////////////////////alterable constants///////////////////////////////////////
const potion1 = "potion of healing";            // change these names to other versions 
const potion2 = "potion of greater healing";    // of healing potions should you have them
const potion3 = "potion of superior healing";   // NOTE: !!! make sure the name is in all lower case!!!
const potion4 = "potion of supreme healing";
////////////////////////////////////////////////////////////////////////////////////////////////////////
// Get Selected
let selected = canvas.tokens.controlled;
if(selected.length == 0 || selected.length > 1){
    ui.notifications.error("You dont have your own token selected")
    return;
}
let selectedActor = selected[0].actor;
// Get Target
let targets = Array.from(game.user.targets)
if (targets.length == 0 || targets.length > 1 ) {
    ui.notifications.error("Please target one token");
    return;
}
let targetActor = targets[0].actor;
//find the different heal potions on the selected to determine the healing options available
let healPotions = selectedActor.items.filter(item =>  item.name.toLowerCase() == potion1 || item.name.toLowerCase() == potion2 || item.name.toLowerCase() == potion3 || item.name.toLowerCase() == potion4);
if (healPotions.length == 0) {
    ui.notifications.error("You have no Potions of Healing");
    return;
}
// sort the potions by value.
let sortedHealPotions = Object.keys(healPotions).sort((a, b) => {
                            return healPotions[a].data.data.price - healPotions[b].data.data.price
                        }).reduce((prev, curr, i) => {
                            prev[i] = healPotions[curr]
                            return prev
                        }, []);
let healOptions = "";
for (let item of sortedHealPotions){
    healOptions += `<option value=${item.id}>${item.data.name} (${item.data.data.quantity}) | Heals:  ${item.data.data.damage.parts[0][0]}</option>`
}
let dialogTemplate = `<style>
                            #heal-potion-dialog .window-content {
                                display: flex;
                                flex-direction: row;
                            }
                            #heal-potion-dialog .dialog-content {
                                padding-top: 12px;
                            }
                            #heal-potion-dialog .dialog-buttons {
                                display: inline;
                                padding-left: 15px;
                            }
                            #heal-potion-dialog .dialog-buttons .applyHealing {
                                border-style: none;
                                background-image: url(systems/dnd5e/icons/items/potions/minor-red.jpg);
                                background-repeat: no-repeat;
                                background-size: 50px 50px;
                                width: 50px;
                                height: 50px;
                            }
                            #heal-potion-dialog .dialog-buttons .close {
                                border-style: none;
                                background-image: url(icons/svg/cancel.svg);
                                background-repeat: no-repeat;
                                background-size: 50px 50px;
                                width: 50px;
                                height: 50px;
                            }
                            #heal-potion-dialog .dialog-buttons button:hover {
                                transform: scale(1.1);
                            }
                            
                     </style>
                     <div><select id="heal-potion-select" name="potion">${healOptions}</select></div>
                     `;
new Dialog({
    title: "Choose your potion:",
    content: dialogTemplate,
    buttons: {
        applyHealing: {
            // here comes the actual healing + rolls + checks if the target actually needs healing!
            callback: async (html) => {
                let potID = html.find("[name=potion]")[0].value;
                let pot = selectedActor.items.get(potID);
                // here we determine if we need to roll for health, what to roll for health and remove the potion if a heal was done.
                let actor_hp = targetActor.data.data.attributes.hp;
                if (actor_hp.value == actor_hp.max) {
                    ui.notifications.warn(`${targetActor.data.name} is at maximum HP`); 
                    return; 
                }
                let quantity = pot.data.data.quantity;
                await pot.update({"data.quantity": quantity - 1});
                quantity = pot.data.data.quantity;
                if (quantity < 1) {
                    pot.delete();
                }
                let healRoll = new Roll(pot.data.data.damage.parts[0][0]);
                await healRoll.evaluate({async: true});
                let heal = healRoll.total;
                new MidiQOL.DamageOnlyWorkflow(actor, token, heal, "healing", [targets[0]], healRoll, {flavor: 
                                                        `<div class="dnd5e chat-card item-card midi-qol-item-card">
                                                        <header class="card-header flexrow">
                                                            <img src="${pot.data.img}" title="${pot.data.name}" width="36" height="36" />
                                                            <h3 class="item-name">${pot.data.name}:</h3>
                                                        </header>
                                                        <p>${targetActor.data.name} was given a <b><i>${pot.data.name}</i></b> by ${selectedActor.data.name}</p>`});
            }
        },
        close:{
        }
    },
},
{
    id: "heal-potion-dialog",
    width: 420
}).render(true);
await new Promise(resolve => {setTimeout(resolve, 75);});
$(document).ready(function() {
    const item = actor.items.get($("#heal-potion-select").val());
    const itemImg = item.data.img;
    $("#heal-potion-dialog .dialog-buttons .applyHealing").css({"background-image": `url(${itemImg})`});
    $("#heal-potion-select").change(function () {
        const item = selectedActor.items.get(this.value);
        const itemImg = item.data.img;
        $("#heal-potion-dialog .dialog-buttons .applyHealing").css({"background-image": `url(${itemImg})`});
    });
});
