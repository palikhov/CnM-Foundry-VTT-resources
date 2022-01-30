// Hotbar Toggle macro
let greatweaponMaster = async function() {
    const effectName = "Great Weapon Master";
    const target = canvas.tokens.controlled[0] || game.user.character.getActiveTokens()[0];
    const img = "systems/dnd5e/icons/skills/red_12.jpg";
    let the_message = "";
    if (target.actor.effects.find(ef=> ef.data.label === effectName)) {
        let effect_id = await target.actor.effects.find(ef=> ef.data.label === effectName).id;
        await target.actor.deleteEmbeddedDocuments("ActiveEffect", [effect_id]);
        the_message = `<em>${target.name} is swinging <strong>Normally</strong> now.</em>`;
        } else {
            let effectData = {
                label : effectName,                
                icon : img,
                changes: [{
                    "key": "data.bonuses.mwak.damage",
                    "mode": 0,
                    "value": "+10",
                    "priority": 0
                    }, {
                   "key": "data.bonuses.mwak.attack",
                   "mode": 0,
                   "value": "-5",                   
                   "priority": 0
                   }],
                   duration: {rounds: 1,seconds: 6, startTime: game.time.worldTime },
                   disabled: false
                }
            await target.actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
            the_message = `<em>${target.name} is swinging <strong>Harder</strong> now!</em>`;
        }
        ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({token: target}),
            content: the_message,
            type: CONST.CHAT_MESSAGE_TYPES.EMOTE
        });
    };
greatweaponMaster();
