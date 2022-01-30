// Let macro deal damage instead of the item, it also supports "mockeries" table found in Community Tables Module.
// Requires ActiveEffect callback macro
if (args[0].failedSaves.length === 0) return {};
let itemD = args[0].item;
let actorD = game.actors.get(args[0].actor._id);
let tokenD = canvas.tokens.get(args[0].tokenId);
let target = canvas.tokens.get(args[0].failedSaves[0].id);
let getClass = Object.keys(actorD.classes);
let level = actorD.classes[getClass].data.data.levels;
let numDice = 1 + (Math.floor((level + 1) / 6));
let tableName = "mockeries";
let table = game.tables.getName(tableName);
let damageType = "psychic";
let mockery = "";
if (table) {
    let roll = await table.roll();
    mockery = roll.results[0].data.text;
} else {
    mockery = "Now go away or I shall taunt you a second time-a!";
}
let combatRound = game.combat ? game.combat.round : 0;
let damageRoll = new Roll(`${numDice}d4`).evaluate({ async: false });
new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, damageType, [target], damageRoll, { flavor: `<hr><div style="font-weight:bold;">${mockery}</div><hr><div>(${CONFIG.DND5E.damageTypes[damageType]})</div>`, itemCardId: args[0].itemCardId });
let effectData = {
    label: itemD.name,
    icon: itemD.img,
    duration: { rounds: 2, startRound: combatRound, startTime: game.time.worldTime },
    flags: { dae: { macroRepeat: "none", specialDuration: ["1Attack", "turnEnd"] } },
    origin: args[0].uuid,
    disabled: false,
    changes: [{
        "key": "flags.midi-qol.disadvantage.attack.all",
        "mode": 2,
        "value": 1,
        "priority": 20
    }]
};
let effect = target.actor.effects.find(ef => ef.data.label === game.i18n.localize(itemD.name));
if (!effect) await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: target.uuid, effects: [effectData] });