async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
if(game.combat.turns.length === game.combat.current.turn + 1){
let rollList = [];
let tableList = [];
let table = {"grg":"-8", "huge":"-5", "lg":"-2", "med":"+0", "sm":"+2", "tiny":"+5"};
let combatantList = game.combat.turns;
for(let combatant of combatantList){
    let id = combatant.id;
    let target = canvas.tokens.get(combatant.token.id);
    let size = target.document.actor.data.data.traits.size;
    let adv = target.actor.data.data.flags.dnd5e.initiativeAdv ? 2 : 1;
    let alrt = target.actor.data.data.flags.dnd5e.initiativeAlert ? "+5" : "+0";
    let luck = target.actor.data.data.flags.dnd5e.halflingLucky ? "r1=1" : "";
    let sizeMod = table[size];
    let rollInt = new Roll(`${adv}d20${luck} + @abilities.dex.mod ${alrt} ${sizeMod}`, target.actor.getRollData()).evaluate({async:false});
    let intRoll = Math.max(1, rollInt.total);
    tableList.push(`<tr><td>${target.name}</td><td style="font-style: italic;font-size:12px">${rollInt.formula}</td><td style="text-align:right;" id="roll">${intRoll}</td></tr>`);
    rollList.push({_id:id, initiative: intRoll});
}
await game.combat.updateEmbeddedDocuments("Combatant", rollList);
await game.combat.nextRound();
await wait(500);
let table_results = tableList.join('');
let the_content = `<table><theader><tr><td>Name</td><td>Formula</td><td>Total</td></tr></theader><tbody>${table_results}</tbody></table>`;
let lastMsg = game.messages.filter(i=> i.data.speaker.token === null && i.data.roll == null && ["round"].some(flavor => (i.data.flavor || "").toLowerCase().includes(flavor)));
let foundMsg = lastMsg[lastMsg.length -1];
let chatMessage = await game.messages.get(foundMsg.id);
let title = foundMsg.data.flavor;
let content = await duplicate(foundMsg.data.flavor);
content = `<div style="color:black;"><h2>${title}</h2>${the_content}</div>`;
await chatMessage.update({ flavor: content });
await ui.chat.scrollBottom();
}
else await game.combat.nextTurn();
