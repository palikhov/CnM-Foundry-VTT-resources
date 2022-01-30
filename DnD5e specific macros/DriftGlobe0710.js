// Macro Author: Freeze (on discord)
// Macro version: 0.1
// Foundry Version: 0.7+
// DnD5e Version: 1.1.1
// Prerequisites: Furnace
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
    const driftGlobe = game.actors.find((i) => i.name === "Driftglobe");
    const driftGlobeToken = duplicate(driftGlobe.data.token);
    const selected = canvas.tokens.controlled;
    let deleteGlobe = false;
    if (selected.length === 0 || selected.length > 1) {
    ui.notifications.error("You dont have your own token selected");
    return;
    }
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
        driftglobeUpdates = { brightLight: 20, dimLight: 40, lightAnimation: {speed: 2, intensity: 1, type:"pulse"}, lightColor: "#217272", lightAlpha: 0.15 };
        if (!lightToken) {
        await canvas.tokens.createMany([driftGlobeToken]);
        lightToken = canvas.tokens.objects.getChildByName("Driftglobe");
        }
        msg = "<i>DESCRIPTIVE EMOTE OF WHAT HAPPENS HERE</i>";  // alter message to your purpose
        break;
    case 5:
        driftGlobeToken.x = selectedToken.x;
        driftGlobeToken.y = selectedToken.y;
        updates = { brightLight: 0, dimLight: 0 };
        driftglobeUpdates = { brightLight: 60, dimLight: 120, lightAnimation: {speed: 2, intensity: 1, type:"pulse"}, lightColor: "#217272", lightAlpha: 0.15 };
        if (!lightToken) {
        await canvas.tokens.createMany([driftGlobeToken]);
        lightToken = canvas.tokens.objects.getChildByName("Driftglobe");
        }

        msg = "<i>DESCRIPTIVE EMOTE OF WHAT HAPPENS HERE</i>";  // alter message to your purpose
        break;
    case 6:
        updates = { brightLight: 0, dimLight: 0, lightAnimation: {speed: 5, intensity: 5, type:""},lightColor: "", lightAlpha: 1 };
        driftglobeUpdates = { brightLight: 0, dimLight: 0 };
        msg = "<i>DESCRIPTIVE EMOTE OF WHAT HAPPENS HERE</i>";   // alter message to your purpose
        deleteGlobe = true;
        break;
    }
    ChatMessage.create({ "speaker.alias": tokenName.name, content: msg });
    await selectedToken.update(updates);
    await lightToken?.update(driftglobeUpdates);
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
    id: "drifting-lights-dialog",
});
d.position.height = 325; // adapt these numbers to make your buttons fit nice and snugly in the dialog.
d.position.width = 250;
d.render(true);
