(async()=>{
let targets = canvas.tokens.placeables.filter(i=> i.actor.hasPlayerOwner);
if(targets.length === 0) return ui.notifications.error(`There are no owned players on this scene.`);
let ration = "Rations";
let list = "";
for(let target of targets){
let getRation = await target.actor.items.find(i=> i.name === ration);
  if((!getRation) || (getRation.data.data.quantity < 0)){
   list += `<li>${target.name} is out of ${ration}</li>`;
  }
  if((getRation) && (getRation.data.data.quantity < 1)){
   await getRation.delete();
   list += `<li>${target.name} ran out of ${getRation.name}</li>`;
  } 
  // Your implementation here doesn't seem to work right? If you're at one ration, and you consume it, it doesn't tell you that you're out until after another "day" passes and you go to subtract rations again- and at that point you'd already be out and starving, or you get 1 extra ration for free.
  if((getRation) && (getRation.data.data.quantity > 0)){
    await getRation.update({"data.quantity" : getRation.data.data.quantity -1});
// I think this is a better way to do it. I don't really know all that much about javascript, but when I was testing it out in my world it seems to work as I would intend it to. If you have three rations, you get 2 uses like you normally would (counsumed 1 ration), and on the third, when you would normally hit 0 rations and say nothing but "Consumed 1 Ration", it states you ate your last one, and are now out- along with deleting the item in the inventory.
    if((getRation) && (getRation.data.data.quantity == 0)){
        await getRation.delete();
        list += `<li>${target.name} ate the last of their ${getRation.name}, and now they're out!</li>`;
    } 
    else {
        list += `<li>${target.name} Consumed 1 ${getRation.name}</li>`;
    }
  }
}
let the_message = `<ul>${list}</ul>`;
ChatMessage.create({
   content: the_message,
   speaker: ChatMessage.getSpeaker({alias: `Consume ${ration}`})
});
})();
