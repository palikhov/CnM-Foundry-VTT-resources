let ActorSetFlag = game.macros.getName("ActorSetFlag");
let ActorUnSetFlag = game.macros.getName("ActorUnSetFlag");
let target = canvas.tokens.get(args[1]);
let itemD = args[2];

function combatRound(combat, update) {
  if (!("round" in update || "turn" in update)) return;
  if (combat.combatant.tokenId === args[1]) {      
      saveT();
  }
}

function saveT(){
    let save_roll =  await target.actor.rollAbilitySave('wis', {chatMessage : false, fastForward: true });
	let results_html = `<div class="dnd5e chat-card item-card"><header class="card-header flexrow"><img src="${itemD.img}" title="${itemD.name}" width="36" height="36"><h3 class="item-name">${itemD.name}</h3></header><div class="card-content">${itemD.data.description.chat}</div><div class="card-buttons"><div class="flexrow 1"><div style="text-align:center;text-transform:capitalize;">${itemD.data.save.ability} saving throw (DC ${itemD.data.save.dc})<div class="dice-roll"><div class="dice-result"><div class="dice-formula">${save_roll.formula}</div><h4 class="dice-total">${save_roll.total}</h4></div></div></div></div></div><footer class="card-footer"><span>${itemD.data.level} Level</span><span>V</span><span>${itemD.data.activation.cost} ${itemD.data.activation.type} Action</span><span>${itemD.data.target.value} ${itemD.data.target.type}</span><span>${itemD.data.range.value} ${itemD.data.range.units}</span><span>${itemD.data.duration.value} ${itemD.data.duration.units}</span></footer></div>`;
	ChatMessage.create({
					        user: game.user._id,
                            speaker: ChatMessage.getSpeaker({token: target}),
                            content: results_html
	});
	if (target.actor.data.data.attributes.hp.value === 0) {
	 cleanse();	 
	}
    else if (save_roll.total > itemD.data.save.dc) {    
    cleanse();	
    let save_result = `${target.name} successfully made their ${itemD.data.save.ability} saving throw ${save_roll.total} [DC ${itemD.data.save.dc}]`;
    ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({token: target}),
        content: save_result
    });	
    }
}

function cleanse(){
	Hooks.off("updateCombat", combatRound);
    ActorUnSetFlag.execute(args[1], "world", "wrathfulSmite_hookID");
	DynamicEffects.applyActive("Wrathful Smite", false, "spell")	
}

if (args[0] === "on") {    
    const hookId = Hooks.on("updateCombat", combatRound);
    ActorSetFlag.execute(args[1], "world", "wrathfulSmite_hookID", hookId);
}
if (args[0] === "off") {    
	game.macros.getName("Cub_Condition").execute(args[1], "Wrathful Smite", "remove");
	Hooks.off("updateCombat", combatRound);
    ActorUnSetFlag.execute(args[1], "world", "wrathfulSmite_hookID");
}