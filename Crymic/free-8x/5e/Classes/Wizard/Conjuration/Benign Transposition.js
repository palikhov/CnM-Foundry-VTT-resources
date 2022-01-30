// Midi-qol On Use, Requires TokenUpdate GM macro.
// Make feat create a 5 feet cube as it's target.
(async()=>{
async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
if (game.paused) return ui.notifications.error(`The ability fails. Time is frozen, you lack the knlowedge to overcome it.`);
const targetCaster = await canvas.tokens.get(args[0].tokenId);
let TokenUpdate = game.macros.getName("TokenUpdate");
let owner = game.user.id;
let find_template = await canvas.templates.history.filter(temp => temp.data[0].user === owner);
let get_count = await find_template.length -1;
let location = await find_template[get_count].data[0];
let snap = await canvas.grid.getSnappedPosition(location.x, location.y, 1);
if(args[0].targets.length === 1){
let targetToken = canvas.tokens.get(args[0].targets[0]._id);
let targetSnap = await canvas.grid.getSnappedPosition(targetCaster.x, targetCaster.y, 1);
TokenUpdate.execute(targetToken, ({x: targetSnap.x,  y: targetSnap.y}), ("off"));
await wait(50);
}
await targetCaster.update({x : snap.x, y : snap.y}, {animate : false});
await canvas.templates.get(location._id).delete();
})();

// Hotbar macro
(async()=>{
async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
let target = canvas.tokens.controlled[0]?.actor || game.user.character;
let find_item = target.items.find(item=> item.name === "Benign Transposition");
let curtUse = find_item._data.data.uses.value;
if (curtUse === 0){
new Dialog({
	title: `Benign Transposition`,
	content: `<p>You are currently out of charghes.</p><p>Did you just cast a Conjuration Spell?</p>`,
	buttons: {
		yes: {label: "Yes", callback: async () => {		
		await find_item.update({"data.uses.value" : curtUse +1});
		await wait(100);
		await game.dnd5e.rollItemMacro("Benign Transposition");
		}},
		no: {label: "No", callback: () => false}
	}
}).render(true);
}
else{
await game.dnd5e.rollItemMacro("Benign Transposition");
}
})();
