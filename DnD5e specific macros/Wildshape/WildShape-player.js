// Macro Author: Freeze,
// Macro version: 1.0,
// Foundry version: 0.8+,
// Game: DnD5e v 1.3.4+
// requires: A compendium with creatures to shape into.
const packName = 'world.shapes-compendium'; // change if your compendium is not named "Shapes Compendium"
const subClassName = "Circle of the Moon"; // change if that is not your SubClass name for Circle of the Moon
const wildShapeResourceName = "Wild Shape"; // change if that is not what your resource is named.

if(token.actor.isPolymorphed){
    await ChatMessage.create({content: `${token.actor.name} reverts to their original form`, speaker:{alias: token.actor.name}, type: CONST.CHAT_MESSAGE_TYPES.OOC});
    await token.actor.revertOriginalForm();
    return;
}

const macroToken = token;
const druid = macroToken.actor.items.find(i => i.name == "Druid" && i.type == "class");
if (!druid){
    return ui.notifications.info("you are not a Druid, dont try to bamboozle the game ;)");
}
let maxCR = 0;
if (druid.data.data.subclass !== subClassName) {
    maxCR = (druid.data.data.levels > 7) ? 1 : (druid.data.data.levels > 3) ? 0.5 : (druid.data.data.levels > 1) ? 0.25 : 0 ;
}
else {   
    maxCR = (druid.data.data.levels > 17) ? 6 : (druid.data.data.levels > 14) ? 5 : (druid.data.data.levels > 11) ? 4 : (druid.data.data.levels > 8) ? 3 : (druid.data.data.levels > 5) ? 2 : 1;
}
const resourceKey = Object.keys(macroToken.actor.data.data.resources).filter(k => macroToken.actor.data.data.resources[k].label === `${wildShapeResourceName}`).shift();
if (macroToken.actor.data.data.resources[resourceKey].value < 1) {
    ui.notifications.warn("You are out of charges to Wild Shape.");
    return;
}
if (druid.data.data.levels < 10 || druid.data.data.subclass !== subClassName || macroToken.actor.data.data.resources[resourceKey].value < 2) {
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
                    //await substractCharge("beast");
                    await selectShape("beast");
                },
            },
            option_2: {
                icon: `<i class="fab fa-react"></i>`,
                label: `Elemental Wildshape`,
                callback: async() => {
                    //await substractCharge("elemental");
                    await selectShape("elemental");
                },
            }
        },
        default: "option_1",
    }).render(true);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function selectShape(type) {
    let beastDialogOptions = "";
    let elemDialogOptions = "";
    let compendium = (await game.packs.get(packName).getDocuments()).sort((a,b) => b.data.data.details.cr - a.data.data.details.cr);
    for (let shapeOption of compendium) {
        if (shapeOption.name.toLowerCase().includes("elemental")) {
            elemDialogOptions += `<option value=${shapeOption.id}> ${shapeOption.name} |  ${shapeOption.data.data.attributes.hp.value} hit-points</option>`;
        }
        else {
            const fly = shapeOption.data.data.attributes.movement.fly;
            const swim = shapeOption.data.data.attributes.movement.swim;
            const specialMovement = (fly !== 0 && fly !== null) ? "fly" : (swim !== 0 && swim !== null) ? "swim" : "none"
            if ((druid.data.data.levels < 8 && specialMovement == "fly" && druid.data.data.subclass !== subClassName)) {
                continue;
            }
            else if ((druid.data.data.levels < 4 && specialMovement == "swim" && druid.data.data.subclass !== subClassName)){
                continue;
            }
            else if ((druid.data.data.levels < 8 && specialMovement == "fly" && druid.data.data.subclass === subClassName)){
                continue;
            }
            else if ((druid.data.data.levels < 4 && specialMovement == "swim" && druid.data.data.subclass === subClassName)){
                continue;
            }
            else {
                if (shapeOption.data.data.details.cr > maxCR) {
                    continue;
                }
                beastDialogOptions += `<option value=${shapeOption.id}> ${shapeOption.name} | ${shapeOption.data.data.attributes.hp.value} hit-points | ${shapeOption.data.data.details.cr} CR</option>`;
            }
        }
    }
    let dialogOptions = type == "beast" ? beastDialogOptions : elemDialogOptions;
    let dialogContent = `<form>
                        <h2> Select your shape here </h2>
                        <div class="form-group"><label>Shape name:</label><select name="shape">${dialogOptions}</select></div>
                        </form>`;
    new Dialog({
        title: "Beast Wild Shape",
        content: dialogContent,
        buttons: {
            accept_button: {
                label: `<i class="fas fa-paw"></i>Wild Shape!`,
                callback: async (html) => {
                    await substractCharge(type)
                    const shapeId = html.find("[name=shape]")[0].value;
                    const newShape = compendium.find(shape => shape.id === shapeId)
                    await ChatMessage.create({content: `${macroToken.actor.name} turns into a ${newShape.name}`, speaker:{alias: macroToken.actor.name}, type: CONST.CHAT_MESSAGE_TYPES.OOC});
                    const [newToken] = await macroToken.actor.transformInto(newShape, {
                        keepMental: true,
                        keepClass: true,
                        mergeSaves: true,
                        mergeSkills: true,
                    });
                    if (druid.data.data.levels > 5) {
                        const updates = newToken.actor.itemTypes.weapon.filter(i => i.data.data.weaponType === "natural").map(i => ({_id: i.id, "data.properties.mgc": true}));
                        await newToken.actor.updateEmbeddedDocuments("Item", updates);
                    }
                }
            }
        },
        default: "accept_button"
    }).render(true);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
