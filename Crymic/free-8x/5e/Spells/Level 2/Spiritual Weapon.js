// top pprtion is for Midi-qol Item Macro On Use.
// You need to make a npc called "Spiritual Weapon".
// Set the spell to make a 5 feet Cube as the target.
(async()=>{
    console.log(args[0]);
    const weapon = `Spiritual Weapon`;
    const caster = args[0].actor.name;
    let target = game.actors.getName(weapon);
    let summon = duplicate(target.data.token);
    let location = await canvas.templates.get(args[0].templateId);
    let snap = await canvas.grid.getSnappedPosition(location.x, location.y, 1);
    summon.name = `${weapon} ${caster}`;
    summon.x = snap.x;
    summon.y = snap.y;
    await canvas.tokens.createMany(summon);
    await location.delete();
    game.Gametime.doIn({minutes:1}, async () => {
        let find_summons = canvas.tokens.placeables.find(t=>t.name=== `${weapon} ${caster}`);
        if (find_summons){
            await canvas.tokens.deleteMany(find_summons.data._id);
        }
    });
})();


//#########
// hotbar macro portion,this detects if the weapon has been summoned or not.
//########
(async()=>{
    let weapon = "Spiritual Weapon";
    if (canvas.tokens.placeables.find(t=>t.name=== weapon)){
        canvas.tokens.placeables.find(t=>t.name=== weapon).actor.items.filter(i=> i.data.type === "weapon")[0].roll();
    } else {
    await game.dnd5e.rollItemMacro("Spiritual Weapon");
    }
})();
