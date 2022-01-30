// Ok for this to work, you need to create a custom condition in CUB to apply itself with DE. Set it for 1 turn duration.
// Place this macro with Item macro in DE item macro @target @item on to your bow.
// when fired it will deal an extra d8 then remove itself.
let ActiveEffect = game.macros.getName("ActiveEffect");
let target = canvas.tokens.get(args[1])
let itemD = args[2];
let me = canvas.tokens.controlled[0];
if(args[0] === "on") {
if (me.actor.effects.entries.find(ef=> ef.data.label==="Dread Ambusher")) {
let damageRoll = new Roll(`1d8`).roll();
new MidiQOL.DamageOnlyWorkflow(actor, token, damageRoll.total, "piercing", [target], damageRoll, {flavor: "Dread Ambusher - Damage Roll (Piercing)"})
ActiveEffect.execute(me.id, itemD.name, "remove");
}
}