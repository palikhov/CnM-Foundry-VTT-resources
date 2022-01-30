// Macro Author: Freeze (on discord)
// Macro version: 0.1
// Foundry Version: 0.7+
// DnD5e Version: 1.1.1
// Prerequisits: Dynamic Active Effects SRD module, the Furnace
// Usage: Make an active effect on the Absorb Elements spell (source: free Elemental Evil players companion.pdf), Macro Execute CUSTOM DAE-AbsorbElements
///////// Usage of this spell assumes the game is setup to first determine a hit BEFORE rolling for damage, giving the player time to react and cast this spell.
///////// If the game is set to roll both simultaneously this macro is less useful.

const ActorUpdate = game.macros.getName("ActorUpdate");
const ActorSetFlag = game.macros.getName("ActorSetFlag");
const ActorGetFlag = game.macros.getName("ActorGetFlag");
const ActorUnsetFlag = game.macros.getName("ActorUnSetFlag");

async function DamageResistance (elemType, spellLvl) {
    await ChatMessage.create({ content: `${token.name} is now resistant to ${elemType} and their next melee attack will do [[/r ${spellLvl}d6]] bonus elemental damage.`})
    // process to apply the damage resistance
    let drArray = token.actor.data.data.traits.dr.value;                       // get the actor's current resistances.
    await ActorSetFlag.execute(token.id, "world", "AbsorbedElement", drArray); // save the old resistances in a flag.
    drArray.push(elemType.toLowerCase())                                       // add the chosen resistance to the array.
    await ActorUpdate.execute(token.id, {"data.traits.dr.value": drArray});    // update the actor with the new resistance.
    // apply the damage to next melee weapon attack... but how... for now easiest to roll via the chat message... but that is janky
}
Main()

async function Main() {
    console.log(args)
    if (args[0] === "on") {
        // Make a dialog that asks which damage type the caster recieved.
        new Dialog({
            title: "Absorb Elements",
            content: "You received a type of elemental damage, which was it?",
            buttons: {
                AcidDmg: {
                    label: "Acid",
                    callback: () => DamageResistance ("Acid", args[1]),
                },
                ColdDmg: {
                    label: "Cold",
                    callback: () => DamageResistance ("Cold", args[1]),
                },
                FireDmg: {
                    label: "Fire",
                    callback: () => DamageResistance ("Fire", args[1]),
                },
                LightnDmg: {
                    label: "Lightning",
                    callback: () => DamageResistance ("Lightning", args[1]),
                },
                ThunderDmg: {
                    label: "Thunder",
                    callback: () => DamageResistance ("Thunder", args[1]),
                },
            }
        }).render(true);        
    }
    if (args[0] === "off") {
        let drArray = await ActorGetFlag.execute(token.id, "world", "AbsorbedElement");
        await ActorUpdate.execute(token.id, {"data.traits.dr.value": drArray});
        await ActorUnsetFlag.execute(token.id, "world", "AbsorbedElement");
    }
}
