async function diceRolls() {
    let roll = [];
    for(let i=0; i < 4; i++) {
        let evaluated = await new Roll(`1d6`).evaluate({async: true})
        roll.push(evaluated.total);
    }
    let indexOfMinValue = roll.reduce((iMin, x, i, arr) => x < arr[iMin] ? i : iMin, 0);
    return [roll, indexOfMinValue];
}

let messageContent = `  <p style="font-size: 30px;">Roll for stats: ${speaker.alias}</p>
                        <hr />
                        <table style="width: 100%; height: 96px;" border="1">
                        <tbody>
                        <tr style="height: 16px;">
                        <td style="width: 16.66%; height: 16px;">Dice 1</td>
                        <td style="width: 16.66%; height: 16px;">Dice 2</td>
                        <td style="width: 16.66%; height: 16px;">Dice 3</td>
                        <td style="width: 16.66%; height: 16px;">Dice 4</td>
                        <td style="width: 16.66%; height: 16px;">total</td>
                        <td style="width: 16.66%; height: 16px;">mod</td>
                        </tr>`;
                        
for (let i=0; i < 6; i++) {
    let myResult = await diceRolls();
    let myRoll = myResult[0];
    let indexOfDropped = myResult[1];
    let myColors =[];
    myColors[indexOfDropped] = "gray";
    let totalRoll = myRoll.reduce(function(a, b){return a + b;}, 0) - myRoll[indexOfDropped];
    messageContent += ` <tr style="height: 16px;">
                        <td style="width: 16.66%; height: 16px; color: ${myColors[0]}">${myRoll[0]}</td>
                        <td style="width: 16.66%; height: 16px; color: ${myColors[1]}">${myRoll[1]}</td>
                        <td style="width: 16.66%; height: 16px; color: ${myColors[2]}">${myRoll[2]}</td>
                        <td style="width: 16.66%; height: 16px; color: ${myColors[3]}">${myRoll[3]}</td>
                        <td style="width: 16.66%; height: 16px;">${totalRoll}</td>
                        <td style="width: 16.66%; height: 16px;">${Math.floor((totalRoll-10)/2)}</td>
                        </tr>`;
}

messageContent += `     </tbody>
                        </table>`;


ChatMessage.create({content: messageContent});
