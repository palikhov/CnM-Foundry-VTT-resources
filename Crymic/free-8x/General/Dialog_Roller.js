let the_content = `<pEnter a formula to roll</p><form><div class="form-group"><input id="text_info" type="text"></div></form>`;
new Dialog({
    title: "Manual Dice Roller",
    content: the_content,
    buttons: {
        roll: { label: "Roll it", callback: async (html) => {
            let entered = html.find(`#text_info`).val();
            if (!entered) return ui.notifications.error(`Nothing was entered, skipping.`);
            new Roll(`${entered}`).roll().toMessage();
        }}
    }
}).render(true);
