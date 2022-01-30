// IN DAE > Set the stackable to "Stacking effects apply the effect multiple times"
async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const itemD = lastArg.efData.flags.dae.itemData;

if(args[0] === "on"){
    let itemData = [{
  "name": itemD.name,
  "type": "consumable",
  "img": "icons/consumables/fruit/berry-leaf-pink.webp",
  "data": {
    "description": {
      "value": "<p>Eating a berry restores 1 hit point, and the berry provides enough nourishment to sustain a creature for one day.</p>"
    },    
    "quantity": 10,
    "weight": 0.002,        
    "rarity": "common",
    "identified": true,
    "activation": {
      "type": "action",
      "cost": 1,
      "condition": ""
    },    
    "range": {
      "value": null,
      "long": null,
      "units": "touch"
    },
    "uses": {
      "value": 1,
      "max": "1",
      "per": "charges",
      "autoDestroy": true
    },
    "actionType": "heal",    
    "damage": {
      "parts": [
        [
          "1",
          "healing"
        ]
      ],
      "versatile": ""
    },
    "consumableType": "food"
  },  
  "flags": {    
    "midi-qol": {
      "onUseMacroName": "",
      "effectActivation": false
    }
  }
}];
    await tactor.createEmbeddedDocuments("Item", itemData);
}
if (args[0] === "off") {
    let itemz = tactor.data.items.find(i => i.name === itemD.name && i.type === "consumable");
    if (itemz) await tactor.deleteEmbeddedDocuments('Item', [itemz.id]);
}
