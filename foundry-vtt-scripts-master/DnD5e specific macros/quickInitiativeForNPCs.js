const groupSize = 5;
if(!game.combat) await Combat.create({scene: canvas.scene.id, active: true});
const lairToken = canvas.tokens.placeables.find(t => t.name === "Lair");
const combat = game.combat;
let combatants = [];
let unsetCombatants = [];
let toCreate = [];
const npcTokens = canvas.tokens.placeables.filter(t => !t.actor.hasPlayerOwner);
if(npcTokens.length){
    for(let t of npcTokens){
        if(t.inCombat) continue;
        toCreate.push({tokenId: t.id, hidden: t.data.hidden});
    }
    const created = await combat.createEmbeddedDocuments("Combatant", toCreate);
    combatants = created.filter(c => c.name !== "Lair");
    for(let c of combatants) {
        if(c.initiative === null){
            await combat.rollInitiative(c.id);
            let similarCombatants = game.combat.combatants.filter(sc => sc.name === c.name && sc.id !== c.id && sc.initiative === null);
            if (similarCombatants.length > 1 && groupSize > 1) {
                for(let i = 0; i < groupSize - 1; i++) {
                    if(similarCombatants[i] === undefined) break;
                    await combat.setInitiative(similarCombatants[i].id, c.initiative);
                }
            }
        }
    }
    if(!lairToken) return;
    await combat.rollInitiative([game.combat.combatants.find(c=> c.data.tokenId === lairToken.id).id], {formula: "20"});
}
