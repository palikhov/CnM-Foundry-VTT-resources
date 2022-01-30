let ActorSetFlag = game.macros.getName("ActorSetFlag");
let ActorUnSetFlag = game.macros.getName("ActorUnSetFlag");
let ActiveEffectRemove = game.macros.getName("ActiveEffectRemove");
let target = canvas.tokens.get(args[1]);

async function guidanceCheck(chat){
if ((chat.data.flags.dnd5e.roll.type === "ability") && (chat.data.speaker.actor === args[1].actor.id)){
turnOff();
}
}

async function turnOff(){
Hooks.off("createChatMessage", guidanceCheck);
ActorUnSetFlag.execute(args[1], "world", "guidance_hookID");
RemoveEffectRemove.execute(args[1], "Guidance");
}

if (args[0]==="on"){
const hookId = Hooks.once("createChatMessage", guidanceCheck);
let effectData = {
    label : "Guidance",
    icon : "systems/dnd5e/icons/spells/haste-sky-1.jpg",
    changes: [
        {
          "key": "data.bonuses.abilities.check",
          "value": "1d4",
          "mode": 0,
          "priority": 0
        }]
}
ActorUpdate.execute(args[1], {"ActiveEffect", effectData});
ActorSetFlag.execute(args[1], "world", "guidance_hookID", hookId);
}

if (args[0]==="off"){
Hooks.off("createChatMessage", guidanceCheck);
ActorUnSetFlag.execute(args[1], "world", "guidance_hookID");
}