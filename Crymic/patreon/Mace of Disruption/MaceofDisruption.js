// Midi-qol On Use
// Requires 1 callback macros ActorUpdate
async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
(async () => {
    if (args[0].hitTargets.length === 0) return {};
    const ActorUpdate = game.macros.getName("ActorUpdate");
    const actorD = game.actors.get(args[0].actor._id);
    const tokenD = canvas.tokens.get(args[0].tokenId);
    const target = canvas.tokens.get(args[0].hitTargets[0].id);
    const type = target.actor.data.type === "npc" ? ["undead", "fiend"].some(value => (target.actor.data.data.details.type.value || "").toLowerCase().includes(value)) : ["undead", "fiend"].some(race => (target.actor.data.data.details.race || "").toLowerCase().includes(race));
    if (type) {
        let crit = args[0].isCritical ? 4 : 2;
        let damageType = "radiant";
        let abilityStat = "wis";
        let damageRoll = new Roll(`${crit}d6`).evaluate({ async: false });
        new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, damageType, [target], damageRoll, { flavor: `(${CONFIG.DND5E.damageTypes[damageType]})`, itemCardId: args[0].itemCardId, damageList: args[0].damageList });
        let save = await target.actor.rollAbilitySave(abilityStat, { fastForward: true, chatMessage: false });
        let dc = 15;
        // adjust for latency
        let saved = "";
        if (target.actor.data.data.attributes.hp.value <= 25) {
            if (target.actor.data.data.attributes.hp.value === 0) return {};
            if (save.total >= dc) {
                saved = "saves";
                let gameRound = game.combat ? game.combat.round : 0;
                let effectData = {
                    label: "Frightened",
                    icon: "modules/combat-utility-belt/icons/frightened.svg",
                    origin: args[0].uuid,
                    disabled: false,
                    duration: { rounds: 10, seconds: 60, startRound: gameRound, startTime: game.time.worldTime },
                    changes: [{ key: `flags.midi-qol.disadvantage.ability.check.all`, mode: 2, value: 1, priority: 20 },
                    { key: `flags.midi-qol.disadvantage.skill.check.all`, mode: 2, value: 1, priority: 20 },
                    { key: `flags.midi-qol.disadvantage.attack.all`, mode: 2, value: 1, priority: 20 }]
                };
                let effect = target.actor.effects.find(ef => ef.data.label === game.i18n.localize("Frightened"));
                if (!effect) await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: target.uuid, effects: [effectData] });
            } else {
                saved = "fails";
                ActorUpdate.execute(target.id, { "data.attributes.hp.value": 0 });
            }
            await wait(800);
            let the_message = `<div class="midi-qol-nobox midi-qol-bigger-text">Saving Throw: ${CONFIG.DND5E.abilities[abilityStat]} DC ${dc}</div><div><div class="midi-qol-nobox"><div class="midi-qol-flex-container"><div class="midi-qol-target-npc midi-qol-target-name" id="${target.id}"> ${target.name} ${saved} with ${save.total}</div><div><img src="${target.data.img}" width="30" height="30" style="border:0px" /></div></div></div></div>`;
            let chatMessage = await game.messages.get(args[0].itemCardId);
            let content = await duplicate(chatMessage.data.content);
            let searchString = /<div class="midi-qol-saves-display">[\s\S]*<div class="end-midi-qol-saves-display">/g;
            let replaceString = `<div class="midi-qol-saves-display"><div class="end-midi-qol-saves-display">${the_message}`;
            content = await content.replace(searchString, replaceString);
            await chatMessage.update({ content: content });
            await ui.chat.scrollBottom();
        }
    }
})();