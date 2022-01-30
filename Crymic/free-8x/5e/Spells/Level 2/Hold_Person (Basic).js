// DAE set Duration Macro repeat to End of each turn.
const lastArg = args[args.length-1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const itemD = lastArg.efData.flags.dae.itemData;
const saveType = itemD.data.save.ability;
const DC = itemD.data.save.dc;

if(args[0] === "each") {
  const save = await tactor.rollAbilitySave(saveType, { flavor : `${CONFIG.DND5E.abilities[saveType]} Saving Throw: DC ${DC}`, fastForward: true}); 
  if (save.total >= DC) {
    await tactor.deleteEmbeddedDocuments("ActiveEffect", [lastArg.effectId]);
    let the_message = `${tactor.name} shrugs off the effects of ${itemD.name}!`;
    ChatMessage.create({
        speaker: ChatMessage.getSpeaker({actor: tactor}),
        content: the_message,
        type: CONST.CHAT_MESSAGE_TYPES.EMOTE
    });
  }
}
