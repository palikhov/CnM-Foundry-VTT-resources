// thanks to tposney and ^ and stick for helping me out.
// Midi-qol/Item Macro On Use.. Make the spell create a 5t feet cube template.
(async()=>{
if (game.paused) return ui.notifications.error(`The spell fails. Time is frozen, you lack the knlowedge to overcome it.`);
const caster = await canvas.tokens.get(args[0].tokenId);
let location = await canvas.templates.get(args[0].templateId);
//################################################
//If you want to block line of sight uncomment below, or just remove this whole commented section.
//################################################
//let dest = new PIXI.Point(location.x, location.y);
//let gridsize = await canvas.grid.size/2;
//let test = canvas.sight.testVisibility(dest, {tolerance:gridsize, object: [caster]});
//if(!test) return ui.notifications.error(`The spell fails, you cannot see that location.`);
let snap = await canvas.grid.getSnappedPosition(location.x, location.y, 1);
await caster.update({x: snap.x, y: snap.y}, {animate : false});
await location.delete();
})();
