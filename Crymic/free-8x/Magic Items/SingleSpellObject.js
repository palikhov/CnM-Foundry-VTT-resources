// Midi-qol quick grab for wands with 1 spell on them.
(async ()=>{
let itemD = await args[0].item;
let magicD = itemD.flags.magicitems;
await MagicItems.roll(itemD.name, magicD.spells[0].name);
})();
