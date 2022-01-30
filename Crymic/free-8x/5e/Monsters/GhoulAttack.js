// Midi-qol On Use Only
if (args[0].hitTargets.length === 0) return {};
let actorD = game.actors.get(args[0].actor._id);
let tokenD = canvas.tokens.get(args[0].tokenId);
let target = canvas.tokens.get(args[0].targets[0]._id);
let abilitySave = "con";
let game_round = game.combat ? game.combat.round : 1;
let dc = 10;
let save = await target.actor.rollAbilitySave(abilitySave);
if (dc > save.total) {
    let effectData = {
        label: "Paralyzed",
        icon: "modules/combat-utility-belt/icons/paralyzed.svg",
        origin: args[0].uuid,
        disabled: false,
        duration: { rounds: 10, startRound: game_round, startTime: game.time.worldTime },
        changes: [{ key: "flags.midi-qol.fail.ability.save.str", mode: 2, value: 1, priority: 20 },
        { key: "flags.midi-qol.fail.ability.save.dex", mode: 2, value: 1, priority: 20 },
        { key: "flags.midi-qol.grants.advantage.attack.all", mode: 2, value: 1, priority: 20 },
        { key: "flags.midi-qol.critical.mwak", mode: 2, value: 1, priority: 20 },
        { key: "data.attributes.movement.all", mode: 5, value: 1, priority: 20 },
        { key: "macro.Execute", mode: 5, value: "paralyzeEffect con 10", priority: 20 }
        ]
    };
    await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: target.actor.uuid, effects: [effectData] });
}
