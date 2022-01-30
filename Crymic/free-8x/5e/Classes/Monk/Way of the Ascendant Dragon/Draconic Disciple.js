//###########################################################################################
// MidiQOL "on use" macro
// Remove damage from item details. let the macro handle it.
//###########################################################################################

const damage_types = [`acid`, `cold`, `fire`, `lightning`, `poison`];

(async()=>{
if(args[0].hitTargets.length > 0){
let actorD = game.actors.get(args[0].actor._id);
let tokenD = canvas.tokens.get(args[0].tokenId);
let damage_type = await choose(damage_types, `Choose Damage Type : `);
let target = canvas.tokens.get(args[0].hitTargets[0]._id);
let level = Number(Math.ceil((actorD.getRollData().classes.monk.levels + 8)/6)*2);
let numDice = 1;
if (args[0].isCritical) numDice *= 2;
let damageRoll = new Roll(`${numDice}d${level} + @abilities.dex.mod`, actorD.getRollData()).roll();
game.dice3d?.showForRoll(damageRoll);
new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, damage_type, [target], damageRoll, {flavor: `(${damage_type})`, itemCardId: args[0].itemCardId, damageList: args[0].damageList});
}
})();

async function choose(options = [], prompt = ``) {
  let value = await new Promise((resolve) => {

    let dialog_options = (options[0] instanceof Array)
      ? options.map(o => `<option value="${o[0]}">${o[1]}</option>`).join(``)
      : options.map(o => `<option value="${o}">${o}</option>`).join(``);
      let content = `<form><div class="form-group"><label for="choice">${prompt}</label><select id="choice">${dialog_options}</select></div></form>`;
  
    new Dialog({
      content, 
      buttons : { OK : {label : `OK`, callback : async (html) => { resolve(html.find('#choice').val()); } } }
    }).render(true);
  });
  return value;
}
