const key = "something.something" 
// replace with appropriate key... can find the key by typing in the console: game.packs
// You have to find your compendium in the list of compendia you have.
const compendium = game.packs.get(key); 
let i = 0;
const compendiumContents = compendium.index.map(e => {
    i++;
    return {
        text: e.name,
        type: CONST.TABLE_RESULT_TYPES.COMPENDIUM,
        collection: key,
        resultId: e.id,
        img: e.img,
        weight: 1,
        range: [i, i],
        drawn: false
    }
});
RollTable.create({
    name: compendium.metadata.label,
    description: `All entries from the ${compendium.metadata.label} compendium`,
    results: compendiumContents,
    formula: `1d${compendiumContents.length}`
});
