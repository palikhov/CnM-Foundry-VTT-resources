(async ()=>{
    let ActorUpdate = game.macros.getName("ActorUpdate");
    let confirmed = false;
    let target = await Array.from(game.user.targets)[0];
    if(!target) return ui.notificiations.error(`Target a token`);
    let me = canvas.tokens.controlled[0];
    let selected_items = await me.actor.items.filter( i=> i.type === "item");
  let optionsText = "";
  for(let i = 0; i < selected_items.length; i++) {
     let item = selected_items[i];
     let damageD = item.data.data.attributes.Statystyki;
     if (damageD){
     optionsText += `<option value="${item.name}">${item.name}</option>`;
    }
  }
  new Dialog({
          title: "Attack Roller",
      content: `<form class="flexcol"><p>Pick a weapon to attack with</p><div class="form-group"><label for="weapons">Weapon</label><select id="weapons">${optionsText}</select></div><div class="form-group"><label for="attribute">Attribute</label><select id="attribute"><option value="str">Strength</option><option value="dex">Agility</option></select></div></form>`,
          buttons: {
          one:  { label: "Attack", callback: () => confirmed = true },
          two:  { label: "Cancel", callback: () => confirmed = false },
                  },
          close: html => {
              if (confirmed) {
                 (async ()=>{
                  let get_name = await html.find('#weapons')[0].value;
                  let get_attr = await html.find('#attribute')[0].value;
                  let get_weapon = await me.actor.items.find(i => i.name=== get_name);
                  let weapon_stats = await get_weapon.getRollData();
                  let damageDice = await weapon_stats.attributes.Statystyki.Obrazenia.value;
                  let get_my_stats = await me.actor.getRollData();
                  let get_target_stats = await target.actor.getRollData();
                  let get_target_dr = await get_target_stats.DR;
                  let get_target_armor = await get_target_stats.Armor;                  
                  console.log(`Defense Number ${get_target_dr}`);                  
                  let get_stat_name = "";                  
                  let statBonus = "";
                  let weapon_miss_sound = "";
                  let weapon_damage_sound = "";
                  if (get_attr === "str"){
                          get_stat_name = "Strength";
                          statBonus = get_my_stats.Attributes.Strength;
                          }
                  if (get_attr === "dex"){
                          get_stat_name = "Agility";
                          statBonus = get_my_stats.Attributes.Agility;
                          }
                  let attackRoll = new Roll(`1d20 + ${statBonus}`).roll();
                  console.log(`Attack Roll > ${attackRoll.formula} = ${attackRoll.total}`);
let item_description = weapon_stats.description != "" ? weapon_stats.description : "No Description on Item";
  let attack_html = `<div class="chat-card item-card" data-actor-id="${me.data._id}" data-item-id="${get_weapon._id}"><header class="card-header"><h3 class="item-name">${get_weapon.name}</h3><img src="${get_weapon.img}" title="${get_weapon.name}" width="36" height="36" style="padding:0;"></header><div class="card-content">${item_description}</div><hr><div class="card-buttons"><div class="flexrow 1"><div>${get_weapon.name} (${get_stat_name}) - Attack Roll</div></div></div></div>`;
                 ChatMessage.create({
          user: game.user._id,
                  speaker: ChatMessage.getSpeaker({token: actor}),
                  flavor: attack_html,
                  roll: attackRoll,
                  type: CONST.CHAT_MESSAGE_TYPES.ROLL
                  });                  
                  if (attackRoll.total >= get_target_dr) {
                  let damageRoll = new Roll(`${damageDice} - ${get_target_armor}`).roll();                  
                  let damage_html = `<div class="chat-card item-card" data-actor-id="${me.data._id}" data-item-id="${get_weapon._id}"><div class="card-buttons"><div class="flexrow 1"><div>${get_weapon.name} - Damage Roll</div></div></div></div>`;
                  ChatMessage.create({
          user: game.user._id,
                  speaker: ChatMessage.getSpeaker({token: actor}),
                  flavor: damage_html,
                  roll: damageRoll,
                  type: CONST.CHAT_MESSAGE_TYPES.ROLL
                  });
                  let curtHp = await get_target_stats.health.value;
                  let damageDealt = curtHp - damageRoll.total;
                  ActorUpdate.execute(target.id, {"data.health.value" : damageDealt});
                  AudioHelper.play({src: weapon_damage_sound, vume: 0.001, autoplay: true, loop: false}, true);
                  }
                  else {
                 AudioHelper.play({src: weapon_miss_sound, vume: 0.001, autoplay: true, loop: false}, true);
                  }                  
                })();
                      }           
                  }
              }).render(true);
  
  })();