// Use Dynamic Effects with About time with Macro Execute "Light Spell" @target
// Change lightColor to meet your needs.
let target = canvas.tokens.get(args[1])
if (args[0] === "on") {
target.update({"dimLight": 60, "brightLight": 30, "lightAlpha" : 0.09,  "lightColor": "#d6fcff", lightAnimation: {intensity : 1, speed : 1, type : "torch"}});
}
else {
target.update({"dimLight": 0, "brightLight": 0, "lightColor": "",});     
}