let normal = "path/image/normal";
let power = "path/image/empowered";
let actorD = game.actors.get(args[1]._id);
let myToken = canvas.tokens.get(actorD.getActiveTokens()[0].id);
if(args[0]==="on"){
myToken.update({"img" : power, "lightAlpha": 0.25, "brightLight": 10, "dimLight": 20, lightAnimation: {intensity : 2, speed : 3, type : "torch"}});
}
if(args[0] ==="off"){
myToken.update({"img" : normal, "dimLight": 0, "brightLight": 0});
}