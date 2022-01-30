(async () => {
  const lastArg = args[args.length - 1];
  let tactor;
  if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
  else tactor = game.actors.get(lastArg.actorId);
  const saveData = tactor.data.data.attributes.spelldc;
  const level = lastArg.efData.flags.dae.itemData.data.level;
  const meteorCount = Number(level * 2);

  if (args[0] === "on") {
    const itemData = ({
      "name": "Melf's Minute Meteor",
      "type": "spell",
      "img": "systems/dnd5e/icons/skills/fire_02.jpg",
      "data": {
        "description": {
          "value": "<p>Once a meteor reaches its destination or impacts against a solid surface, the meteor explodes. Each creature within 5 feet of the point where the meteor explodes must make a Dexterity saving throw. A creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one.</p>",
          "chat": "",
          "unidentified": ""
        },
        "activation": {
          "type": "bonus",
          "cost": 1,
          "condition": ""
        },
        "target": {
          "value": 10,
          "width": null,
          "units": "ft",
          "type": "square"
        },
        "range": {
          "value": 120,
          "long": null,
          "units": "ft"
        },
        "uses": {
          "value": meteorCount,
          "max": meteorCount,
          "per": "charges"
        },
        "damage": {
          "parts": [
            [
              "2d6",
              "fire"
            ]
          ],
          "versatile": ""
        },
        "save": {
          "ability": "dex",
          "dc": saveData,
          "scaling": "spell"
        },
        "level": 1,
        "school": "evo",
        "components": {
          "value": "",
          "vocal": true,
          "somatic": true,
          "material": true,
          "ritual": false,
          "concentration": false
        },
        "preparation": {
          "mode": "innate",
          "prepared": true
        }
      },
      "flags": {
        "midi-qol": {
          "onUseMacroName": "ItemMacro"
        },
        "favtab": {
          "isFavorite": true
        },
        "itemacro": {
          "macro": {
            "data": {
              "_id": null,
              "name": "Melf's Minute Meteor",
              "type": "script",
              "author": "feceaHtk8xrriPzY",
              "img": "icons/svg/dice-target.svg",
              "scope": "global",
              "command": "(async()=>{\nlet actorD = canvas.tokens.get(args[0].tokenId).actor;\nlet itemD = args[0].item;\nif(itemD.data.uses.value === 0){\n    let conId = actorD.effects.find(i=> i.data.label === \"Concentrating\").id;\n    await actorD.deleteEmbeddedDocuments(\"ActiveEffect\", [conId]);\n}\n})();",
              "folder": null,
              "sort": 0,
              "permission": {
                "default": 0
              }
            }
          }
        }
      }
    })
    await tactor.createEmbeddedDocuments("Item", [itemData]);
  }

  if (args[0] === "off") {
    let item = tactor.data.items.find(i => i.name === "Melf's Minute Meteor");
    await tactor.deleteEmbeddedDocuments("Item", [item._id]);
  }
})();