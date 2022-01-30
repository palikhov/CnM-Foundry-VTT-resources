let target = canvas.tokens.get(lastArg.tokenId);
if (args[0] === "on") {
let params =
[{
    filterType: "zapshadow",
    filterId: "myZap",
    enabled: true,
    alphaTolerance: 0.45
},{
    filterType: "field",
    filterId: "myFireField",
    enabled: true,
    shieldType: 1,
    gridPadding: 3,
    color: 0x6dcff6,
    time: 0,
    blend: 2,
    intensity: 1,
    lightAlpha: 1,
    lightSize: 0.7,
    scale: 1,
    radius: 1,
    chromatic: false,
    discardThreshold: 0.9,
    hideRadius: 0.98,
    alphaDiscard: true,
    animated :
    {
      time : 
      { 
        active: true, 
        speed: 0.0015, 
        animType: "move" 
      }
    }
}];
TokenMagic.addUpdateFilters(target, params);
}
if (args[0] === "off") {
let params = [{
    filterType: "zapshadow",
    filterId: "myZap",
enabled: false,
},{
filterType: "field",
    filterId: "myFireField",
enabled: false,
}];
TokenMagic.addUpdateFilters(target, params);
}
