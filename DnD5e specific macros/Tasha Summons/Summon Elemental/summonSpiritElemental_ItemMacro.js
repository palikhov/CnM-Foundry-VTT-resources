function spiritForm(environmentType) {
    let spellLevel = args[0].spellLevel;
    let thisToken = token;
    let summonLocation = [thisToken.data.x, thisToken.data.y, thisToken.data.scale];
    let macroActorId = actor.id;
    let userId = game.userId;
    let data = {spellLevel, macroActorId, environmentType, summonLocation, userId};
    game.macros.getName("summonSpiritElemental").execute(data);
}
if(!token) return ui.notifications.info("You dont have your token selected");
new Dialog({
    title: "Summon Spirit Elemental",
    content: "Choose the environment the Spirit is from:",
    buttons: {
        air_button: {
            label: "Air",
            callback: () => {spiritForm("air")}
        },
        fire_button: {
            label: "Fire",
            callback: () => {spiritForm("fire")}
        },
        earth_button: {
            label: "Earth",
            callback: () => {spiritForm("earth")}
        },
        water_button: {
            label: "Water",
            callback: () => {spiritForm("water")}
        }
    },
    default: "water_button" 
}).render(true);
