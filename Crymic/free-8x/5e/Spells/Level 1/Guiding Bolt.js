// Adds light and sparkling effect on to the target
const lastArg = args[args.length - 1];
const target = canvas.tokens.get(lastArg.tokenId);    
if(args[0] === "on"){
await target.update({"dimLight": 10, "brightLight": 5, "lightColor": "#d6fcff", "lightAlpha" : 0.09, lightAnimation: {intensity : 3, speed : 3, type : "torch"}});
let params = [{
    filterType: "globes",
    filterId: "glowingGlobes",
    enabled: true,
    time: 0,
    color: 0x5099DD,
    distortion: 0.4,
    scale: 80,
    alphaDiscard: false,
    zOrder: 1,
    animated :
    {
      time : 
      { 
        active: true, 
        speed: 0.0005, 
        animType: "move" 
      }
    }
}];
await TokenMagic.addUpdateFilters(target, params);    
}
if(args[0] === "off"){
await target.update({"dimLight": 0, "brightLight": 0, "lightColor": ""});
let params = [{ 
	 filterType: "globes",
    filterId: "glowingGlobes",
	 enabled: false
}];
await TokenMagic.addUpdateFilters(target, params);     
}
