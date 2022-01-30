(async () => {
    let player = canvas.tokens.get(args[0].tokenId);
    let target = canvas.tokens.get(args[0].targets[0].id);
    let playerRoll = await player.actor.rollSkill('acr', { chatMessage: false });
    let rollType = playerRoll.terms[0].modifiers[0] === "kh" ? " (Advantage)" : playerRoll.terms[0].modifiers[0] === "kl" ? " (Disadvantage)" : "";
    game.dice3d?.showForRoll(playerRoll);
    let targetRoll = await target.actor.rollSkill('acr', { chatMessage: false, fastForward: true });
    game.dice3d?.showForRoll(targetRoll);
    let playerWin = "";
    let targetWin = "";
    playerRoll.total >= targetRoll.total ? playerWin = `success` : targetWin = `success`;
    let damage_results = `
    <div class="flexrow 2">
    <div><div style="text-align:center">${player.name}</div></div><div><div style="text-align:center">${target.name}</div></div>
    </div>
    <div class="flexrow 2">
        <div>
            <div style="text-align:center">Acrobatics${rollType}</div>
            <div class="dice-roll">
                <div class="dice-result">
                    <div class="dice-formula">${playerRoll.formula}</div>
                    <div class="dice-tooltip">
                        <div class="dice">
                            <header class="part-header flexrow">
                                <span class="part-formula">${playerRoll.formula}</span>
                                <span class="part-total">${playerRoll.total}</span>
                            </header>
                        </div>
                    </div>
                    <h4 class="dice-total ${playerWin}">${playerRoll.total}</h4>
                </div>
            </div>
        </div>
        <div>
            <div style="text-align:center">Acrobatics</div>
            <div class="dice-roll">
                <div class="dice-result">
                    <div class="dice-formula">${targetRoll.formula}</div>
                    <div class="dice-tooltip">
                        <div class="dice">
                            <header class="part-header flexrow">
                                <span class="part-formula">${targetRoll.formula}</span>
                                <span class="part-total">${targetRoll.total}</span>
                            </header>
                        </div>
                    </div>
                    <h4 class="dice-total ${targetWin}">${targetRoll.total}</h4>
                </div>
            </div>
        </div>
        
    </div>`;
    const chatMessage = game.messages.get(args[0].itemCardId);
    let content = duplicate(chatMessage.data.content);
    const searchString = /<div class="midi-qol-other-roll">[\s\S]*<div class="end-midi-qol-other-roll">/g;
    const replaceString = `<div class="midi-qol-other-roll"><div class="end-midi-qol-other-roll">${damage_results}`;
    content = content.replace(searchString, replaceString);
    chatMessage.update({ content: content });
})();