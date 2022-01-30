// Item macro, Midi-qol On Use. This handles damage, so remove it from the spell card. This macro is for RAW damage, not RAI.
async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
const actorD = game.actors.get(args[0].actor._id);
const tokenD = canvas.tokens.get(args[0].tokenId);
const itemD = args[0].item;
const itemUuid = await fromUuid(args[0].uuid);
const damageType = "force";
let level = 2 + Number(args[0].spellLevel);
if (args[0].targets.length === 1) {
    let target = canvas.tokens.get(args[0].targets[0].id);
    let damage_target = [];
    let damageRoll = new Roll(`1d4+1`).evaluate({ async: false });
    let totalDamage = new Roll(`${level}*${damageRoll.total}`).evaluate({ async: false }).total;
    game.dice3d?.showForRoll(damageRoll);
    MidiQOL.applyTokenDamage([{ damage: totalDamage, type: damageType }], totalDamage, new Set([target]), itemUuid, new Set());
    damage_target.push(`<div class="midi-qol-flex-container"><div>hits</div><div class="midi-qol-target-npc midi-qol-target-name" id="${target.id}"> ${target.name}</div><div><img src="${target.data.img}" width="30" height="30" style="border:0px"></div></div>`);
    async function hitList() {
        let damage_list = damage_target.join('');
        let damage_results = `<div><div class="midi-qol-nobox">${damage_list}</div></div>`;
        let chatMessage = await game.messages.get(args[0].itemCardId);
        let content = await duplicate(chatMessage.data.content);
        let searchString = /<div class="midi-qol-hits-display">[\s\S]*<div class="end-midi-qol-hits-display">/g;
        let replaceString = `<div class="midi-qol-hits-display"><div class="end-midi-qol-hits-display">${damage_results}`;
        content = await content.replace(searchString, replaceString);
        await chatMessage.update({ content: content });
    }
    async function rollList() {
        let damage_results = `<div style="text-align:center">(${CONFIG.DND5E.damageTypes[damageType]})</div><div class="dice-roll"><div class="dice-result"><div class="dice-formula">${damageRoll.formula} x ${level}</div><div class="dice-tooltip"><section class="tooltip-part"><div class="dice"><header class="part-header flexrow"><span class="part-formula">${damageRoll.formula}</span><span class="part-total">${damageRoll.total}</span></header><ol class="dice-rolls"><li class="roll die d${damageRoll.dice[0].faces}">${damageRoll.total}</li></ol></div></section></div><h4 class="dice-total">${totalDamage}</h4></div></div>`;
        let chatMessage = await game.messages.get(args[0].itemCardId);
        let content = await duplicate(chatMessage.data.content);
        let searchString = /<div class="midi-qol-other-roll">[\s\S]*<div class="end-midi-qol-other-roll">/g;
        let replaceString = `<div class="midi-qol-other-roll"><div class="end-midi-qol-other-roll">${damage_results}`;
        content = await content.replace(searchString, replaceString);
        await chatMessage.update({ content: content });
    }
    rollList();
    await wait(600);
    hitList();
}
if (args[0].targets.length > 1) {
    let targetList = "";
    let all_targets = args[0].targets;
    for (let target of all_targets) {
        targetList += `<tr><td>${target.name}</td><td><input type="num" id="target" min="0" max="${level}" name="${target.id}"></td></tr>`;
    }
    let the_content = `<p>You have currently <b>${level}</b> total ${itemD.name} bolts.</p><form class="flexcol"><table width="100%"><tbody><tr><th>Target</th><th>Number Bolts</th></tr>${targetList}</tbody></table></form>`;
    new Dialog({
        title: `${itemD.name} Damage`,
        content: the_content,
        buttons: {
            damage: {
                label: "Damage", callback: async (html) => {
                    let spentTotal = 0;
                    let selected_targets = html.find('input#target');
                    for (let get_total of selected_targets) {
                        spentTotal += Number(get_total.value);
                    }
                    if (spentTotal > level) return ui.notifications.error(`The spell fails, You assigned more bolts then you have.`);
                    if (spentTotal === 0) return ui.notifications.error(`The spell fails, No bolts spent.`);
                    let damage_target = [];
                    let damageRoll = new Roll(`1d4+1`).evaluate({ async: false });
                    game.dice3d?.showForRoll(damageRoll);
                    for (let selected_target of selected_targets) {
                        let damageNum = selected_target.value;
                        if (damageNum != null) {
                            let target_id = selected_target.name;
                            let get_target = canvas.tokens.get(target_id);
                            let totalDamage = new Roll(`${damageNum} * ${damageRoll.total}`).evaluate({ async: false }).total;
                            MidiQOL.applyTokenDamage([{ damage: totalDamage, type: damageType }], totalDamage, new Set([get_target]), itemUuid, new Set());
                            damage_target.push(`<div class="midi-qol-flex-container"><div>hits</div><div class="midi-qol-target-npc midi-qol-target-name" id="${get_target.id}"> ${get_target.name} [x${damageNum}|<b>${totalDamage}</b>]</div><div><img src="${get_target.data.img}" width="30" height="30" style="border:0px"></div></div>`);
                        }
                    }
                    async function hitList() {
                        let damage_list = damage_target.join('');
                        let damage_results = `<div><div class="midi-qol-nobox">${damage_list}</div></div>`;
                        let chatMessage = await game.messages.get(args[0].itemCardId);
                        let content = await duplicate(chatMessage.data.content);
                        let searchString = /<div class="midi-qol-hits-display">[\s\S]*<div class="end-midi-qol-hits-display">/g;
                        let replaceString = `<div class="midi-qol-hits-display"><div class="end-midi-qol-hits-display">${damage_results}`;
                        content = await content.replace(searchString, replaceString);
                        await chatMessage.update({ content: content });
                    }

                    async function rollList() {
                        let damage_results = `<div style="text-align:center">(${CONFIG.DND5E.damageTypes[damageType]})</div><div class="dice-roll"><div class="dice-result"><div class="dice-formula">${damageRoll.formula}</div><div class="dice-tooltip"><section class="tooltip-part"><div class="dice"><header class="part-header flexrow"><span class="part-formula">${damageRoll.formula}</span><span class="part-total">${damageRoll.total}</span></header><ol class="dice-rolls"><li class="roll die d${damageRoll.dice[0].faces}">${damageRoll.total}</li></ol></div></section></div><h4 class="dice-total">${damageRoll.total}</h4></div></div>`;
                        let chatMessage = await game.messages.get(args[0].itemCardId);
                        let content = await duplicate(chatMessage.data.content);
                        let searchString = /<div class="midi-qol-other-roll">[\s\S]*<div class="end-midi-qol-other-roll">/g;
                        let replaceString = `<div class="midi-qol-other-roll"><div class="end-midi-qol-other-roll">${damage_results}`;
                        content = await content.replace(searchString, replaceString);
                        await chatMessage.update({ content: content });
                    }
                    rollList();
                    await wait(600);
                    hitList();
                }
            }
        },
        default: "damage"
    }).render(true);
}
