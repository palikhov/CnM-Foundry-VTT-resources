const dialogContent = `
<style>
    #hooded-lantern-dialog .dialog-buttons {
        flex-direction: column;
        background: #FFFACD;
    }
</style>
<h2>Light the Hooded Lantern</h2>
<p>Choose from the following options:</p>
`;

async function setLights(option) {
    const selected = canvas.tokens.controlled;
    if (selected.length === 0 || selected.length > 1) {
        return ui.notifications.error("You dont have your own token selected");
    }
    const selectedToken = selected[0];
    const selectedActor = selectedToken.actor;
    const oilFlask = selectedActor.items.getName("Oil Flask")
    if (!oilFlask) {
        return ui.notifications.error("You dont have any oil flasks to light the lantern");
    }
    let updates = {};
    let msg = "";
    switch (option) {
    case 1:
        updates = { brightLight: 0, dimLight: 5, lightAnimation: {speed: 2, intensity: 1, type:"torch"}, lightColor: "#F3A55F", lightAlpha: 0.2 };
        msg = "<i>Lights the hooded lantern.. but keeps the hood down..</i>";
        break;
    case 2:
        updates = { brightLight: 30, dimLight: 60, lightAnimation: {speed: 2, intensity: 1, type:"torch"}, lightColor: "#F3A55F", lightAlpha: 0.2 };
        msg = "<i>Lights the hooded lantern.</i>";
        break;
    case 3:
        updates = { brightLight: 0, dimLight: 0, lightAnimation: {speed: 5, intensity: 5, type:""},lightColor: "", lightAlpha: 1 };
        msg = "<i>Quenches the light.</i>";
        await oilFlask.update({"data.quantity": oilFlask.data.data.quantity - 1})
        break;
    }
    ChatMessage.create({ "speaker.alias": selectedActor.name, content: msg });
    await selectedToken.document.update(updates);
}
// class="button-style" //

const d = new Dialog({
    title: "-",
    content: dialogContent,
    buttons: {
        hoodDown: {
            label: "Light the lamp with the hood down",
            callback: () => setLights(1),
        },
        hoodUp: {
            label: "Light the lamp with hood up",
            callback: () => setLights(2),
        },
        off: {
            label: "Kill the light completely",
            callback: () => setLights(3),
        },
    },
},
{
    id: "hooded-lantern-dialog",
});
d.position.height = 215;
d.position.width = 250;
d.render(true);
