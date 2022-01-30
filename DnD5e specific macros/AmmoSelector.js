// item macro that fires before the item is rolled.
// item is defined by the ItemMacro module, token is defined as the controlled token.
let ammoType = item.name.toLowerCase().includes("crossbow") ? "bolt" : "arrow";
const ammoChoices = token.actor.items
                    .filter(i => i.name.toLowerCase().includes(ammoType) && i.data.type === "consumable" && i.data.data.quantity > 0)
                    .sort((a,b)=> a.data.data.price - b.data.data.price)
                    .reduce((acc, i) => acc += `<option value="${i.id}">${i.name} | ${i.data.data.quantity} in the quiver`,``);

const content = `<form>
                    <div class="form-group">
                        <label>Ammo: </label>
                        <select id="ammo-selector">${ammoChoices}</select>
                    </div>
                </form>`;
new Dialog({
    title: "Ammo selector",
    content,
    buttons: {
        fire: {
            label: "Fire!",
            callback: async (html) => {
                const ammoId = html.find("#ammo-selector")[0].value;
                await item.update({"data.consume.target": ammoId});
                item.roll();
            }
        },
        cancel: {
            label: "Cancel"
        }
    }
}).render(true);
