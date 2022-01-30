// uses this macro for item updates https://github.com/Kekilla0/Personal-Macros/blob/master/Furnace/Update_Actor_Items_Macro.js
// in DAE or DE use @target for targetting
if (args[0] === "on") {
    let confirmed = false;
    let itemUpdate = game.macros.getName("UpdateItem");
    let target = canvas.tokens.get(args[1])
    let itemTypes = ['equipment', 'weapon'];
    let selected_items = target.actor.items.filter( i=> itemTypes.includes(i.data.type));
    let optionsText = "";
    for(let i = 0; i < selected_items.length; i++) {
        let item = selected_items[i];
        if (!item.data.data.equipped) {
            optionsText += `<option name="item" value="${item.name}">${item.name}</option>`;
        }
    }
    if (optionsText === "") {return ui.notifications.warn(`There's nothing to equip on ${target.name}.`);}
    else {
        let the_content = `<p>Choose a peice of equipement on ${target.data.name}.</p><form><div class="form-group"><select name="item">` + optionsText + `</select></div></form>`;
        new Dialog({
        title: "Equip an Item",
        content: the_content,
        buttons: {
            go: { label: "Equip!", callback: () => confirmed = true },
            cancel: { label: "Cancel", callback: () => confirmed = false }
            },
        close: html => {
            if (confirmed) {
            let selected_item = html.find('[name=item]')[0].value;
            itemUpdate.execute(args[1], selected_item, ({"data.equipped" : true}));
            let msg = `<p>${actor.name}'s magic causes ${target.name}s to equip their ${selected_item.name}.</p> `;
        ChatMessage.create({
                            user: game.user._id,
                            speaker: ChatMessage.getSpeaker({token: actor}),
                            content: msg
                        });
                    }
            }
        }).render(true);
    }
}