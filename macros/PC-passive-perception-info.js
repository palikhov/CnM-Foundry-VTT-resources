const partyFolderName = "Players";

const party = game.folders.getName(partyFolderName).content;
const scores = party
  .map((actor) => {
    return { name: actor.name, score: actor.data.data.skills.prc.passive };
  })
  .sort((a, b) => b.score - a.score);

const output =
  "<table><thead style='text-align:left;'><tr><th style='padding-left:0.25em'>Character</th><th>Passive Perception</th></tr></thead><tbody>" +
  scores
    .map(
      (data) =>
        `<tr><td style='padding-left:0.25em'><b>${data.name}</b></td><td>${data.score}</td></tr>`
    )
    .join("") +
  "</tbody></table>";

let passivePerceptionDialog = new Dialog({
  title: "Passive Perception Scores",
  content: output,
  buttons: {
    chat: {
      icon: '<i class="fas fa-comments"></i>',
      label: "Send to chat",
      callback: () => {
        ChatMessage.create({
          user: game.user._id,
          speaker: ChatMessage.getSpeaker({ token: actor }),
          content: output,
        });
        passivePerceptionDialog.render(true);
      },
    },
  },
}).render(true);
