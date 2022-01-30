async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
const { spellLevel, macroActorId, environmentType, summonLocation, userId } = args[0];     
let macroActor = game.actors.get(macroActorId);
// Obtain the correct Actor from the Actor directory 
let summonedActor  = game.actors.getName("Fey Spirit Template");
// Determining the items to go onto the token.
let feyStep = duplicate(game.items.getName("Fey Step (Summons)"));
let feySword = duplicate(game.items.getName("Fey Shortsword (Summons)"));
let multiAttack = duplicate(game.items.getName("Multiattack (Summons)"));
multiAttack.data.description.value = `<p>When making an attack this Spirit makes ${Math.floor(spellLevel/2)} Shortsword attack(s).</p>`;
let feyName = "Fey Spirit"
// Duplicate its data for creating the correct token, with correct data
let summonedActorData = summonedActor.data;
let summonedToken = duplicate(summonedActorData.token);
let spellAttackMod = macroActor.data.data.abilities.wis.mod + macroActor.data.data.attributes.prof;
// Making sure each of the three emotionss gets the right feature options a.o.
switch (environmentType){
    case "fuming":
        feyStep.data.description.value += "<p>The fey has advantage on the next attack roll it makes before the end of this turn.</p>"
        feyName = "Fuming " + feyName;
        break;
    case "mirthful":
        feyStep.data.description.value += "<p>The fey can force one creature it can see within 10 feet of it to make a Wisdom saving throw against your spell save DC. Unless the save succeeds, the target is charmed by you and the fey for 1 minute or until the target takes any damage.</p>"
        feyName = "Mirthful " + feyName;
        break;
    case "tricksy":
        feyStep.data.description.value += "<p>The fey has advantage on the next attack roll it makes before the end of this turn.</p>"
        feyName = "Tricksy " + feyName;
        break;
}
// Creating the actual token for the player
let [createdToken] = await canvas.scene.createEmbeddedDocuments("Token", [summonedToken]);
await wait(500)
// Updating the actor data of the newly made token to conform to the above specified updates.
let permission = duplicate(createdToken.actor.data.permission);
permission[userId] = 3;
let updates = {
    "name"                              : feyName,
    "img"                               : "worlds/homebrew/Tokens/Creatures/fey_spirit.png",
    "_id"                               : createdToken.id,
    "actorData.permission"              : permission,
    "actorData.data.attributes.hp.value": 30 + 10 * (spellLevel - 3),
    "actorData.data.attributes.hp.max"  : 30 + 10 * (spellLevel - 3),
    "actorData.data.attributes.ac.value": 12 + spellLevel,
    "actorData.data.bonuses.mwak.attack": spellAttackMod,
    "actorData.data.bonuses.mwak.damage": 3 + spellLevel,
    "actorData.img"                     : "worlds/homebrew/Tokens/Creatures/fey_spirit.png",
    "actorData.data.attributes.movement": {burrow: 0, climb: 0, fly: 0, swim: 0, walk: 40, units: "ft", hover: false},
    "actorData.items"                   : [multiAttack, feyStep, feySword],
    "scale"                             : summonLocation[2] * 0.7,
    "x"                                 : summonLocation[0] + 20,
    "y"                                 : summonLocation[1] + 20
};
await canvas.scene.updateEmbeddedDocuments("Token", [updates], {animate : false});
await createdToken.actor.update({name: feyName});
