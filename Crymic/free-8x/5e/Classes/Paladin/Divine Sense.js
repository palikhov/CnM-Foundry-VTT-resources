// Midi-qol "On Use", Item Macro. Remove all targeting details, this handles everything.
async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
let paladin = canvas.tokens.get(args[0].tokenId);
let itemD = args[0].item;
let distance = itemD.data.range.value =! null ? itemD.data.range.value : 60;
let targets = canvas.tokens.placeables.filter(target => (canvas.grid.measureDistance(paladin.center, target.center) <= distance && paladin.id != target.id && !canvas.walls.checkCollision(new Ray(paladin.center, target.center))));
let is_good = targets.reduce((list, target) => {
    return list + (target.actor.data.data.details.alignment).toLowerCase().includes("good");
}, 0);
let is_evil = targets.reduce((list, target) => {
    return list + (target.actor.data.data.details.alignment).toLowerCase().includes("evil");
}, 0);
let is_celestial = targets.reduce((list, target) => {
    return list + (target.actor.data.data.details?.type?.value || target.actor.data.data.details?.race).toLowerCase().includes("celestial");
}, 0);
let is_fiend = targets.reduce((list, target) => {
    return list + (target.actor.data.data.details?.type?.value || target.actor.data.data.details?.race).toLowerCase().includes("fiend");
}, 0);
let is_undead = targets.reduce((list, target) => {
    return list + (target.actor.data.data.details?.type?.value || target.actor.data.data.details?.race).toLowerCase().includes("undead");
}, 0);
let totalCount = Number(is_good + is_evil + is_celestial + is_fiend + is_undead);
await wait(300);
let the_message = `<table border="1" style="text-align:center;"><thead><tr><th>Type</th><th>Found</th></tr></thead><tbody><tr><td>Undead</td><td>${is_undead}</td></tr><tr><td>Fiends</td><td>${is_fiend}</td></tr><tr><td>Celestials</td><td>${is_celestial}</td></tr><tr><td>Good Alignment</td><td>${is_good}</td></tr><tr><td>Evil Alignment</td><td>${is_evil}</td></tr></tbody><tbody style="background: rgba(0, 0, 0, 0.5);color: #f0f0e0;text-shadow: 1px 1px #000;border-bottom: 1px solid #000;"><tr><td>Total Sensed</td><td>${totalCount}</td></tr></tbody></table>`;
let chatMessage = game.messages.get(args[0].itemCardId);
let content = duplicate(chatMessage.data.content);
let searchString = /<div class="midi-qol-saves-display">[\s\S]*<div class="end-midi-qol-saves-display">/g;
let replaceString = `<div class="midi-qol-saves-display"><div class="end-midi-qol-saves-display">${the_message}`;
content = content.replace(searchString, replaceString);
chatMessage.update({ content: content });
await wait(300);
ui.chat.scrollBottom();
