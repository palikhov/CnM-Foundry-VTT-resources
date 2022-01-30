// if there are multiple spells on said item, you can use this macro. Just enter the name of the item. Hit shift when clicking on the item to activate it.
// this is a hotbar macro.
let actorD = canvas.tokens.controlled[0].actor || game.user.character;
let itemName = "Name of Item";
let itemD = await actorD.items.find(item=>item.name===itemName);
let spellList = "";
let spell_items = Object.values(itemD.data.flags.magicitems.spells).sort((a,b) => a.name < b.name ? -1 : 1);
for(let i = 0; i < spell_items.length; i++) {
let item = spell_items[i];
  spellList += `<option value="${item.name}">${item.name}</option>`;
}
if(event.shiftKey){
new Dialog({
  title: `${itemD.name}`,
  content: `<form><p>Pick a spell to cast</p><div class="form-group"><label for="weapons">Listed Spells</label><select id="spells">${spellList}</select></div></form>`,
  buttons: {
    cast: { label: "Cast", callback: async (html) => {
        let get_spell = await html.find('#spells')[0].value;
        await MagicItems.roll(itemD.name, get_spell);
    }}
  }
}).render(true);
}
else {
game.dnd5e.rollItemMacro(itemName);
}
