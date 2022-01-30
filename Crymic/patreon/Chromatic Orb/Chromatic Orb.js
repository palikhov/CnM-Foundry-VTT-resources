// thanks to Kekilla for an great dialog macro.
// Midi-qol on use Chromatic Orb, It handles damage. 
async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
const damage_types = ["acid", "cold", "fire", "lightning", "poison", "thunder"];

(async () => {
  if (args[0].hitTargets.length === 0) return {};
  let actorD = game.actors.get(args[0].actor._id);
  let tokenD = canvas.tokens.get(args[0].tokenId);
  let damage_type = await choose(damage_types, 'Choose Damage Type : ');
  let target = canvas.tokens.get(args[0].hitTargets[0].id);
  let level = Number(args[0].spellLevel) + 2;
  let damageDice = args[0].isCritical ? level * 2 : level;
  let damageRoll = new Roll(`${damageDice}d8`).evaluate({ async: false });
  new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, damage_type, [target], damageRoll, { flavor: `(${CONFIG.DND5E.damageTypes[damage_type]})`, itemCardId: args[0].itemCardId, useOther: false });
})();

async function choose(options = [], prompt = ``) {
  let value = await new Promise((resolve) => {

    let dialog_options = (options[0] instanceof Array)
      ? options.map(o => `<option value="${o[0]}">${o[1]}</option>`).join(``)
      : options.map(o => `<option value="${o}">${o}</option>`).join(``);

    let content = `<form><div class="form-group"><label for="choice">${prompt}</label><select id="choice">${dialog_options}</select></div></form>`;

    new Dialog({
      content,
      buttons: { OK: { label: `OK`, callback: async (html) => { resolve(html.find('#choice').val()); } } }
    }).render(true);
  });
  return value;
}