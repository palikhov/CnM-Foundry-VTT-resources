//#######################################
// READ FIRST!!!!!!!!!!
// DAE Macro, use either macro.execute or macro.itemmacro with @item.level
// Main spell set target self, remove all attack & damage from it.
//#######################################
const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const itemD = lastArg.efData.flags.dae.itemData;
const level = Number(args[1]);
if (args[0] === "on") {
    let itemData = [{
  "name": `${itemD.name} Attack`,
  "type": "spell",
  "img": itemD.img,
  "data": {
    "description": {
      "value": `<p>Make a melee spell attack against a creature within your reach.</p>\n<p>On a hit, the target takes ${level}d6 necrotic damage, and you regain hit points equal to half the amount of necrotic damage dealt. Until the spell ends, you can make the attack again on each of your turns as an action.</p>`
    },
    "activation": {
      "type": "action",
      "cost": 1,
      "condition": ""
    },
    "range": {
      "value": 5,
      "long": null,
      "units": "ft"
    },
    "actionType": "msak",
    "damage": {
      "parts": [
        [
          `${level}d6`,
          "necrotic"
        ]
      ],
      "versatile": ""
    },
    "level": 3,
    "school": "nec",
    "preparation": {
      "mode": "atwill",
      "prepared": true
    },
    "scaling": {
      "mode": "level",
      "formula": "1d6"
    }
  },
  "effects": [],
  "sort": 0,
  "flags": {
    "midi-qol": {
      "onUseMacroName": "ItemMacro"
    },
    "itemacro": {
      "macro": {
        "data": {
          "_id": null,
          "name": `${itemD.name} Attack`,
          "type": "script",
          "author": "Tyd5yiqWrRZMvG30",
          "img": itemD.img,
          "scope": "global",
          "command": "async function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }\nconst lastArg = args[args.length - 1];\nif (lastArg.hitTargets.length === 0) return {};\nlet actorD = game.actors.get(lastArg.actor._id);\nlet tokenD = canvas.tokens.get(lastArg.tokenId);\nlet target = canvas.tokens.get(lastArg.hitTargets[0].id);\nlet healingType = \"healing\";\nlet damageTotal = Math.floor(lastArg.damageTotal / 2);\nlet damageRoll = new Roll(`${damageTotal}`).evaluate({ async: false });\nnew MidiQOL.DamageOnlyWorkflow(actorD, tokenD, damageRoll.total, healingType, [tokenD], damageRoll, { flavor: `(${CONFIG.DND5E.healingTypes[healingType]})`, itemCardId: lastArg.itemCardId, damageList: lastArg.damageList });\nlet targetList = `<div class=\"midi-qol-flex-container\"><div class=\"midi-qol-target-npc midi-qol-target-name\" id=\"${target.id}\">hits ${target.name}</div><div><img src=\"${target.data.img}\" width=\"30\" height=\"30\" style=\"border:0px\"></div></div><div class=\"midi-qol-flex-container\"><div class=\"midi-qol-target-npc midi-qol-target-name\" id=\"${tokenD.id}\">heals ${tokenD.name}</div><div><img src=\"${tokenD.data.img}\" width=\"30\" height=\"30\" style=\"border:0px\"></div></div>`;\nawait wait(500);\nconst chatMessage = await game.messages.get(args[0].itemCardId);\nlet content = await duplicate(chatMessage.data.content);\nconst searchString = /<div class=\"midi-qol-hits-display\">[\\s\\S]*<div class=\"end-midi-qol-hits-display\">/g;\nconst replaceString = `<div class=\"midi-qol-hits-display\"><div class=\"end-midi-qol-hits-display\">${targetList}`;\ncontent = await content.replace(searchString, replaceString);\nawait chatMessage.update({ content: content });\nawait ui.chat.scrollBottom();",
          "folder": null,
          "sort": 0,
          "permission": {
            "default": 0
          }
        }
      }
    },
    "core": {
      "sourceId": "Item.Z5whKbwOiMYHfS2w"
    },
    "favtab": {
      "isFavorite": true
    }
  }
}];
    await tactor.createEmbeddedDocuments("Item", itemData);
}
if (args[0] === "off") {
    let item = tactor.data.items.find(i => i.name === `${itemD.name} Attack` && i.type === "spell");
    if (item) await tactor.deleteEmbeddedDocuments('Item', [item.id]);
}
