// Thanks to tposney for how to access the workflow.
// Requires Midi-Qol module. GM runs this macro, it is standalone run. Do not run it as a DAE or Item Macro.
// It affects all players, but only if they have Heavy Armor Master.
(async () => {
async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
	function dodgeDetction(workflow){		
		workflow.hitTargets.forEach(target => {
            let actionTypes = ['mwak','rwak','rsak'];
            let itemTypes = ['spell', 'weapon'];
			if((target.actor.items.find(i => i.name==="Uncanny Dodge") != null) && (itemTypes.includes(workflow.item.data.type)) && (actionTypes.includes(workflow.item.data.actionType))){
                (async ()=>{
                async function combatRound(combat, update) {
                    if (!("round" in update || "turn" in update)) return;
                    if (combat.combatant.tokenId === target.data._id) {
                       await target.actor.unsetFlag("world", "uncanny_dodge_hookID");
                        }
                }
                let already_dodged = target.actor.getFlag("world", "uncanny_dodge_hookID");
                if (target.inCombat) {
                const hookId = Hooks.on("updateCombat", combatRound);
                target.actor.setFlag("world", "uncanny_dodge_hookID", hookId);
                }
                if (!already_dodged){
				let itemD = await target.actor.items.find(i => i.name==="Uncanny Dodge");     
				let healAmount = Math.floor(workflow.damageTotal/2);
				await wait(2000);
				await MidiQOL.applyTokenDamage([{damage: healAmount, type: "healing"}], healAmount, new Set([target]), itemD.name, new Set());
				let heal_html = `<div class="dnd5e chat-card item-card"><header class="card-header flexrow"><img src="${itemD.data.img}" title="${itemD.data.name}" width="36" height="36"><h3 class="item-name">${itemD.data.name}</h3></header><div class="card-content">${itemD.data.data.description.value}</div><div class="card-buttons"><div class="flexrow 1"><div style="text-align:center">(healing)<div class="dice-roll"><div class="dice-result"><h4 class="dice-total">${healAmount}</h4></div></div></div></div></div></div>`;
				ChatMessage.create({
					user: game.user._id,
					speaker: ChatMessage.getSpeaker({token: target}),
					content: heal_html
				});
			 }
			    })();
            }
		});
	}
Hooks.on("midi-qol.RollComplete", dodgeDetction);
})();
