// This macro is straight active effects toggle
let sharpshooter = async function() {
    const effectName = "Sharpshooter";
    const target = canvas.tokens.controlled[0] || game.user.character.getActiveTokens()[0];
    const img = "systems/dnd5e/icons/skills/yellow_34.jpg";
    let the_message = "";
    if (target.actor.effects.find(ef=> ef.data.label === effectName)) {
        let effect_id = await target.actor.effects.find(ef=> ef.data.label === effectName).id;
        await target.toggleEffect(img, {active : false});
        await target.actor.deleteEmbeddedEntity("ActiveEffect", effect_id);
        the_message = `<em>${target.name} is aiming <strong>Normally</strong> now.</em>`;
        } else {
            let effectData = {
                label : effectName,
                icon : img,
                changes: [{
                    "key": "data.bonuses.rwak.damage",
                    "mode": 0,
                    "value": "+10",
                    "priority": 0
                    }, {
                   "key": "data.bonuses.rwak.attack",
                   "mode": 0,
                   "value": "-5",                   
                   "priority": 0
                   }]
                }
            await target.actor.createEmbeddedEntity("ActiveEffect", effectData);
            await target.toggleEffect(img, {active:true});
            the_message = `<em>${target.name} is aiming <strong>Carefully</strong> now!</em>`;
        }
        ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({token: target}),
            content: the_message,
            type: CONST.CHAT_MESSAGE_TYPES.EMOTE
        });
    };
sharpshooter();
