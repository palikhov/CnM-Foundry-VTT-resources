// in DAE set to either macro execute or item macro, make sure to include @target as the value.
(async()=>{
const barb = canvas.tokens.get(args[1]);
let get_center = barb.center;
async function aoe_aura(barb, get_center){
const get_texture = 'modules/jb2a_patreon/Library/3rd_Level/Call_Lightning/CallLightning_01_Blue_1000x1000.webm';
const find_template = canvas.templates.placeables.find(i => i.data.user === game.user.id && i.data.texture === get_texture);
if(!find_template){
    const templateData = [{
    borderColor : "#6b6b6b",
    direction : 40,
    distance : "13",
    fillColor : "#ffffff",
    locked : false,
    tmfxPreset : "Bloomed Texture",
    tmfxTextureAlpha : 0.5,
    t : "circle",
    user : game.user.id,
    x : get_center.x,
    y : get_center.y,
    texture: get_texture
  }];
    await MeasuredTemplate.create(templateData);
  }
  else {
    await find_template.update({"x": get_center.x, "y": get_center.y});
  }
}
async function stormTemplate(scene, token, update, flags, id) {
  let target = await canvas.tokens.get(args[1]);
  let movement = await getProperty(update, "x") || await getProperty(update, "y");
  if (movement !== undefined) {
    if (target.id === barb.id) get_center = barb.center;
    aoe_aura(barb, get_center);
    }
}

if(args[0] === "on"){
const hookId = Hooks.on("updateToken", stormTemplate);
DAE.setFlag(barb.actor, "rageTemplate", hookId);
aoe_aura(barb, get_center);
}

if(args[0] === "off"){
const hookId = DAE.getFlag(barb.actor, "rageTemplate");
Hooks.off("updateToken", hookId);
DAE.unsetFlag(barb.actor, "rageTemplate");
let find_template = canvas.templates.placeables.find(i => i.data.user === game.user.id && i.data.texture === get_texture).delete();
}
})();