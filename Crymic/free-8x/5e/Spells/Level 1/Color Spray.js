//################################################################
// READ FIRST
// based on @ccjmk macro for sleep.
// Midi-qol "On Use"
// Uses Damage roll on item, set damage to "no damage"
// Uses Cub_Condition macro found in callback directory
//################################################################

async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
const colorHp = await args[0].damageTotal;
if (!colorHp) return ui.notifications.error("No arguments passed to Color Spray macro");
console.log(`Color Spray => Avaiable HP Pool [${colorHp}] points`);
let targets = await args[0].targets.filter(i=> i.actor.data.data.attributes.hp.value != 0).sort((a, b) => canvas.tokens.get(a.id).actor.data.data.attributes.hp.value < canvas.tokens.get(b.id).actor.data.data.attributes.hp.value ? -1 : 1);
let remainingColorHp = colorHp;
const condition = "Blinded";
let color_target = [];

for (let target of targets) {    
    let find_target = await canvas.tokens.get(target.id);    
    let immune_ci = find_target.actor.data.data.traits.ci.value.find(i=> i === condition.toLowerCase());
    let blinded = find_target.actor.effects.find(i=> i.data.label === condition);
    let targetHpValue = find_target.actor.data.data.attributes.hp.value;
    if ((immune_ci) || (blinded)) {
        console.log(`Color Spray Results => Target: ${target.name} | HP: ${targetHpValue} | Status: Resists`);
        color_target.push(`<div class="midi-qol-flex-container"><div>resists</div><div class="midi-qol-target-npc midi-qol-target-name" id="${find_target.id}"> ${find_target.name}</div><div><img src="${find_target.data.img}" width="30" height="30" style="border:0px"></div></div>`);
        continue;
    }
    if (remainingColorHp > targetHpValue) {
        remainingColorHp -= targetHpValue;
        console.log(`Color Spray Results => Target: ${target.name} |  HP: ${targetHpValue} | HP Pool: ${remainingColorHp} | Status: ${condition}`);
        color_target.push(`<div class="midi-qol-flex-container"><div>hits</div><div class="midi-qol-target-npc midi-qol-target-name" id="${find_target.id}"> ${find_target.name}</div><div><img src="${find_target.data.img}" width="30" height="30" style="border:0px"></div></div>`);
        let gameRound = game.combat ? game.combat.round : 0;
        let effectData = [{
                label: condition,
                icon: "modules/combat-utility-belt/icons/blinded.svg",
                origin: args[0].uuid,
                disabled: false,
                duration: { rounds: 1, turns: 2, seconds: 60, startRound: gameRound, startTime: game.time.worldTime },
                changes: [
                    { key: `flags.midi-qol.grants.advantage.attack.all`, mode: 2, value: 1, priority: 20 },
                    { key: `flags.midi-qol.disadvantage.attack.all`, mode: 2, value: 1, priority: 20 }
                ]
            }];
        await MidiQOL.socket().executeAsGM("createEffects", { actorUuid: find_target.actor.uuid, effects: effectData });
        continue;
    } else {
        console.log(`Color Spray Results => Target: ${target.name} | HP: ${targetHpValue} | HP Pool: ${remainingColorHp - targetHpValue} | Status: Missed`);
        color_target.push(`<div class="midi-qol-flex-container"><div>misses</div><div class="midi-qol-target-npc midi-qol-target-name" id="${find_target.id}"> ${find_target.name}</div><div><img src="${find_target.data.img}" width="30" height="30" style="border:0px"></div></div>`);
    }
}
await wait(500);
let color_results = `<div><div class="midi-qol-nobox">${color_target.join('')}</div></div>`;
let chatMessage = game.messages.get(args[0].itemCardId);
let content = duplicate(chatMessage.data.content);
let searchString = /<div class="midi-qol-hits-display">[\s\S]*<div class="end-midi-qol-hits-display">/g;
let replaceString = `<div class="midi-qol-hits-display"><div class="end-midi-qol-hits-display">${color_results}`;
content = await content.replace(searchString, replaceString);
await chatMessage.update({ content: content });
