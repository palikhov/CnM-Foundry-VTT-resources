(async()=>{
if(args[0]==="add"){
await canvas.tokens.get(args[1]).actor.setFlag(args[2], args[3], args[4]);
}
if(args[0]==="get"){
await canvas.tokens.get(args[1]).actor.getFlag(args[2], args[3], args[4]);
}
if(args[0]==="remove"){
await canvas.tokens.get(args[1]).actor.unsetFlag(args[2], args[3]);
}
})();
//usage
//let ActorFlag = game.macros.getName("ActorFlag");
//ActorFlag.execute("add | get | remove", target.id, scope, key, value);
