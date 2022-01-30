// Midi-qol On use
let itemD = args[0].item;
let spellList = "";
let spell_items = Object.values(itemD.flags.magicitems.spells).sort((a,b) => a.name < b.name ? -1 : 1);
for(let i = 0; i < spell_items.length; i++) {
let item = spell_items[i];
  spellList += `<option value="${item.name}">${item.name}</option>`;
}
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
