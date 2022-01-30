if (args[0] === "on"){
(async()=>{
let target = canvas.tokens.get(args[1])
let itemD = args[2];
let roll = await target.actor.rollSkill('ins', {chatMessage : false, fastForward: true });
if (roll.total <=7) {
    let results_html = `<div class="dnd5e chat-card item-card" data-actor-id="${target.data._id}" data-item-id="${itemD.id}"><header class="card-header flexrow"><img src="${itemD.img}" title="${itemD.name}" width="36" height="36"><h3 class="item-name">${itemD.data.name}</h3></header><div class="card-content">${itemD.data.description.value}</div><div class="card-buttons"><div class="flexrow 1"><div>Insight Skill Check (Wis)<div class="dice-roll"><div class="dice-result"><div class="dice-formula">${roll.formula}</div><h4 class="dice-total">8</h4></div></div></div></div></div><footer class="card-footer"><span>${itemD.data.requirements}</span><span>${itemD.data.activation.cost} ${itemD.data.activation.type}</span><span>${itemD.data.target.type}</span><span>${itemD.data.range.units}</span></footer></div>`;   
    ChatMessage.create({
					        user: game.user._id,
                            speaker: ChatMessage.getSpeaker({token: target.actor}),
                            content: results_html
});
}
else {
    let results_html = `<div class="dnd5e chat-card item-card" data-actor-id="${target.data._id}" data-item-id="${itemD.id}"><header class="card-header flexrow"><img src="${itemD.img}" title="${itemD.name}" width="36" height="36"><h3 class="item-name">${itemD.name}</h3></header><div class="card-content">${itemD.data.description.value}</div><div class="card-buttons"><div class="flexrow 1"><div>Insight Skill Check (Wis)<div class="dice-roll"><div class="dice-result"><div class="dice-formula">${roll.formula}</div><h4 class="dice-total">${roll.total}</h4></div></div></div></div></div><footer class="card-footer"><span>${itemD.data.requirements}</span><span>${itemD.data.activation.cost} ${itemD.data.activation.type}</span><span>${itemD.data.target.type}</span><span>${itemD.data.range.units}</span></footer></div>`; 
    ChatMessage.create({
					        user: game.user._id,
                            speaker: ChatMessage.getSpeaker({token: target.actor}),
                            content: results_html
});
}
})();
}