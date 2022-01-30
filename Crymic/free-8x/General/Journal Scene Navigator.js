// this macro pulls a list of Scenes which have Journal Entries attached to them.
let confirmed = false;
let get_scenes = game.scenes.entities;
console.log(get_scenes);
let itemList = "";
for(let i = 0; i < get_scenes.length; i++) {
   let scene = get_scenes[i];
   if (scene.data.journal != ""){
   let j_name = game.journal.get(scene.data.journal).name;
   itemList += `<option value="${scene.name}">${j_name}</option>`;
   }
}
new Dialog({
        title: "Journal Scene Clicker",
		content: `<form><p>Pick a Journal Entry Scene to Navigate to.</p><div class="form-group"><label for="journal_entry">Journal</label><select id="journal_entry">${itemList}</select></div><div class="form-group"><label for="goto">View or Activate it?</label><select id="goto"><option value="1">View</option><option value="2">Activate</option></select></div></form>`,
		buttons: {
        one:  { label: "Go", callback: () => confirmed = true },
        two:  { label: "Cancel", callback: () => confirmed = false }
                },
		close: html => {
			if (confirmed) {
			    let find_scene = html.find('#journal_entry')[0].value;
                let goto = parseInt(html.find('#goto')[0].value);
                if (goto === 1){
			    game.scenes.getName(find_scene).view(true);
                }
                if (goto === 2){
                game.scenes.getName(find_scene).activate(true);                    
                }
            }
        }
        }).render(true);