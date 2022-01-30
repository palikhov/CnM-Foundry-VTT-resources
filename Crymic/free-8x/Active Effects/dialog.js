(async ()=>{
let target = canvas.tokens.controlled[0];
let effect = target.actor.effects.entries;
console.log(effect);
let confirmed = false;
let selectOptions = "";
for (let i = 0; i < effect.length; i++){
const effect_name = effect[i].data.label;
const effect_id = effect[i].data._id;
const effect_status = effect[i].data.disabled;
const effect_switch = effect_status === true ? "Off" : "On";
selectOptions +=`<option value="${effect_id}">${effect_name} [${effect_switch}]</option>`;
}

let the_content = `<form class="flexcol"><div class="form-group"><select id="element">${selectOptions}</select></div></form>`;
  new Dialog({
	  title: `DAE Toggle on ${target.data.name}.`,
	  content: the_content,
		buttons: {
            yes: {                
                label: 'Turn it Off',
                callback: (html) => {
                    let element = html.find('#element').val();                  
                    target.actor.updateEmbeddedEntity("ActiveEffect", {"_id": element,  "disabled" : true});
                }
              },
              no: {                
                label: 'Turn it On',
                callback: (html) => {
                    let element = html.find('#element').val();                  
                    target.actor.updateEmbeddedEntity("ActiveEffect", {"_id": element,  "disabled" : false});
                } 
              },
              remove: {
                label: 'Delete It',
                callback: (html) => {
                    let element = html.find('#element').val();                  
                    target.actor.deleteEmbeddedEntity("ActiveEffect", element);
                } 
              }
            }
        }).render(true);

})();