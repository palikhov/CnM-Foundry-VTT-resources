//args[0] = token ID
//args[1] = Name of Item in "" or update data
//args[2] = "add", "enable", "disable" or "remove"
(async()=>{
    let target = canvas.tokens.get(args[0]).actor;
    let effect = args[1];
    let type = args[2];
    if(type === "add") await target.createEmbeddedDocuments("ActiveEffect", [effect]);
    if(type === "enable") await target.updateEmbeddedDocuments("ActiveEffect", [{"_id": effect,  "disabled" : false}]);
    if(type === "disable") await target.updateEmbeddedDocuments("ActiveEffect", [{"_id": effect,  "disabled" : true}]);
    if(type === "remove") {
        let effect_id = target.effects.find(i=> i.data.label === effect).id;
        await target.deleteEmbeddedDocuments("ActiveEffect", [effect_id]);
    }
})();
//usage
// let ActiveEffect = game.macros.getName("ActiveEffect");
// ActiveEffect.execute(target, "Name of Item", "add" or "remove");
