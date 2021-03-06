// Macro Author: Freeze (on discord)
// Macro version: 0.2
// Foundry Version: 0.8.6+
// DnD5e Version: 1.3.5
// Prerequisites: 
// Further required: an actor to function as the Driftglobe, named "Driftglobe" (token of it should have no vision)

/////////////////////////////////////////////////Alterable constants/////////////////////////////////////////////////////////////
const dialogButtonLabel1 = "label for free floating driftglobe - light"                          // alter to your preferred label (ie. the code word for the driftglobe)
const dialogButtonLabel2 = "label for free floating driftglobe - daylight"                       // alter to your preferred label
const dialogButtonLabel3 = "label for token based driftglobe - light(covered for reduced light)" // alter to your preferred label
const dialogButtonLabel4 = "label for token based driftglobe - light"                            // alter to your preferred label
const dialogButtonLabel5 = "label for token based driftglobe - daylight"                         // alter to your preferred label
const dialogButtonLabel6 = "label for stopping all light emission on the tokens"                 // alter to your preferred label
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const dialogContent = `
<style>
    #drifting-lights-dialog .dialog-buttons {
        flex-direction: column;
        background: #FFFACD;
    }
</style>
<h2>Activate Driftglobe</h2>
<p>Choose from the following options:</p>
`;

async function setLights(option) {
    const driftGlobe = game.actors.getName("Driftglobe");
    const driftGlobeToken = duplicate(driftGlobe.data.token);
    const selected = canvas.tokens.controlled;
    let deleteGlobe = false;
    if (selected.length !== 1) return ui.notifications.error("You dont have your own token, or too many tokens, selected");
    const selectedToken = selected[0];
    const tokenName = selectedToken.actor;
    let updates = {};
    let driftglobeUpdates = {};
    let msg = "";
    let lightToken = canvas.tokens.objects.getChildByName("Driftglobe");
    switch (option) {
    case 1:
        updates = { brightLight: 0, dimLight: 10, lightAnimation: {speed: 2, intensity: 1, type:"pulse"}, lightColor: "#217272", lightAlpha: 0.15 };
        msg = "<i>DESCRIPTIVE EMOTE OF WHAT HAPPENS HERE</i>"; // alter message to your purpose
        break;
    case 2:
        updates = { brightLight: 20, dimLight: 40, lightAnimation: {speed: 2, intensity: 1, type:"pulse"}, lightColor: "#217272", lightAlpha: 0.15 };
        msg = "<i>DESCRIPTIVE EMOTE OF WHAT HAPPENS HERE</i>";  // alter message to your purpose
        break;
    case 3:
        updates = { brightLight: 60, dimLight: 120, lightAnimation: {speed: 2, intensity: 1, type:"pulse"}, lightColor: "#217272", lightAlpha: 0.15 };
        msg = "<i>DESCRIPTIVE EMOTE OF WHAT HAPPENS HERE</i>";  // alter message to your purpose
        break;
    case 4:
        driftGlobeToken.x = selectedToken.x;
        driftGlobeToken.y = selectedToken.y;
        updates = { brightLight: 0, dimLight: 0 };
        if (!lightToken) lightToken = (await canvas.scene.createEmbeddedDocuments("Token", [driftGlobeToken]))[0];
        driftglobeUpdates = { _id: lightToken.id, brightLight: 20, dimLight: 40, lightAnimation: {speed: 2, intensity: 1, type:"pulse"}, lightColor: "#217272", lightAlpha: 0.4 };
        msg = "<i>DESCRIPTIVE EMOTE OF WHAT HAPPENS HERE</i>";  // alter message to your purpose
        break;
    case 5:
        driftGlobeToken.x = selectedToken.x;
        driftGlobeToken.y = selectedToken.y;
        updates = { brightLight: 0, dimLight: 0 };
        if (!lightToken) lightToken = (await canvas.scene.createEmbeddedDocuments("Token", [driftGlobeToken]))[0];
        driftglobeUpdates = { _id: lightToken.id, brightLight: 60, dimLight: 120, lightAnimation: {speed: 2, intensity: 1, type:"pulse"}, lightColor: "#217272", lightAlpha: 0.4 };
        msg = "<i>DESCRIPTIVE EMOTE OF WHAT HAPPENS HERE</i>";  // alter message to your purpose
        break;
    case 6:
        updates = { brightLight: 0, dimLight: 0, lightAnimation: {speed: 5, intensity: 5, type:""},lightColor: "", lightAlpha: 1 };
        if (!!lightToken) driftglobeUpdates = { brightLight: 0, dimLight: 0, _id: lightToken.id};
        msg = "<i>DESCRIPTIVE EMOTE OF WHAT HAPPENS HERE</i>";   // alter message to your purpose
        deleteGlobe = true;
        break;
    }
    ChatMessage.create({ "speaker.alias": tokenName.name, content: msg });
    await selectedToken.document.update(updates);
    if (!!lightToken) await canvas.scene.updateEmbeddedDocuments("Token", [driftglobeUpdates]);
    if (deleteGlobe && canvas.tokens.objects.getChildByName("Driftglobe") != null ) {
        ChatMessage.create({ content: `GM please remove the Driftglobe token from the map`, whisper: ChatMessage.getWhisperRecipients("GM") })
    }
}

const d = new Dialog({
    title: "-",
    content: dialogContent,
    buttons: {
        button1: {
            label: dialogButtonLabel1,
            callback: () => setLights(4),
        },
        button2: {
            label: dialogButtonLabel2,
            callback: () => setLights(5),
        },
        button3: {
            label: dialogButtonLabel3,
            callback: () => setLights(1),
        },
        button4: {
            label: dialogButtonLabel4,
            callback: () => setLights(2),
        },
        button5: {
            label: dialogButtonLabel5,
            callback: () => setLights(3),
        },
        off_button: {
            icon: "<i class='fas fa-times-circle'></i>",
            label: dialogButtonLabel6,
            callback: () => setLights(6),
        },
    },
},
{
    height: 325,
    width: 250,
    id: "drifting-lights-dialog"
});
d.render(true);
