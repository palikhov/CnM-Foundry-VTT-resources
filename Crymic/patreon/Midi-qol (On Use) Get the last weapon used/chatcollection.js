const actorD = game.actors.get(args[0].actor._id);
let weapon_names = [];
let get_weapons = actorD.items.filter(i=> i.data.type === "weapon");
for(let weapons of get_weapons){
weapon_names.push(weapons.name);
}
const attackHistory = ChatMessage.collection._source.filter(i=> i.user === game.user.id && i.flags["midi-qol"]?.actor === actorD.id && i.flags["midi-qol"]?.damageDetail && weapon_names.includes(i.flavor));