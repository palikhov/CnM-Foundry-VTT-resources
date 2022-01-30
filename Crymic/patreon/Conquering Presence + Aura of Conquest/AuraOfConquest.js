// Create a Feat on Paladin named "Aura of Conquest" and enter only the item description.
// Create another Effect on Conquring Presence for "Aura of Conquest".
// in DAE set this macro to Duration : Macro repeat, Start of Each turn.
// Effects: Set Macro.execute "AuraConquest or whatever you name it" @token
(async () => {
    const lastArg = args[args.length - 1];
    const tokenD = canvas.tokens.get(args[1]);
    const actorD = tokenD.actor;
    const target = canvas.tokens.get(lastArg.tokenId);
    const damageType = "psychic";
    const distance = 9.5;
    const ActiveEffect = game.macros.getName("ActiveEffect");
    if (args[0] === "each") {
        if (game.combat.combatant.token.id === lastArg.tokenId) {
            let get_target = await canvas.tokens.placeables.filter(origin => (canvas.grid.measureDistance(target.center, origin.center) <= distance && target.id != origin.id));
            let gameRound = game.combat ? game.combat.round : 0;
            for (let origin of get_target) {
                if (origin.id === tokenD.id) {
                    let itemO = await actorD.items.getName("Channel Divinity: Conquering Presence").data;
                    let itemD = await actorD.items.getName("Aura of Conquest").data;
                    let level = Number(actorD.classes.paladin.data.data.levels / 2);
                    let damageRoll = new Roll(`${level}`, actorD.getRollData()).evaluate({ async: false });
                    new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, damageType, [target], damageRoll, { flavor: `(${CONFIG.DND5E.damageTypes[damageType]})`, itemData: itemD, itemCardId: "new" });
                    let effectData = {
                        label: itemD.name,
                        icon: itemD.img,
                        duration: { rounds: 1, startRound: gameRound, startTime: game.time.worldTime },
                        flags: { dae: { macroRepeat: "none", specialDuration: ["turnStart"] } },
                        origin: itemO.uuid,
                        changes: [{
                            "key": "data.attributes.movement.walk",
                            "mode": 2,
                            "value": 0,
                            "priority": 20
                        }]
                    };
                    let checkEffect = target.actor.effects.find(i => i.data.label === "Aura of Conquest");
                    if (!checkEffect) {
                        ActiveEffect.execute(target.id, effectData, "add");
                    }
                }
            }
        }
    }
})();