// Open up the Special Traits window on your Cleric's sheet, then locate DAE.Midi-QOL Specific Bonus Damage Macros. There enter the name of the macro, whatever you named it.
if (args[0].tag === "DamageBonus") {
    if (!["mwak", "rwak"].includes(args[0].item.data.actionType)) return {};
    let tokenD = canvas.tokens.get(args[0].tokenId);
    let level = tokenD.actor.classes.cleric.data.data.levels;
    let damageType = "psychic";
    let numDice = level > 16 ? 2 : 1;
    args[0].isCritical ? numDice = numDice * 2 : numDice;
    let itemD = tokenD.actor.items.getName("Divine Strike");
    if (tokenD.actor.effects.find(i => i.data.label === itemD.name)) return {};
    let gameRound = game.combat ? game.combat.round : 0;
    let effectData = {
        label: itemD.name,
        icon: itemD.img,
        tint: "#8f0000",
        origin: itemD.uuid,
        duration: { turns: 1, startRound: gameRound, startTime: game.time.worldTime }
    };
    await tokenD.actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
    return { damageRoll: `${numDice}d8[${damageType}]`, flavor: `(${itemD.name} (${CONFIG.DND5E.damageTypes[damageType]}))` };
}