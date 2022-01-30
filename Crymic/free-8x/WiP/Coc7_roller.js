(async()=> {
let actors = game.actors.entities;
let listed_actor = "";
for(let i = 0; i < actors.length; i++) {
   let actor_list = actors[i];
   listed_actor += `<option value="${actor_list.id}">${actor_list.name}</option>`;
}
new Dialog({
  title: "Actor Selector",
  content: `<form><p>Select an Actor</p><div class="form-group"><label for="actors">Actor Name</label><select id="actors">${listed_actor}</select></div></form>`,
  buttons: {
    one:  { label: "Skill Check", callback: (html) => {
    let get_actor = html.find('#actors')[0].value;
    skill_check(get_actor);
  }},
two:  { label: "Weapon Check", callback: (html) => {
    let get_actor = html.find('#actors')[0].value;
    weapon_check(get_actor);
  }}
  }
}).render(true);

async function skill_check(get_actor){
console.log(get_actor);
let actorD = game.actors.get(get_actor);
let selected_items = actorD.items.filter( i=> i.type === "skill").sort((a,b) => a.name < b.name ? -1 : 1);
let itemList = "";
for(let i = 0; i < selected_items.length; i++) {
   let item = selected_items[i];
   itemList += `<option value="${item.name}">${item.name}</option>`;
}
new Dialog({
  title: "Skill Roller",
  content: `<form><p>Select a Skill Check to roll</p><div class="form-group"><label for="skills">Skill</label><select id="skills">${itemList}</select></div></form>`,
  buttons: {
    norm:  { label: "Roll", callback: (html) => {
    let get_skill = html.find('#skills')[0].value;
    actorD.skillCheck(get_skill, {fastFoward: true});
  }}
  }
}).render(true);
}
async function weapon_check(get_actor){
console.log(get_actor);
let actorD = game.actors.get(get_actor);
let selected_items = actorD.items.filter( i=> i.type === "weapon").sort((a,b) => a.name < b.name ? -1 : 1);
let itemList = "";
for(let i = 0; i < selected_items.length; i++) {
   let item = selected_items[i];
   itemList += `<option value="${item.name}">${item.name}</option>`;
}
new Dialog({
  title: "Weapon Roller",
  content: `<form><p>Select a weapon skill to roll</p><div class="form-group"><label for="weapons">Weapons</label><select id="weapons">${itemList}</select></div></form>`,
  buttons: {
    norm:  { label: "Roll", callback: (html) => {
    let get_weapon = html.find('#weapons')[0].value;
    actorD.weaponCheck(get_weapon, {fastFoward: true});
  }}
  }
}).render(true);
}

})();
