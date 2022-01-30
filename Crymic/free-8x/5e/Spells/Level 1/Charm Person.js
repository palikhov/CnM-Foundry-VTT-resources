// Thanks to Kekilla and Vance.
// Item Macro, in DE use @target @item
// Uses Token Magic FX to add a pink "breathing" charm color around the token.
const lastArg = args[args.length - 1];
const target = canvas.tokens.get(lastArg.tokenId); 
const itemD = lastArg.efData.flags.dae.itemData;

async function charmON(target) {
    let params = [{
        filterType: "glow",
        filterId: "charmZ",
        enabled: true,
        outerStrength: 4,
        innerStrength: 0,
        color: 0x5099DD,
        quality: 0.5,
        padding: 10,
        animated: {
        color: {
           active: true, 
           loopDuration: 3000, 
           animType: "colorOscillation", 
           val1:0xffabcf, 
           val2:0xff006f
            }
        }
    }];
    await TokenMagic.addUpdateFilters(target, params);
}

async function charmOff(target) {
    let params = [{
        filterType: "glow",
        filterId: "charmZ",
        enabled: false
    }];
    await TokenMagic.addUpdateFilters(target, params);
}

function healthCheck(scene, update) {
    let crtHP = update.actorData.flags.world.charmP_curtHP_hookID;
    if(crtHP - update.actorData.data.attributes.hp.value > 0) {
        let result_html = `<strong>Damage</strong> was dealt to ${target.data.name}, It is no longer under the effect of <strong>${itemD.name}</strong>.`;
        ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({token: target}),
            content: result_html
        });
        gotHurt();
    }
}

async function gotHurt() {
    const hookId = DAE.getFlag(target.actor, "charmPerson");
    Hooks.off("updateToken", hookId);
    DAE.unsetFlag(target.actor, "charmPerson");
    DAE.unsetFlag(target.actor, "charmCurtHp");
    charmOff(target);
}

if(args[0] === "on"){
    let hookId = Hooks.on("updateToken", healthCheck);
    DAE.setFlag(target.actor, "charmPerson", hookId);
    let curtHP = target.actor.data.data.attributes.hp.value;
    DAE.setFlag(target.actor, "charmCurtHp", curtHP);
    charmON(target);
}

if (args[0] === "off") {
    let hookId = DAE.getFlag(target.actor, "charmPerson");
    Hooks.off("updateToken", hookId);
    DAE.unsetFlag(target.actor, "charmPerson");
    DAE.unsetFlag(target.actor, "charmCurtHp");
    charmOff(target);
}
