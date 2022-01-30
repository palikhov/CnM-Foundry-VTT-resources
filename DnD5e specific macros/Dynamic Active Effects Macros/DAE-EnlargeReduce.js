// DAE-EnlargeReduce spell from Kandashi' DAE-SRD, but "improved"...

const target = canvas.tokens.get(args[1]);
const originalSize = target.data.width;
const originalScale = target.data.scale;
const mwak = target.actor.data.data.bonuses.mwak.damage
const ActorUpdate = game.macros.getName("ActorUpdate");
const TokenUpdate = game.macros.getName("TokenUpdate");
const ActorSetFlag = game.macros.getName("ActorSetFlag");
const ActorUnSetFlag = game.macros.getName("ActorUnSetFlag");

if (args[0] === "on" && !target.getFlag('world', 'enlageReduceSpell')) {
    let newScale = 0;
    let newSize = 0;
    const sizeCategory = target.actor.data.data.traits.size;
    if (target) {
        new Dialog({
            title: "Enlarge or Reduce",
            buttons: {
                one: {
                    label: "Enlarge",
                    callback: () => {
                        console.log(args[1])
                        let bonus = mwak + " 1d4";
                        if (sizeCategory === "med" || sizeCategory === "lg" || sizeCategory === "huge") {
                            newSize = (originalSize + 1);
                            newScale = originalScale;
                        }
                        else if (sizeCategory === "sm") {
                            newSize = originalSize;
                            newScale = originalScale;
                        }
                        else if (sizeCategory === "tiny") {
                            newSize = originalSize;
                            newScale = originalScale * 1.66;
                        }
                        else {
                            ui.notifications.info("Target creature is already Gargantuan in size, the spell has no effect")
                            ChatMessage.create({content: target.name + " is too large to be enlarged"})
                            ActorSetFlag.execute(args[1], 'world', 'enlageReduceSpell', {
                                size: originalSize,
                                scale: originalScale,
                                ogMwak: mwak,
                            })
                            return;
                        }
                        ActorUpdate.execute(args[1],{"data.bonuses.mwak.damage" : bonus });
                        TokenUpdate.execute(args[1],{width: newSize, height: newSize, scale: newScale});
                        ActorSetFlag.execute(args[1], 'world', 'enlageReduceSpell', {
                            size: originalSize,
                            scale: originalScale,
                            ogMwak: mwak,
                        })
                        ChatMessage.create({content: target.name + " is enlarged"})
                    }
                },
                    two: {
                        label: "Reduce",
                        callback: () => {
                        let bonus = mwak +  " -1d4";
                        // let size = originalSize;
                        if (sizeCategory === "lg" || sizeCategory === "huge" || sizeCategory === "grg") {
                            newSize = originalSize -1;
                            newScale = originalScale;
                        }
                        else if (sizeCategory === "med") {
                            newSize = originalSize;
                            newScale = originalScale * 0.8;
                        }
                        else if (sizeCategory === "sm") {
                            newSize = originalSize;
                            newScale = originalScale * 0.5;
                        }
                        else {
                            ui.notifications.info("Target creature is already Tiny, the spell has no effect")
                            ChatMessage.create({content: target.name + " is too small to be reduced any further"})
                            ActorSetFlag.execute(args[1], 'world', 'enlageReduceSpell', {
                                size: originalSize,
                                scale: originalScale,
                                ogMwak: mwak,
                            })
                            return;
                        }
                        ActorUpdate.execute(args[1],{"data.bonuses.mwak.damage" : bonus });
                        TokenUpdate.execute(args[1],{width: newSize, height: newSize, scale: newScale});
                        ActorSetFlag.execute(args[1], 'world', 'enlageReduceSpell', {
                            size: originalSize,
                            scale: originalScale,
                            ogMwak: mwak,
                        })
                        ChatMessage.create({content: target.name + " is reduced"})
                        }
                },
            }
        }).render(true);
    }
} 

else if(args[0] === "off"){
    let flag = target.actor.getFlag('world', 'enlageReduceSpell')
    ActorUpdate.execute(args[1],{"data.bonuses.mwak.damage" : flag.ogMwak })
    TokenUpdate.execute(args[1],{"width": flag.size, "height": flag.size, "scale": flag.scale});
    ActorUnSetFlag.execute(args[1], 'world', 'enlageReduceSpell')
    ChatMessage.create({content: target.name + " is returned to normal size"})
}