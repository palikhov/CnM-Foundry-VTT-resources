// Toss this in with any spell that uses Concentrating.. This is  a GM macro. Make sure to give all players permission to access it.
// in DAE choose "Macro Execute" in the value "Concentrating" @actor
(async ()=>{
    if (args[0]==="off"){
        let target = await canvas.tokens.placeables.find(t=>t.name===args[1].name);
        await game.cub.removeCondition("Concentrating", target, {warn: false});
    }
})();