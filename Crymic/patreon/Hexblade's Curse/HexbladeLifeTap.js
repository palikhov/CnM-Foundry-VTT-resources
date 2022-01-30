async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const target = canvas.tokens.get(lastArg.tokenId);
const item = lastArg.efData.flags.dae.itemData;
const tokenD = canvas.tokens.get(lastArg.efData.flags.dae.tokenId);

if (args[0] === "on") {
    let hookId = Hooks.on("midi-qol.DamageRollComplete", damageCheck);
    DAE.setFlag(tactor, "HexbladeLife", hookId);
}

async function damageCheck(workflow) {
    await wait(500);
    let attackWorkflow = await workflow.damageList.map((i) => ({ newHP: i?.newHP, tokenId: i?.tokenId })).filter(i => (i.tokenId === target.id) || (i.tokenId === tokenD.id));
    let lastAttack = attackWorkflow[attackWorkflow.length - 1];
    let effectId = tactor.effects.find(i => i.data.label === "Hexblade Life Tap").id;
    if (lastAttack?.newHP > 0) return {};
    await tactor.deleteEmbeddedDocuments("ActiveEffect", [effectId]);
    let effect = tokenD.actor.effects.find(ef => ef.data.label === game.i18n.localize("Hexblade Bonus Damage"));
    if (effect) await MidiQOL.socket().executeAsGM("removeEffects", { actorUuid: tokenD.actor.uuid, effects: [effect.id] });
}

if (args[0] === "off") {
    if (await tactor.data.data.attributes.hp.value === 0) {
        let modDamage = Math.max(1, tokenD.actor.data.data.abilities.cha.mod);
        let damageRoll = new Roll(`@classes.warlock.levels + ${modDamage}`, await tokenD.actor.getRollData()).evaluate({ async: false });
        let healType = "healing";
        let itemD = tokenD.actor.items.get(item._id).data;
        new MidiQOL.DamageOnlyWorkflow(tactor, target, damageRoll.total, healType, [tokenD], damageRoll, { flavor: `(${CONFIG.DND5E.healingTypes[healType]})`, itemData: itemD, itemCardId: "new" });
        let effect = tokenD.actor.effects.find(ef => ef.data.label === game.i18n.localize("Hexblade Bonus Damage"));
        if (effect) await MidiQOL.socket().executeAsGM("removeEffects", { actorUuid: tokenD.actor.uuid, effects: [effect.id] });
    }
    let hookId = DAE.getFlag(tactor, "HexbladeLife");
    Hooks.off("midi-qol.DamageRollComplete", hookId);
    DAE.unsetFlag(tactor, "HexbladeLife");
}