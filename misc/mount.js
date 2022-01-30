//use: select your token you want to ride another token, target the token you want to ride and use this macro. Using this macro again will unlink the tokens.

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getTarget(targets, tokenRider) {
    if(targets.length != 1) return ui.notifications.info("you have no potential mount targeted");
    target = targets[0];
    // if (target.actor.data.type === "character") return ui.notifications.info("do not target a player character to ride, that is just rude!");  // only valid for systems like DnD5e.
    setHook(tokenRider);
    joinTogether(tokenRider, target);
    return targets[0];
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function setHook(tokenRider) {
    let hookId = Hooks.on("updateToken", tokenMove);
    await tokenRider.actor.setFlag("world", "Riding", hookId);
    ui.notifications.info(`${tokenRider.name} has mounted up!`)
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function joinTogether(tokenRider, tokenMount) {
const newX = tokenRider.center.x - ((tokenMount.data.width * canvas.scene.data.grid) / 2);
    const newY = tokenRider.center.y - ((tokenMount.data.height * canvas.scene.data.grid) / 2);
    await tokenMount.update({x: newX, y: newY});
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function unHook(tokenRider, id) {   
    Hooks.off("updateToken", id);
    tokenRider.actor.unsetFlag("world", "Riding");
    ui.notifications.info(`${tokenRider.name} has left their mount!`)
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function tokenMove(scene, token, change) {

    if(token._id === macroToken.id) {
        change._id = target.id;
        if (change.x != undefined) change.x -= (canvas.scene.data.grid * target.data.height) - (canvas.scene.data.grid * ((target.data.height/2) + 0.5));
        if (change.y != undefined) change.y -= (canvas.scene.data.grid * target.data.height) - (canvas.scene.data.grid * ((target.data.height/2) + 0.5));
        await canvas.tokens.updateMany(change);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const macroToken = canvas.tokens.controlled[0];
const hookId = await macroToken.actor.getFlag("world", "Riding");
var target;
if (!hookId) {
    getTarget(Array.from(game.user.targets), macroToken);
}
else {
    unHook(macroToken, hookId);
}
