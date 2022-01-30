//###############################################################
// READ First!
// Themed after Kandashi's create item macro
//############################################################

const lastArg = args[args.length - 1];
let actorD;
if (lastArg.tokenId) actorD = canvas.tokens.get(lastArg.tokenId).actor;
else actorD = game.actors.get(lastArg.actorId);
const tokenD = canvas.tokens.get(lastArg.tokenId);

if (args[0] === "on") {
  await tokenD.update({"dimLight": 20, "brightLight": 10, "lightAlpha" : 0.25,  "lightColor": "#f7c597", lightAnimation: {intensity : 4, speed : 5, type : "torch"}});
  let itemData = [{
  "name": "Flame",
  "type": "spell",
  "data": {
    "description": {
      "value": "<p>You can hurl the flame at a creature within 30 feet of you.</p>\n<p>Make a ranged spell attack. On a hit, the target takes [[/r 1d8]] fire damage.</p>\n<p>This spell's damage increases by [[/r 1d8]] when you reach 5th level ([[/r 2d8]]), 11th level ([[/r 3d8]]), and 17th level ([[/r 4d8]]).</p>",
      "chat": "",
      "unidentified": ""
    },
    "activation": {
      "type": "action",
      "cost": 1,
      "condition": ""
    },
    "target": {
      "value": 1,
      "width": null,
      "units": "",
      "type": "creature"
    },
    "range": {
      "value": 30,
      "long": null,
      "units": "ft"
    },
    "ability": "",
    "actionType": "rsak",
    "attackBonus": "",
    "chatFlavor": "",
    "critical": null,
    "damage": {
      "parts": [
        [
          `1d8`,
          "fire"
        ]
      ],
      "versatile": ""
    },
    "formula": "",
    "save": {
      "ability": "",
      "dc": null,
      "scaling": "spell"
    },
    "level": 0,
    "school": "con",
    "components": {
      "value": "",
      "vocal": true,
      "somatic": true
    },
    "preparation": {
      "mode": "innate",
      "prepared": true
    },
    "scaling": {
      "mode": "cantrip",
      "formula": `1d8`
    }
  },
  "flags": {
    "midi-qol": {
      "onUseMacroName": "ItemMacro"
    },
    "itemacro": {
      "macro": {
        "_data": {
          "name": "Flame",
          "type": "script",
          "scope": "global",
          "command": "let actorD = canvas.tokens.get(args[0].tokenId).actor;\nif(actorD.items.find(i=> \"Flame\" && i.type === \"spell\")){\nlet getEffect = actorD.effects.find(i=> i.data.label === \"Produce Flame\");\nawait getEffect.delete();\n}",
          "author": "feceaHtk8xrriPzY"
        },
        "data": {
          "name": "Flame",
          "type": "script",
          "scope": "global",
          "command": "let actorD = canvas.tokens.get(args[0].tokenId).actor;\nif(actorD.items.find(i=> \"Flame\" && i.type === \"spell\")){\nlet getEffect = actorD.effects.find(i=> i.data.label === \"Produce Flame\");\nawait getEffect.delete();\n}",
          "author": "feceaHtk8xrriPzY"
        }
      }
    }
  },
  "img": "systems/dnd5e/icons/skills/fire_10.jpg"
}];
await actorD.createEmbeddedDocuments("Item", itemData);
}

if (args[0] === "off") {
  await tokenD.update({"dimLight": 0, "brightLight": 0, "lightColor": ""});
  let getItem = actorD.items.find(i => i.name === "Flame");
  if(!getItem) return {};
  await getItem.delete();
}