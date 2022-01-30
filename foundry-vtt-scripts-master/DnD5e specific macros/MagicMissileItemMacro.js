// Macro author: Freeze
// Foundry version: 0.7+
// System: DnD5e - 1.1.1
// PreReqs: the Furnace, ItemMacro, midiQOL.
// Usage: Make an At Will spell named: Magic Missile - the missiles, make that do the damage of a single dart (1d4 + 1), 
// change the original Magic Missile spell to not do damage, and put this script in the Item Macro field of the item.
// Put "ItemMacro" in the on Use field in the details tab of the magic missile spell.

    let spellLevel = args[0].spellLevel;
    const mmResourceName = "Magic Missiles Ammo"
    let updatesLabel = "";
    let updatesValue = "";
    let updatesMax = "";
    let resourceToConsume = "";
    let macroActor = canvas.tokens.controlled[0].actor;
    if (!macroActor) {
        ui.notifications.info("You didnt have your token selected");
        return;
    }
    let spell = macroActor.items.find(i => i.name == "Magic Missile - the missiles");
    let resourceKey = Object.keys(macroActor.data.data.resources).filter(k => macroActor.data.data.resources[k].label === `${mmResourceName}`).shift();
    if (resourceKey) {
        console.log(resourceKey)
        updatesLabel = "data.resources." + resourceKey + ".label";
        updatesValue = "data.resources." + resourceKey + ".value";
        updatesMax = "data.resources." + resourceKey + ".max";
    }
    else {
        let emptyResourceKey = Object.keys(macroActor.data.data.resources).find(k => macroActor.data.data.resources[k].label == "");
        if (emptyResourceKey) {
            console.log(emptyResourceKey)
            updatesLabel = "data.resources." + emptyResourceKey + ".label";
            updatesValue = "data.resources." + emptyResourceKey + ".value";
            updatesMax = "data.resources." + emptyResourceKey + ".max";
            resourceToConsume = "resources." + emptyResourceKey + ".value";
            ui.notifications.info(`Spell set the resource to ${emptyResourceKey}`);
        }
        else { // might not be needed with a module that expands on the resources available.
            ui.notifications.info("Sadly you have too many resources set to be able to use this macro for Magic Missiles, remove one and try again");
            return;
        }
        await spell.update({"data.consume.type": "attribute", "data.consume.target": resourceToConsume, "data.consume.amount": 1});
    }
    let updates = { [updatesLabel]: "Magic Missiles Ammo", [updatesValue]: spellLevel + 2, [updatesMax]: spellLevel + 2 };
    await macroActor.update(updates);
