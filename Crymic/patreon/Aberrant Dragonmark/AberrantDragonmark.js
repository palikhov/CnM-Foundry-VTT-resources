// Midi-qol On Use Macro
// the macro does all the healing and damage.
(async()=>{
let actorD = game.actors.get(args[0].actor._id);
let tokenD = canvas.tokens.get(args[0].tokenId);
let aData = await actorD.getRollData();
let class_details = Object.values(actorD.classes);
let className;
if(class_details.length > 1) {className = class_details.filter(i=> class_details.includes(i.name)).sort((a,b) => a.data.data.levels > b.data.data.levels ? -1 : 1).name;}
else {className = class_details[0].name;}
let hitDice = aData.classes[className.toLowerCase()].hitDice;
let hitDiceUsed = aData.classes[className.toLowerCase()].hitDiceUsed;
let curtHD = aData.attributes.hd;
let healType = "temphp";
let damageType = "force";
let distance = 29.5;
if(curtHD === 0) return ;
let damageRoll = new Roll(`1${hitDice}`).evaluate({async:false});
game.dice3d?.showForRoll(damageRoll);
await getClass.update({"data.hitDiceUsed": hitDiceUsed + 1});
if(damageRoll.total % 2 == 0) {
    new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, healType, [tokenD], damageRoll, {flavor: `(${CONFIG.DND5E.healingTypes[healType]})`, itemCardId: args[0].itemCardId});
}
else {
   let get_targets = canvas.tokens.placeables.filter(target => (canvas.grid.measureDistance(tokenD.center, target.center) <= distance && tokenD.id != target.id));
   if(get_targets.length > 0){
      let random = Math.floor(Math.random() * (get_targets.length));
      let target = get_targets[random];
       new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, damageType, [target], damageRoll, {flavor: `(${CONFIG.DND5E.damageTypes[damageType]})`, itemCardId: args[0].itemCardId});
   } else {
       new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, damageType, [tokenD], damageRoll, {flavor: `(${CONFIG.DND5E.damageTypes[damageType]})`, itemCardId: args[0].itemCardId});
   }
}
})();

