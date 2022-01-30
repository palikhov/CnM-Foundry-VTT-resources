// Applies effect then destroies itself.
// This kinda buggy and needs more tweaking.
let target = canvas.tokens.get(args[1]);
if (args[0] === "on") {
let params =
[{
    filterType: "fog",
    color: 0x00FF50,
    autoDestroy: true,
    density: 0.20,
    time: 0,
    animated :
    {
      time : 
      { 
        active: true,
        speed: 1.2,
        loopDuration: 1200,
        loops: 1,
        animType: "move" 
      }
    }
},
{
    filterType: "ray",
    time: 0,
    autoDestroy: true,
    color: 0x00DE50,
    alpha: 0.25,
    divisor: 32,
    anchorY: 0,
    animated :
    {
       time : 
       { 
          active: true,		  
          speed: 0.0005, 
          animType: "move",
          loopDuration: 1000,
           loops: 1,
       }
    }
}
];
TokenMagic.addUpdateFilters(target, params);
}