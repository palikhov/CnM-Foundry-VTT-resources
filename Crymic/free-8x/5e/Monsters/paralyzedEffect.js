// DAE Effect
// DAE set Duration Macro repeat to End of each turn.
const lastArg = args[args.length-1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
let item = lastArg.efData.flags.dae.itemData;
const saveType = args[1];
const DC = args[2];

if(args[0] === "each") {
  const flavor = `${item?.name || ""} ${CONFIG.DND5E.abilities[saveType]} DC${DC}`;
  let save = (await tactor.rollAbilitySave(saveType, {flavor, fastForward: true})).total; 
  if (save >= DC) {
    await tactor.deleteEmbeddedDocuments("ActiveEffect", [lastArg.effectId]);
    let the_message = `${tactor.name} shrugs off the effects of ${item?.name}!`;
    ChatMessage.create({
        speaker: ChatMessage.getSpeaker({actor: tactor}),
        content: the_message,
        type: CONST.CHAT_MESSAGE_TYPES.EMOTE
    });
  }
}
