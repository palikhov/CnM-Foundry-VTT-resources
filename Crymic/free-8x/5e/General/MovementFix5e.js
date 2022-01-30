//Fix for all npcs
game.actors.updateAll(a => ({
    "data.attributes.movement.walk": 30
}), a => a.data.type === "npc");


// Fix for Characters
for player characters you can just alter it to
game.actors.updateAll(a => ({
    "data.attributes.movement.walk": 30
}), a => a.data.type === "character");
