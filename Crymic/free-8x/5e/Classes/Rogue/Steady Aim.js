let steadyAim = async function() {

   const a = canvas.tokens.controlled[0]?.actor || game.user.character;
   const t = canvas.tokens.controlled[0];
   const img = "systems/dnd5e/icons/skills/arrow_02.jpg";

       if (a.effects.entries.find(ef=> ef.data.label === "Sharpshooter")) {
         let sharp_id = await a.effects.entries.find(ef=> ef.data.label === "Sharpshooter").id;
         t.toggleEffect(img);
         await a.deleteEmbeddedEntity("ActiveEffect", sharp_id);
         let the_message = `<em>${actor.name} relaxes their aim.</em>`;
         ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({token: a}),
            content: the_message,
            type: CONST.CHAT_MESSAGE_TYPES.EMOTE
         });
       } else {
           let effectData = {
               label : "Steady Aim",
               icon : img,
               changes: [{
                   "key": "data.attributes.movement.walk",
                   "mode": 5,
                   "value": 0,
                   "priority": 20
               },
               {
                   "key": "flags.midi-qol.advantage.attack.rwak",
                   "value": 1,
                   "mode": 2,
                   "priority": 20
               }]
           }
           t.toggleEffect(img);
           await a.createEmbeddedEntity("ActiveEffect", effectData);
           let the_message = `<em>${actor.name} steadies their aim.</em>`;
           ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({token: a}),
            content: the_message,
            type: CONST.CHAT_MESSAGE_TYPES.EMOTE
         });
       }
        
};
steadyAim();
