// Tells you the maxmium damage for the feat or spell.
// Thanks to Kekilla for helping me write this macro.
let confirmed = false;
let dmgtype = ["lightning","thunder"];
let selected_items = actor.items.filter( i=> i.data.data.damage?.parts.length > 0 && dmgtype.includes(i.data.data.damage?.parts[0][1]));
let optionsText = "";
for(let i = 0; i < selected_items.length; i++) {
   let opt = selected_items[i];
   optionsText += `<option name="ability" id="${i}" data-value="${opt.name}">${opt.name}</option>`;
}
let the_content = `<p>Choose one to empower.</p><form><div class="form-group"><select name="ability">` + optionsText + `</select></div></form>`;
new Dialog({
        title: "Channel Divinity: Destructive Wrath",
        content: the_content,
        buttons: {
                go: { label: "Feel my Wrath!", callback: () => confirmed = true },
	        cancel: { label: "Cancel", callback: () => confirmed = false }
                },
		close: html => {
                        if (confirmed) {
			let selected_ability = html.find('[name=ability]')[0].value;
			let empower = actor.items.find(i=> i.name===`${selected_ability}`);
			let damageDice = empower.labels.damage;
                        let maxRoll = new Roll(damageDice, actor.getRollData()).evaluate({maximize : true});
                        maxRoll.toMessage({
                                flavor: `<p><strong>Channel Divinity: Destructive Wrath</strong><hr>${empower.name} - Maximum Damage Roll</p>`,user: game.user._id, speaker: ChatMessage.getSpeaker({token: actor})
                                });
            }
    }
}).render(true);