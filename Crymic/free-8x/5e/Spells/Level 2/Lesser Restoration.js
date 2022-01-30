//##############################################################
// READ FIRST!!!!!!!!!!!!!!!!!!!
// 1) Midi-Qol "On Use"" macro only
// 2) Get ActiveEffect callback macro out of my callback macros folder.
//##############################################################
let ActiveEffect = game.macros.getName("ActiveEffect");
let target = canvas.tokens.get(args[0].targets[0]._id);
let condition_list = ["Blinded", "Deafened", "Paralyzed", "Diseased", "Poisoned"];
let effect = target.actor.effects.filter( i=> condition_list.includes(i.data.label));
let selectOptions = "";
for (let i = 0; i < effect.length; i++){
let condition = effect[i].data.label;
if (condition_list){
    selectOptions +=`<option value="${condition}">${condition}</option>`;
  }
}
if (selectOptions === "") {
return ui.notifications.error(`Nothing happens.. There's nothing to Cure on ${target.name}.`);
}
else {
let the_content = `<form class="flexcol"><div class="form-group"><select id="element">${selectOptions}</select></div></form>`;
  new Dialog({
	  title: `Casting Lesser Restoration on ${target.name}.`,
	  content: the_content,
		buttons: {
            yes: {
                icon: '<i class="fas fa-check"></i>',
                label: 'Remove it!',
                callback: (html) => {
                    let element = html.find('#element').val();
                    ActiveEffect.execute(target.id, element, "remove");
                    const chatMessage = game.messages.get(args[0].itemCardId);
                    let chatContent = `<div class="midi-qol-nobox"><div class="midi-qol-flex-container"><div>Cures ${element}:</div><div class="midi-qol-target-npc midi-qol-target-name" id="${target.data._id}"> ${target.name}</div><div><img src="${target.data.img}" width="30" height="30" style="border:0px"></img></div></div></div>`;
                    let content = duplicate(chatMessage.data.content);
                    const searchString =  /<div class="midi-qol-hits-display">[\s\S]*<div class="end-midi-qol-hits-display">/g;
                    const replaceString = `<div class="midi-qol-hits-display"><div class="end-midi-qol-hits-display">${chatContent}`;
                    content = content.replace(searchString, replaceString);
                    chatMessage.update({content: content});
                }
              }
            }
        }).render(true);
}
