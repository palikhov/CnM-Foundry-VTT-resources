// lists all player controlled character and sorts by the highest.
let passive_score = "";
let target_list = game.actors.filter(i=> i.data.type === "character" && i.hasPlayerOwner).sort((a,b) => a.data.data.skills.prc.passive > b.data.data.skills.prc.passive ? -1 : 1);
for(let target of target_list){
passive_score += `<tr><td>${target.name}</td><td>${target.data.data.skills.prc.passive}</td></tr>`;
}
let the_message = `<table><thead><tr><td>Name</td><td>Score</td></tr></thead><tbody>${passive_score}</tbody></table>`;
ChatMessage.create({
            speaker: ChatMessage.getSpeaker({alias: "Passive Perceptions"}),
            whisper: ChatMessage.getWhisperRecipients("GM"),
            content: the_message,
});
