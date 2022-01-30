// Item Macro, Midi-qol On Use
let actorD = game.actors.get(args[0].actor._id);
let itemD = args[0].item;
let choice = "";
new Dialog({
	title: `${itemD.name} Skill Check`,
	content: "Pick one to roll",
	buttons: {
		adv: {label: "Advantage", callback: () => { choice = `adv`}},
		norm: {label: "Normal", callback: () => { choice = `nor`}},
		dis: {label: "Disadvantage", callback: () => { choice = `dis`}}
	},
    close : (html) => {
		let dice = choice == `adv` ? `2d20kh` : choice == `dis` ? `2d20kl` : `1d20`;
		let roll_type = choice == `adv` ? `(Advantage)` : choice == `dis` ? `(Disadvantage)` : ``;
		let roll = new Roll(`${dice} + @abilities.int.mod + (@prof*2)`, actorD.getRollData()).roll({async:false});
        get_roll(roll, roll_type);
        }
}).render(true);
async function get_roll(roll, roll_type){
game.dice3d.showForRoll(roll);
let dice_roll = roll.dice[0].results;
let get_dice = "";
let roll_success = roll.terms[0].results[0].result === 1 ? "fumble" : roll.terms[0].results[0].result === 20 ? "critical" : "";
for (let dice of dice_roll){
  if (dice.discarded){
     get_dice += `<li class="roll die d20 discarded">${dice.result}</li>`;
 }
 else {
 get_dice += `<li class="roll die d20">${dice.result}</li>`;
 }
}
let roll_results = `<div class="dice-roll"><p>${itemD.name} Skill Check (History) ${roll_type}</p><div class="dice-result"><div class="dice-formula">${roll.formula}</div><div class="dice-tooltip"><div class="dice"><header class="part-header flexrow"><span class="part-formula">${roll.formula}</span><span class="part-total">${roll.total}</span></header><ol class="dice-rolls">${get_dice}</ol></div></div><h4 class="dice-total ${roll_success}">${roll.total}</h4></div></div>`;
const chatMessage = game.messages.get(args[0].itemCardId);
let content = duplicate(chatMessage.data.content);    
const searchString =  /<div class="midi-qol-saves-display">[\s\S]*<div class="end-midi-qol-saves-display">/g;
const replaceString = `<div class="midi-qol-saves-display"><div class="end-midi-qol-saves-display">${roll_results}`;
content = content.replace(searchString, replaceString);
chatMessage.update({content: content});
}
