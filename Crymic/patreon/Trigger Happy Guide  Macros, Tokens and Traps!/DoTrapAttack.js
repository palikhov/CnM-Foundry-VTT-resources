// Execute as GM.
let tactor = game.actors.entities.find(a => a.name === args[0]);
if (!tactor) return `/Whisper GM "DoTrap: Target token ${args[0]} not found"`;
let item = tactor.items.find(i=>  i.name === args[1]);
if (!item) return `/Whisper GM "DoTrap: Item ${args[1]} not found"`;
let oldTargets = game.user.targets;
game.user.targets = new Set().add(token);
let trapToken = canvas.tokens.placeables.find(t=>t.name === args[2]);
new MidiQOL.TrapWorkflow(tactor, item, [token], trapToken.center);
if (trapToken) await trapToken.update({"hidden" : false});