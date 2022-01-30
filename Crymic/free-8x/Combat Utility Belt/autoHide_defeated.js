// in Cub condition lab create a "Defeated" condition. On the defeated condition add macro.execute "defeated"
// Make sure to setup the trigger for it in Triggler when to make a target defeated.
// When a monster is defeated in combat, this will automatically hide them in the combat track.
(async ()=>{
if (game.combat){
if ((args[0] === "on") && (args[1] === "defeated")){
let combatants = game.combat.combatants;
for (let target of combatants){
if (target.actor.data.data.attributes.hp.value === 0){
    await game.combat.updateCombatant({_id: target._id, hidden : true});
    }
  else {
   await game.combat.updateCombatant({_id: target._id, hidden : false});
  }
}
}
}
})();
