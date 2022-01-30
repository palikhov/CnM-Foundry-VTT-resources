//########################################################
// READ FIRST!!!!!!
// DAE macro
//########################################################
(async()=>{
    const lastArg = args[args.length-1];
    let target = canvas.tokens.get(lastArg.tokenId);
    let tactor = canvas.tokens.get(lastArg.tokenId).actor;
    if (args[0] === "on"){
        let getDs = target.data.dimSight;
        await DAE.setFlag(tactor, "dimSight", getDs);
        await target.update({"dimSight": 300});
    }
    if (args[0] === "off"){
        let restDs = DAE.getFlag(tactor, "dimSight");
        await target.update({"dimSight": restDs});
        await DAE.unsetFlag(tactor, "dimSight");
    }
})();
