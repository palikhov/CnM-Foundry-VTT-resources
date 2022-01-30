const { spellLevel, macroActorId, environmentType, summonLocation, userId } = args[0];     
let macroActor = game.actors.get(macroActorId);
// Obtain the correct Actor from the Actor directory 
let summonedActor  = game.actors.getName("Elemental Spirit Template");
// Determining the items to go onto the token.
let amorForm       = duplicate(game.items.getName("Amorphous Form (Spirit Elemental)"));
let slam           = duplicate(game.items.getName("Slam (Spirit Elemental)"));
let multiAttack    = duplicate(game.items.getName("Multiattack (Summons)"));
multiAttack.data.description.value = `<p>When making an attack this Elemental Spirit makes ${Math.floor(spellLevel/2)} Slam attack(s).</p>`;
// Duplicate its data for creating the correct token, with correct data
let summonedToken = duplicate(summonedActor.data.token);
let spellAttackMod = macroActor.data.data.abilities.wis.mod + macroActor.data.data.attributes.prof;
let [createdToken] = await canvas.scene.createEmbeddedDocuments("Token", [summonedToken]);
// the updating process starts here.
let updates = {};
// Making sure each of the three environmentTypes gets the right attributes a.o.
let elemName = "";
let permission = duplicate(createdToken.actor.data.permission);
permission[userId] = 3;
switch (environmentType){
    case "fire":
        elemName = "Fire Elemental Spirit";
        slam.data.damage.parts = [["1d10", "fire"]];
        updates = {
            "_id"                               : createdToken.id,
            "actorData.data.attributes.hp.value": 50 + 10 * (spellLevel - 4),
            "actorData.data.attributes.hp.max"  : 50 + 10 * (spellLevel - 4),
            "actorData.data.attributes.ac.value": 11 + spellLevel,
            "actorData.data.traits.di.value"    : ["fire", "poison"],
            "actorData.data.bonuses.mwak.attack": spellAttackMod,
            "actorData.data.bonuses.mwak.damage": 4 + spellLevel,
            "actorData.img"                     : "worlds/homebrew/Tokens/Creatures/Fire_Elemental.png",
            "actorData.data.attributes.movement": { burrow: 0, climb: 0, fly: 0, swim: 0, walk: 40, units: "ft", hover: false },
            "actorData.items"                   : [slam, amorForm, multiAttack],
            "actorData.permission"              : permission,
            "name"                              : "Elemental Spirit",
            "scale"                             : summonLocation[2],
            "x"                                 : summonLocation[0] + 20,
            "y"                                 : summonLocation[1] + 20,
            "img"                               : "worlds/homebrew/Tokens/Creatures/Fire_Elemental.png"
        };
        break;
    case "earth":
        elemName = "Earth Elemental Spirit";
        updates = {
            "_id"                               : createdToken.id,
            "actorData.data.attributes.hp.value": 50 + 10 * (spellLevel - 4),
            "actorData.data.attributes.hp.max"  : 50 + 10 * (spellLevel - 4),
            "actorData.data.attributes.ac.value": 11 + spellLevel,
            "actorData.data.traits.di.value"    : ["poison"],
            "actorData.data.traits.dr.value"    : ["piercing", "slashing"],
            "actorData.data.bonuses.mwak.attack": spellAttackMod,
            "actorData.data.bonuses.mwak.damage": 4 + spellLevel,
            "actorData.img"                     : "worlds/homebrew/Tokens/Creatures/Earth_Elemental.png",
            "actorData.data.attributes.movement": { burrow: 40, climb: 0, fly: 0, swim: 0, walk: 40, units: "ft", hover: true },
            "actorData.items"                   : [slam, multiAttack],
            "actorData.permission"              : permission,
            "name"                              : "Elemental Spirit",
            "scale"                             : summonLocation[2],
            "x"                                 : summonLocation[0] + 20,
            "y"                                 : summonLocation[1] + 20,
            "img"                               : "worlds/homebrew/Tokens/Creatures/Earth_Elemental.png"
        };
        break;
    case "air":
        elemName = "Air Elemental Spirit";
        updates = {
            "_id"                               : createdToken.id,
            "actorData.data.attributes.hp.value": 50 + 10 * (spellLevel - 4),
            "actorData.data.attributes.hp.max"  : 50 + 10 * (spellLevel - 4),
            "actorData.data.attributes.ac.value": 11 + spellLevel,
            "actorData.data.traits.di.value"    : ["poison"],
            "actorData.data.traits.dr.value"    : ["lightning", "thunder"],
            "actorData.data.bonuses.mwak.attack": spellAttackMod,
            "actorData.data.bonuses.mwak.damage": 4 + spellLevel,
            "actorData.img"                     : "worlds/homebrew/Tokens/Creatures/Air_Elemental.png",
            "actorData.data.attributes.movement": { burrow: 0, climb: 0, fly: 0, swim: 0, walk: 40, units: "ft", hover: true },
            "actorData.items"                   : [slam, amorForm, multiAttack],
            "actorData.permission"              : permission,
            "name"                              : "Elemental Spirit",
            "scale"                             : summonLocation[2],
            "x"                                 : summonLocation[0] + 20,
            "y"                                 : summonLocation[1] + 20,
            "img"                               : "worlds/homebrew/Tokens/Creatures/Air_Elemental.png"
        };
        break;
    case "water":
        elemName = "Water Elemental Spirit";
        updates = {
            "_id"                               : createdToken.id,
            "actorData.data.attributes.hp.value": 50 + 10 * (spellLevel - 4),
            "actorData.data.attributes.hp.max"  : 50 + 10 * (spellLevel - 4),
            "actorData.data.attributes.ac.value": 11 + spellLevel,
            "actorData.data.traits.di.value"    : ["poison"],
            "actorData.data.traits.dr.value"    : ["acid"],
            "actorData.data.bonuses.mwak.attack": spellAttackMod,
            "actorData.data.bonuses.mwak.damage": 4 + spellLevel,
            "actorData.img"                     : "worlds/homebrew/Tokens/Creatures/Water_Elemental.png",
            "actorData.data.attributes.movement": {burrow: 0, climb: 0, fly: 0, swim: 40, walk: 40, units: "ft", hover: false},
            "actorData.items"                   : [slam, amorForm, multiAttack],
            "actorData.permission"              : permission,
            "name"                              : "Elemental Spirit",
            "scale"                             : summonLocation[2],
            "x"                                 : summonLocation[0] + 20,
            "y"                                 : summonLocation[1] + 20,
            "img"                               : "worlds/homebrew/Tokens/Creatures/Water_Elemental.png"
        };
        break;
}
// Updating the actor data of the newly made token to conform to the above specified updates.
await canvas.scene.updateEmbeddedDocuments("Token", [updates], {animate : false});
await createdToken.actor.update({name: elemName});
