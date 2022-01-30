let confirmed = false;
// Enter the Die type 
let dieNum = 10;
// What number is starting number needed for a single success
let singleSuccess = 7;
// What number is starting number needed for a double success, set to 0 to disable
let doubleSuccess = 10;
let getDS = doubleSuccess != 0 ? `<p>1 Success = ${singleSuccess}^ | 2 Successes = ${doubleSuccess}</p>` : `<p>1 = ${singleSuccess}</p>`;
let roll_it = `<form>${getDS}<div class="form-group"><label for="num">Number of Dice:</label><input class="form-control" id="num" type="num"></div></form>`;
 new Dialog({
    title: `Die ${dieNum} Roller`,
    content: roll_it,
    buttons: {
        roll: { label: "Roll it!", callback: () => confirmed = true },
        cancel: { label: "Cancel", callback: () => confirmed = false }
    },
    default : "roll",
    close: async (html) => {
        if (confirmed){
            let dice = parseInt(html.find('#num').val());
            let roll = await new Roll(`${dice}d${dieNum}cs>=${singleSuccess}`).evaluate({async: true});
            game.dice3d?.showForRoll(roll);
            let dice_roll = roll.dice[0].results;
            let bonus = "";
            let get_dice = "";
            for (let dice of dice_roll){
                // comment out if no double successes
                if (dice.result === doubleSuccess) { bonus ++}
                if (dice.result >= singleSuccess){
                    get_dice += `<li class="roll die d${dieNum} success">${dice.result}</li>`; }
                else { get_dice += `<li class="roll die d${dieNum} failure">${dice.result}</li>`; }
            }
            // if no double success uncomment below and remove the entry below that.
            //let total = roll.total;
            let total = roll.total;
            if (bonus) total += bonus;
            let success = total > 0 ? " critical" : " fumble";
           let the_content = `<div class="chat-card item-card"><div class="card-content">Dice Roll</div><div class="card-buttons"><div class="flexrow 1"><div>d${dieNum} Dice Roller - Number of Successes<div class="dice-roll"><div class="dice-result"><div class="dice-formula">${dice}d${dieNum}</div><div class="dice-tooltip"><div class="dice"><ol class="dice-rolls">${get_dice}</ol></div></div><h4 class="dice-total${success}">${total} Succeses</h4></div></div></div></div></div></div>`;
ChatMessage.create({ user: game.user._id, speaker: ChatMessage.getSpeaker({token: token}), content: the_content, type: CONST.CHAT_MESSAGE_TYPES.OOC});
}}}).render(true);
