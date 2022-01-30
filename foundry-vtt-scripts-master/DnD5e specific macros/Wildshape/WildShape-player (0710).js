// Macro Author: Freeze,
// Macro version: 0.2,
// Foundry version: 0.7+,
// Game: DnD5e v 1.3.2+

if(token.actor.isPolymorphed){
    await ChatMessage.create({content: `${token.actor.name} reverts to their original form`, speaker:{alias: token.actor.name}, type: CONST.CHAT_MESSAGE_TYPES.OOC});
    const tokenActorId = token.actor.id;
    token.actor.revertOriginalForm();
    return;
}
const macroTokens = canvas.tokens.controlled;
if (macroTokens.length !== 1) {
    return ui.notifications.info("select your token and, only your own token");
}
const macroToken = macroTokens[0];
const druid = macroToken.actor.items.find(i => i.name == "Druid" && i.type == "class");
if (!druid){
    return ui.notifications.info("you are not a Druid, dont try to bamboozle the game ;)");
}
let maxCR = 0;
if (druid.data.data.subclass != "Circle of the Moon") {
    maxCR = (druid.data.data.levels > 7) ? 1 : (druid.data.data.levels > 3) ? 0.5 : (druid.data.data.levels > 1) ? 0.25 : 0 ;
}
else {   
    maxCR = (druid.data.data.levels > 17) ? 6 : (druid.data.data.levels > 14) ? 5 : (druid.data.data.levels > 11) ? 4 : (druid.data.data.levels > 8) ? 3 : (druid.data.data.levels > 5) ? 2 : 1;
}
console.log(maxCR);
const wildShapeResourceName = "Wildshape";
const resourceKey = Object.keys(macroToken.actor.data.data.resources).filter(k => macroToken.actor.data.data.resources[k].label === `${wildShapeResourceName}`).shift();
if (macroToken.actor.data.data.resources[resourceKey].value < 1) {
    ui.notifications.warn("You are out of charges to Wild Shape.");
    return;
}
if (druid.data.data.levels < 10 || druid.data.data.subclass != "Circle of the Moon" || macroToken.actor.data.data.resources[resourceKey].value < 2) {
    await substractCharge("beast");
    await selectShape("beast");
}
else {
    new Dialog({
        title: `select your Wildshape method`,
        contents: ``,
        buttons: {
            option_1: {
                icon: `<i class="fas fa-paw"></i>`,
                label: `Beast Wildshape`,
                callback: async() => {
                    await substractCharge("beast");
                    await selectShape("beast");
                },
            },
            option_2: {
                icon: `<i class="fab fa-react"></i>`,
                label: `Elemental Wildshape`,
                callback: async() => {
                    await substractCharge("elemental");
                    await selectShape("elemental");
                },
            }
        },
        default: "option_1",
    }).render(true);
}


async function selectShape(type) {
    const packName = 'world.shapes-compendium';
    let beastDialogOptions = "";
    let elemDialogOptions = "";
    let compendium = await game.packs.get(packName).getContent();
    for (let shapeOption of compendium) {
        if (shapeOption.name.toLowerCase().includes("elemental")) {
            elemDialogOptions += `<option value=${shapeOption.id}> ${shapeOption.name} </option>`;
        }
        else {
            let specialMovement = shapeOption.data.data.attributes.movement.fly != 0 ? "fly" : shapeOption.data.data.attributes.movement.swim != 0 ? "swim" : "none"
            if ((druid.data.data.levels < 9 && specialMovement == "fly" && druid.data.data.subclass != "Circle of the Moon")) {
                continue;
            }
            else if ((druid.data.data.levels < 5 && specialMovement == "swim" && druid.data.data.subclass != "Circle of the Moon")){
                continue;
            }
            else if ((druid.data.data.levels < 7 && specialMovement == "fly" && druid.data.data.subclass == "Circle of the Moon")){
                continue;
            }
            else if ((druid.data.data.levels < 3 && specialMovement == "swim" && druid.data.data.subclass == "Circle of the Moon")){
                continue;
            }
            else {
                if (shapeOption.data.data.details.cr > maxCR) {
                    continue;
                }
                beastDialogOptions += `<option value=${shapeOption.id}> ${shapeOption.name} </option>`;
            }
        }
    }
    let dialogOptions = type == "beast" ? beastDialogOptions : elemDialogOptions;
    let dialogContent = `
                        <h2> Select your shape here </h2>
                        <div style="flex:1">Shape name:<select name="shape">${dialogOptions}</select></div>
                        `;
    new Dialog({
        title: "Beast Wild Shape",
        content: dialogContent,
        buttons: {
            accept_button: {
                label: `<i class="fas fa-paw"></i>Wild Shape!`,
                callback: async (html) => {
                    let shapeId = html.find("[name=shape]")[0].value;
                    let newShape = compendium.find(shape => shape.id === shapeId)
                    await ChatMessage.create({content: `${macroToken.actor.name} turns into a ${newShape.name}`, speaker:{alias: macroToken.actor.name}, type: CONST.CHAT_MESSAGE_TYPES.OOC});
                    await macroToken.actor.transformInto(compendium.find(shape => shape.id === shapeId),{
                        keepMental: true,
                        mergeSaves: true,
                        mergeSkills: true,
                    });
                }
            }
        },
        default: "accept_button"
    }).render(true);
}


async function substractCharge(type) {

    let newResources = duplicate(macroToken.actor.data.data.resources);
    let updates = {};
    if (type == "beast") {
        newResources[resourceKey].value--;
        updates["data.resources"] = newResources;
    }
    else if (type == "elemental") {
        newResources[resourceKey].value -= 2;
        updates["data.resources"] = newResources;
    }
    await macroToken.actor.update(updates);
}
