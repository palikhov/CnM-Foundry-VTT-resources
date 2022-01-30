//This example outputs several roll results in one ChatMessage.
//just define your rolls, and define your flavor that belongs with it, and let the good times roll :)

async function makeChatFromRolls(data) {
    const rollArray = data.map(d => ({roll: new Roll(d.formula).evaluate({async: false}), flavor: d.flavor}));
    const rollArrayResults = rollArray.map(d => d.roll.total);
    const content = rollArray.reduce((acc, roll) => {
        let rollFormula = roll.roll.formula;
        let section = roll.roll.dice.reduce((acc, dice) => {
            let rollDiceParts = `${dice.number}d${dice.faces}`;
            let diceTotal = dice.results.reduce((acc, die) => {
                if(!die.discarded) acc += die.result;
                return acc;
            }, 0);
            let diceList = dice.results.reduce((total, e) => {
                let discarded = e.discarded ? "discarded" : "";
                let exploded = e.exploded ? "exploded" : "";
                let critFail = dice.faces === e.result ? "max" : e.result === 1 ? "min" : "";
                total +=`<li class="roll die ${discarded} ${exploded} d${dice.faces} ${critFail}">${e.result}</li>`;
                return total;
            }, ``);
            acc += `<section class="tooltip-part">
                        <div class="dice">
                            <header class="part-header flexrow">
                                <span class="part-formula">${rollDiceParts}</span>
                                <span class="part-total">${diceTotal}</span>
                            </header>
                            <ol class="dice-rolls">
                                ${diceList}
                            </ol>
                        </div>
                    </section>`    
        
            return acc;
        }, ``);
        acc  += `
            <div>${roll.flavor}</div>
            <div class="dice-roll">
                <div class="dice-result">
                    <div class="dice-formula">${rollFormula}</div>
                    <div class="dice-tooltip" style="display:none;">
                        ${section}
                    </div>
                    <h4 class="dice-total">${roll.roll.total}</h4>
                </div>
            </div>
        `;
        return acc;
    }, '');
    for(let roll of rollArray) {
        game.dice3d?.showForRoll(roll.roll);
    }
    await ChatMessage.create({content});
    return rollArrayResults;
}
//lets try it with a stat array for a 5e character.
const results = await makeChatFromRolls([
    {formula: "4d6dl1", flavor: "Roll 1:"}, 
    {formula: "4d6dl1", flavor: "Roll 2:"}, 
    {formula: "4d6dl1", flavor: "Roll 3:"},
    {formula: "4d6dl1", flavor: "Roll 4:"},
    {formula: "4d6dl1", flavor: "Roll 5:"}, 
    {formula: "4d6dl1", flavor: "Roll 6:"}
]);
//ChatMessage.create({content: results.reduce((acc,e, i) => acc += `${i+1}: ${e}<br>`,`Results:<br>`)});
