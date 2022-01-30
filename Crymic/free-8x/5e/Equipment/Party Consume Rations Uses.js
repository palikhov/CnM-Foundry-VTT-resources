(async()=>{
let targets = canvas.tokens.placeables.filter(i=> i.actor.hasPlayerOwner);
if(targets.length === 0) return ui.notifications.error(`There are no owned players on this scene.`);
let ration = "Rations";
let list = "";
for(let target of targets){
let getRation = await target.actor.items.find(i=> i.name === ration);
  if((!getRation) || (getRation.data.data.uses.value < 0)){
   list += `<li>${target.name} is out of ${ration}</li>`;
  }
  if((getRation) && (getRation.data.data.uses.value < 1)){
   await getRation.delete();
   list += `<li>${target.name} ran out of ${getRation.name} (${getRation.data.data.uses.value}/${getRation.data.data.uses.max})</li>`;
  } 
  if((getRation) && (getRation.data.data.uses.value > 0)){
    await getRation.update({"data.uses.value" : getRation.data.data.uses.value -1});
    list += `<li>${target.name} Consumed 1 ${getRation.name} (${getRation.data.data.uses.value}/${getRation.data.data.uses.max})</li>`;
  }
}
let the_message = `<ul>${list}</ul>`;
ChatMessage.create({
   content: the_message,
   speaker: ChatMessage.getSpeaker({alias: `Consume ${ration}`})
});
})();
