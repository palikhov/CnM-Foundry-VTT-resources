function spiritForm(environmentType) {
    let spellLevel = args[0].spellLevel;
    let thisToken = token;
    let summonLocation = [thisToken.data.x, thisToken.data.y, thisToken.data.scale];
    let macroActorId = args[0].actor._id;
    let userId = game.userId;
    let data = {spellLevel, macroActorId, environmentType, summonLocation, userId};
    console.log(data)
    game.macros.getName("summonSpiritFey").execute(data);
}
if(!token) return ui.notifications.info("You dont have your token selected");
new Dialog({
    title: "Summon Spirit Fey",
    content: "Choose the Mood of the Spirit:",
    buttons: {
        fuming_button: {
            label: "Fuming",
            callback: () => {spiritForm("fuming")}
        },
        mirthful_button: {
            label: "Mirthful",
            callback: () => {spiritForm("mirthful")}
        },
        tricksy_button: {
            label: "Tricksy",
            callback: () => {spiritForm("tricksy")}
        },
    },
    default: "tricksy_button" 
}).render(true);
