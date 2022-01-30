// macro.execute
const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const itemD = lastArg.efData.flags.dae.itemData;

async function bonusEffect(tactor, itemD){
  let gameRound = game.combat ? game.combat.round : 0;
  let effectData = [{
    label: `${itemD.name} Bonus`,
    icon: "icons/svg/d20-highlight.svg",
    duration: { turn: 1, startRound: gameRound, startTime: game.time.worldTime },
    flags: { dae: { specialDuration: ["1Action", "isSave", "1Attack", "1Reaction"] } },
    origin: lastArg.origin,
    changes: [{key: "data.bonuses.abilities.save",mode : 2, value : "+1d4", priority : 20},
    {key: "data.bonuses.All-Attacks",mode: 2, value : "+1d4", priority : 20}]
  }];
  let checkAE = await tactor.effects.find(i => i.data.label === `${itemD.name} Bonus`);
  if (!checkAE) {
    await tactor.createEmbeddedDocuments("ActiveEffect", effectData);
  }
}

async function combatRound(combat, update) {
  if (!("turn" in update)) return;
  await bonusEffect(tactor, itemD);
}

if (args[0] === "on") {
  let hookId = Hooks.on("updateCombat", combatRound);
  DAE.setFlag(tactor, "emboldenBond", hookId);
}

if (args[0] === "off") {
  let hookId = DAE.getFlag(tactor, "emboldenBond");
  Hooks.off("updateCombat", hookId);
  DAE.unsetFlag(tactor, "emboldenBond");
}