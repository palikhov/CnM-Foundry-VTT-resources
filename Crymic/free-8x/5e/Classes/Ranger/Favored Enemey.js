async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
(async ()=>{
let choice = "";
const actorD = game.actors.get(args[0].actor._id);
new Dialog({
    title: "Favored Enemey",
    content: "<p>Select One</p>",
    buttons: {
        track: {label: "Tracking", callback: () => { choice = 'track'}},
        recall: {label: "Recall", callback: () => { choice = 'recall'}}
        }, close : async (html) => {
            let sur = new Roll('2d20kh + @skills.sur.total', actorD.getRollData()).evaluate({async:false});
            let int = new Roll('2d20kh + @abilities.int.mod + @prof', actorD.getRollData()).evaluate({async:false});
            let roll = choice === 'track' ? sur : int;
            let skill_type = choice == 'track' ? 'Tracking Skill Check (Advantage)' : 'Intelligence Ability Check (Advantage)';            
            get_roll(roll, skill_type);
	}
}).render(true);

async function get_roll(roll, skill_type){
game.dice3d?.showForRoll(roll);
let dice_roll = roll.terms[0].results;
let roll_success = 0;
let get_dice = "";
for (let dice of dice_roll){
  if (dice.discarded){
     get_dice += `<li class="roll die d20 discarded">${dice.result}</li>`;
 }
 else {
     if(dice.result === 20) {
         roll_success = 2;
         get_dice += `<li class="roll die d20 success">${dice.result}</li>`; }
     else if(dice.result === 1){
         roll_success = 1;
         get_dice += `<li class="roll die d20 fail">${dice.result}</li>`; }
     else {
         get_dice += `<li class="roll die d20">${dice.result}</li>`; }
 }
}

let roll_style = roll_success === 2 ? "critical" : roll_success === 1 ? "fumble" : "";
let roll_results = `<div class="dice-roll"><p>${skill_type}</p><div class="dice-result"><div class="dice-formula">${roll.formula}</div><div class="dice-tooltip"><div class="dice"><header class="part-header flexrow"><span class="part-formula">${roll.formula}</span><span class="part-total">${roll.total}</span></header><ol class="dice-rolls">${get_dice}</ol></div></div><h4 class="dice-total ${roll_style}">${roll.total}</h4></div></div>`;
let chatMessage = game.messages.get(args[0].itemCardId);
let content = duplicate(chatMessage.data.content);
let searchString = /<div class="midi-qol-other-roll">[\s\S]*<div class="end-midi-qol-other-roll">/g;
let replaceString = `<div class="midi-qol-other-roll"><div class="end-midi-qol-other-roll"><hr>${roll_results}`;
content = content.replace(searchString, replaceString);
await chatMessage.update({ content: content });
await wait(500);
await ui.chat.scrollBottom();
}
})();
