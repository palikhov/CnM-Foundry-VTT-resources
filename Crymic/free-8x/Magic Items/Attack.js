// Uses Item Macro, Midi-qol On Use & Magic Item Module to work.
// Setup Magic item like you normally would by creating a spell called with all the damage details in the spell as detailed on the weapon.
// also checkes for Item Attunement and gives you a choice if you want to spend a charge or not.
(async ()=>{
let itemD = await args[0].item;
let magicD = itemD.flags.magicitems;
let attunement = itemD.data.attunement;
let target = await canvas.tokens.get(args[0].hitTargets[0]._id);
if ((target) && (attunement === 2)){
	new Dialog({
		title: `${itemD.name}`,
		content: `<p>Spend a charge?</p>`,
		buttons: {
			confirmed: {
				icon: "<i class='fas fa-bolt'></i>",
				label: "Yes", callback: async () => {
					await MagicItems.roll(itemD.name, magicD.spells[0].name);
				}
			}		
		}
	}).render(true);
  }
})();
