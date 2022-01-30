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
await TokenMagic.addUpdateFilters(token, params);
