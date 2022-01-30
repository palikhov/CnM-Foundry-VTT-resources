// Macro Author: Freeze (on discord)
// Macro version: 0.1
// Foundry Version: 0.7+
// DnD5e Version: 1.1.1
// Prerequisits: Dynamic Active Effects SRD module, the Furnace
// Usage: Make an active effect on the Beacon of Hope spell, Macro Execute CUSTOM DAE-BeaconOfHope @target


const ActorSetFlag = game.macros.getName("ActorSetFlag");
const ActorUnSetFlag = game.macros.getName("ActorUnSetFlag");
const target = canvas.tokens.get(args[1]);
(async ()=>{
        if (args[0] === "on") {
                ChatMessage.create({content: `${target.name} is now under the influence of Beacon of Hope cast by ${token.name}`});
                await ActorSetFlag.execute(args[1], "world", "BeaconOfHope", true);
        }
        if (args[0] === "off") { 
                await ActorUnSetFlag.execute(args[1], "world", "BeaconOfHope");
        }
})();