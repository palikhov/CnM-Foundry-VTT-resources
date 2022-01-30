// this macro gets all the d20 rolled from the messages and spits back what is the avg roll and all rolled d20 results.
// // step zero, lets declare some variables..
let rollArray = []
let rollResult = 0;
let critCount = 0;
let failCount = 0;
// // step one, get all the messages with a d20 roll in them. For 0.7+
let rollMessages = game.messages.filter(m => m._roll?.formula?.includes("d20")) // question marks are needed to not have the filter get stuck on messages that have no rolls.
// // step two, get the rolled dice. This is where it gets ugly! Not good coding practice but I dont know how else to get down there.
for (let message of rollMessages) {                 // takes an individual message from the rollMessages object.
    for (let term of message.roll.terms) {          // every dice roll consists of a term array, we need to check each of the elements whether they contain a 20 sided dice.
        if (term.faces == 20) {                     // if the die has 20sides we continue our search otherwise we just dont care and go to the next message.
            for (let result of term.results) {      // results can consist of multiple d20 results, most notably in adv. / disadv. rolls.
                rollResult = result.result;
                rollArray.push(rollResult);         // here we combine all the results in an array.
                if (rollResult == 20) {             // just for funsies we add a counter that goes up each time a crit or fail was rolled.
                    critCount++;
                }
                else if (rollResult == 1) {
                    failCount++;
                }
            }
        }
    }
}
// // step three, assembling the data for presentation.
let sumRolls = rollArray.reduce(function(a, b){
    return a + b;
}, 0);                                              // adds all the numbers together within the array.
let averageRolls = sumRolls / rollArray.length;
let allRolls = rollArray.join("-");                 // joins all the numbers in the array into a string divided by a dash, eg. "3-15-18-5-20"
allRolls = allRolls.replace(/20/g, "<b>20</b>")
allRolls = allRolls.replace(/-1-/g, "-<i><b>1</b></i>-")
// // step four, spitting the data out for the user.
// console.log(averageRolls, allRolls);
ChatMessage.create({
    flavor: 'Dice stats:', 
    content: `<p>In today's session ${rollArray.length} d20's were rolled.</p>
            <p>An avgerage of ${averageRolls.toFixed(2)} was rolled.</p>
            <p>${critCount} criticals successes were rolled.</p> 
            <p>${failCount} critical fails were rolled.</p> 
            <p>Raw numbers:</p><p> ${allRolls}</p>`
});
