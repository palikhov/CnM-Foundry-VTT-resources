// uses TokenMagicFX callback macro, which should be a GM macro.
let params =
[{
    filterType: "fire",
    filterId: "onFire",
    autoDestroy: true,
    color: 0xFFFFFF,
    time: 0,
    blend: 2,
    intensity: 1,    
    animated :
    {
      time : 
      { 
        active: true, 
	    loops: 1,
        loopDuration: 1000,
        speed: -0.0024, 
        animType: "move" 
      }
    }
}];

let TokenMagicFX = game.macros.getName("TokenMagicFX");
let target = canvas.tokens.get(args[0].hitTargets[0]._id).id;
// when ready to apply the effect
TokenMagicFX.execute(target, params);
