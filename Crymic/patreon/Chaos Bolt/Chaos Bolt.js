// Midi-Qol On Use Only
const damageList = {1:"acid", 2: "cold", 3:"fire", 4:"force", 5:"lightning", 6:"poison", 7:"psychic", 8:"thunder"};
const actorD = game.actors.get(args[0].actor._id);
const tokenD = canvas.tokens.get(args[0].tokenId);
const itemD = args[0].item;
const getItem = actorD.items.getName(itemD.name);
const spellLevel = Number(args[0].spellLevel);
const upcast = spellLevel;
async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }

if(args[0].hitTargets.length > 0){
const target = canvas.tokens.get(args[0].hitTargets[0]._id);
dealDamage(target);
}

async function findTarget(target){
    let distance = 29.5;
    let get_targets = await canvas.tokens.placeables.filter(new_target => (canvas.grid.measureDistance(target.center, new_target.center) <= distance && target.id != new_target.id && target.data.disposition === new_target.data.disposition));
  rollAttack(get_targets);
}

async function rollAttack(get_targets){
    let targetList;
    for(let target of get_targets){
        targetList += `<option value="${target.id}">${target.name}</option>`;
    }
    new Dialog({
    title: `${itemD.name} : New Target`,
      content: `<form><div class="form-group"><label for="target">Pick Target</label><select id="target">${targetList}</select></div></form>`,
      buttons: {
        attack: {
          label: "Attack",
          callback: async (html) => {
              let find_target = html.find('#target').val();
              let get_target = canvas.tokens.get(find_target);
              await get_target.setTarget(true, {releaseOthers: true});
              await wait(500);
              let roll = await actorD.items.get(itemD._id).rollAttack();
              if(roll.total >= get_target.actor.data.data.attributes.ac.value){
                  const newCritical = roll.parts[0].total === 20 ? true : false;
                  dealDamage(get_target, 1, newCritical);
              }
          }
        }
      },
      default: "attack"
    }).render(true);
}

async function dealDamage(target, reCast, newCritical){
    let numDice = newCritical ? `1d8 + 1d8 + 2d8 + ${upcast *2}d6` : args[0].isCritical ? `1d8 + 1d8 + 2d8 + ${upcast *2}d6` : `1d8 + 1d8 + ${upcast}d6`;
    const damageRoll = new Roll(`${numDice}`).evaluate({async:false});
    let firstElement = damageList[damageRoll.terms[0].total];
    let secondElement = damageList[damageRoll.terms[2].total];
    let selectElement;
    let castAgain = 0;
    let elementList = [];
    if(firstElement != secondElement) {
    elementList.push(firstElement);
    elementList.push(secondElement);
    } else {
    elementList = firstElement;
    castAgain = 1;
    }
    for(let element of elementList){
    selectElement += `<option value="${element}">${element}</option>`;
    }
    if(firstElement === secondElement) {
         game.dice3d?.showForRoll(damageRoll);
         if(reCast === 1){
              let newId = await MidiQOL.Workflow.getWorkflow(itemD._id);
              new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, elementList, [target], damageRoll, {flavor: `(${elementList})`, itemCardId: newId.itemCardId, useOther: false});
              } else {
                new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, elementList, [target], damageRoll, {flavor: `(${elementList})`, itemCardId: args[0].itemCardId, useOther: false});
              }
        if(castAgain === 1){
            await wait(1000);
            findTarget(target);
        }
        
    } else {
    let the_message = `<form><div class="form-group"><label for="element">Pick Element</label><select id="element">${selectElement}</select></div></form>`;
    new Dialog({
        title: itemD.name,
        content: the_message,
      buttons: {
        damage: {
          label: "Damage",
          callback: async (html) => {
            let element = html.find('#element').val();
             game.dice3d?.showForRoll(damageRoll);
          if(reCast === 1){
              let newId = await MidiQOL.Workflow.getWorkflow(itemD._id);
              new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, element, [target], damageRoll, {flavor: `(${element})`, itemCardId: newId.itemCardId, useOther: false});
              } else {
                new MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, element, [target], damageRoll, {flavor: `(${element})`, itemCardId: args[0].itemCardId, useOther: false});
        }
            
      }
    }
  },
   default: "damage"
}).render(true);
}
}