//##########################################################
// FIRST READ!!!!!!!!
// Midi-Qol "on use" macro
//##########################################################
async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
const level = Number(args[0].spellLevel);
const actorD = game.actors.get(args[0].actor._id);
const tokenD = canvas.tokens.get(args[0].tokenId);
const itemD = actorD.items.get(args[0].item._id).data;

if (args[0].hitTargets.length > 0) {
  const target = canvas.tokens.get(args[0].hitTargets[0].id);
  const damageType = args[0].damageDetail[0].type;

  if (target.inCombat) {
    const hookId = Hooks.on("updateCombat", combatRound);
    DAE.setFlag(actorD, "witchBolt", hookId);
  }

  async function witchboltStatus() {
    if (actorD.effects.find(i => i.data.label === "Concentrating")) {
      new Dialog({
        title: `${itemD.name}`,
        content: `<p>Continue concentrating?</p>`,
        buttons: {
          confirmed: {
            label: "Continue",
            callback: () => witchboltDamage()
          },
          cancel: {
            label: "Cancel It!",
            callback: () => witchboltCancel()
          }
        }
      }).render(true);
    } else {
      witchboltCancel();
    }
  }

  async function combatRound(combat, update) {
    if (!("round" in update || "turn" in update)) return;
    if (game.combat.combatant.token.id === tokenD.id) {
      await checkDistance();
      await wait(1000);
      await witchboltStatus();
    }
  }

  async function checkDistance() {
    let distance = 29.5;
    let get_target = await canvas.tokens.placeables.filter(rTarget => (canvas.grid.measureDistance(tokenD.center, rTarget.center) > distance && tokenD.id != rTarget.id && tokenD.data.disposition != rTarget.data.disposition));
    let get_vision = await canvas.tokens.placeables.filter(rTarget => tokenD.data.disposition != rTarget.data.disposition && canvas.walls.checkCollision(new Ray(tokenD.center, rTarget.center)));
    for (let find_target of get_target) {
      if (target.id === find_target.id) {
        witchboltCancel();
      }
    }
    for (let find_target of get_vision) {
      if (target.id === find_target.id) {
        witchboltCancel();
      }
    }
  }

  async function witchboltDamage() {
    console.log(itemD.name," => Damage Effect");
    let damageRoll = new Roll(`${level}d12`).evaluate({async:false});
    game.dice3d?.showForRoll(damageRoll);
    if (itemD.components?.concentration) itemD.components.concentration = false;
    new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, damageType, [target], damageRoll, { flavor: `(${damageType})`, itemData: itemD, itemCardId: "new" });
  }

  async function witchboltCancel() {
    console.log(itemD.name," => Removing Spell Effect");
    let conc = await actorD.effects.find(i => i.data.label === "Concentrating");
    if (conc) await actorD.deleteEmbeddedDocuments("ActiveEffect", [conc.id]);
    let hookId = await DAE.getFlag(actorD, "witchBolt", combatRound);
    await Hooks.off("updateCombat", hookId);
    await DAE.unsetFlag(actorD, "witchBolt");
  }
} else {
  console.log(itemD.name," => Removing Concentrating");
  let conc = actorD.effects.find(i => i.data.label === "Concentrating");
  if (conc) actorD.deleteEmbeddedDocuments("ActiveEffect", [conc.id]);
}