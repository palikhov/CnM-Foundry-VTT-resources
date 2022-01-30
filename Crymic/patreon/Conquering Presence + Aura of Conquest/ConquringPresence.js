// DAE Macro
// Macro Repeat: End of Each Turn
(async () => {
    const lastArg = args[args.length - 1];
    let tactor;
    if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
    else tactor = game.actors.get(lastArg.actorId);
    const item = lastArg.efData.flags.dae.itemData;
    const origin = lastArg.origin;
    const DC = item.data.save.dc;
    if (args[0] === "each") {
        let workflow = await MidiQOL.Workflow.getWorkflow(origin);
        let itemCard = await MidiQOL.showItemCard.bind(workflow.item)(false, workflow, false);
        workflow.itemCardId = await itemCard.id;
        await workflow.checkSaves(false);
        await workflow.displaySaves(false, true);
        let save = await workflow.saveResults[0];
        await ui.chat.scrollBottom();
        game.dice3d?.showForRoll(save);
        if (await save.total >= DC) {
            let effectList = [];
            effectList.push(lastArg.effectId);
            effectList.push(tactor.effects.find(i => i.data.label === "Aura of Conquest").id);
            await tactor.deleteEmbeddedDocuments("ActiveEffect", effectList);
        }
    }
})();