let equip = async function(){
    const actorD = game.actors.get(args[0].actor._id);
    const tokenD = canvas.tokens.get(args[0].tokenId);
    const itemD = actorD.items.get(args[0].item._id);
    if(itemD.data.data.equipped){
        let vision = await DAE.getFlag(actorD, "goggleVision");
        await itemD.update({"data.equipped":false});
        await tokenD.update({"dimSight": vision, "flags.perfect-vision.monoVisionColor": null});
        await actorD.update({"data.attributes.senses.darkvision": vision});
        await DAE.unsetFlag(actorD, "goggleVision");
    } else {
        await DAE.setFlag(actorD, "goggleVision", tokenD.data.dimSight);
        await itemD.update({"data.equipped" : true});
        await tokenD.update({"dimSight" : 60, "flags.perfect-vision.monoVisionColor": "#c2ff85"});
        await actorD.update({"data.attributes.senses.darkvision": 60});
    }
}
equip();