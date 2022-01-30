async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
const { spellLevel, macroActorId, environmentType, summonLocation, userId } = args[0]; 

let macroActor = game.actors.get(macroActorId);
// Obtain the correct Actor from the Actor directory 
let summonedActor  = game.actors.getName("Bestial Spirit Template");
// Determining the items to go onto the token.
let packTactics    = duplicate(game.items.getName("Pack Tactics"));
let waterBreathing = duplicate(game.items.getName("Water Breathing"));
let flyBy          = duplicate(game.items.getName("Fly By"));
let maul           = duplicate(game.items.getName("Maul (Spirit Beast)"));
let multiAttack    = duplicate(game.items.getName("Multiattack (Summons)"));
multiAttack.data.description.value = `<p>When making an attack this Spirit makes ${Math.floor(spellLevel/2)} Maul attack(s).</p>`;
// Duplicate its data for creating the correct token, with correct data
let summonedToken = duplicate(summonedActor.data.token);
let spellAttackMod = macroActor.data.data.abilities.wis.mod + macroActor.data.data.attributes.prof;

// Setup the updates to the token for later.
let updates = {};
let [createdToken] = await game.scenes.viewed.createEmbeddedDocuments("Token", [summonedToken]);
await wait(500);
let permission = duplicate(createdToken.actor.data.permission);
permission[userId] = 3;
    // Making sure each of the three environmentTypes gets the right attributes a.o.
switch (environmentType){
    case "air":
        updates = {    
            "actorData.data.attributes.hp.value": 20 + 5 * (spellLevel - 2),
            "actorData.data.attributes.hp.max"  : 20 + 5 * (spellLevel - 2),
            "actorData.data.attributes.ac.value": 11 + spellLevel,
            "actorData.data.bonuses.mwak.attack": spellAttackMod,
            "actorData.data.bonuses.mwak.damage": 4 + spellLevel,
            "actorData.img"                     : "worlds/homebrew/Tokens/Creatures/air_spirit_beast.png",
            "actorData.data.attributes.movement": {burrow: 0, climb: 0, fly: 60, swim: 0, walk: 30, units: "ft", hover: false},
            "actorData.items"                   : [maul, multiAttack, flyBy],
            "actorData.permission"              : permission,
            "scale"                             : summonLocation[2],
            "x"                                 : summonLocation[0] + 20,
            "y"                                 : summonLocation[1] + 20,
            "img"                               : "worlds/homebrew/Tokens/Creatures/air_spirit_beast.png"      
        };
        break;
    case "land":
        updates = {    
            "actorData.data.attributes.hp.value": 30 + 5 * (spellLevel - 2),
            "actorData.data.attributes.hp.max"  : 30 + 5 * (spellLevel - 2),
            "actorData.data.attributes.ac.value": 11 + spellLevel,
            "actorData.data.bonuses.mwak.attack": spellAttackMod,
            "actorData.data.bonuses.mwak.damage": 4 + spellLevel,
            "actorData.img"                     : "worlds/homebrew/Tokens/Creatures/land_spirit_beast.png",
            "actorData.data.attributes.movement": {burrow: 0, climb: 30, fly: 0, swim: 0, walk: 30, units: "ft", hover: false},
            "actorData.items"                   : [maul, multiAttack, packTactics],
            "actorData.permission"              : permission,
            "scale"                             : summonLocation[2],
            "x"                                 : summonLocation[0] + 20,
            "y"                                 : summonLocation[1] + 20,
            "img"                               : "worlds/homebrew/Tokens/Creatures/land_spirit_beast.png" 
        };
        
        break;
    case "water":
        updates = {    
            "actorData.data.attributes.hp.value": 30 + 5 * (spellLevel - 2),
            "actorData.data.attributes.hp.max"  : 30 + 5 * (spellLevel - 2),
            "actorData.data.attributes.ac.value": 11 + spellLevel,
            "actorData.data.bonuses.mwak.attack": spellAttackMod,
            "actorData.data.bonuses.mwak.damage": 4 + spellLevel,
            "actorData.img"                     : "worlds/homebrew/Tokens/Creatures/water_spirit_beast.png",
            "actorData.data.attributes.movement": {burrow: 0, climb: 0, fly: 0, swim: 30, walk: 30, units: "ft", hover: false},
            "actorData.items"                   : [maul, multiAttack, waterBreathing, packTactics],
            "actorData.permission"              : permission,
            "scale"                             : summonLocation[2],
            "x"                                 : summonLocation[0] + 20,
            "y"                                 : summonLocation[1] + 20,
            "img"                               : "worlds/homebrew/Tokens/Creatures/water_spirit_beast.png"
        };
        break;
}
updates.name = "Bestial Spirit";
updates._id = createdToken.id;
// Updating the actor data of the newly made token to conform to the above specified updates.
await canvas.scene.updateEmbeddedDocuments("Token", [updates], {animate : false});
await createdToken.actor.update({name: "Bestial Spirit"});
