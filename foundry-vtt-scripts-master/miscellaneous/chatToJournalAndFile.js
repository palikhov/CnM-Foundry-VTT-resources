const folderName = "Chatlog repository" // name this something unique for your world.
let folder = game.folders.getName(folderName);
if(!folder) {
    [folder] = await Folder.createDocuments([{name: folderName, type: "JournalEntry"}])
}
const folderId = folder.id;
const date = new Date().toDateString();
const journalName = `Session ${date}`;
const fileName = `fvtt-log-${date.replace(/\s/g, "-")}.txt`;
let entry = game.journal.entities.find(e => e.name === journalName);
if(!entry) {
    let messages = game.messages.contents.filter(m => !m.data.roll && !m.data.content.includes("<div "));
    let journalContent = "";
    let fileContent = "";
    for (let message of messages) {
        let time = new Date(message.data.timestamp).toLocaleDateString(`en-GB`, {weekday: "short", hour: "numeric", minute: "numeric", second: "numeric"});
        let messageAuthor = message.data.speaker.alias !== undefined ? message.data.speaker.alias : "GM";
        let messageContent = message.data.content;
        journalContent += `<p>[${time}] ${messageAuthor}:</p><p>${messageContent}</p><p>--------------------------</p>`;
        fileContent += `[${time}] ${messageAuthor}:\n${messageContent}\n--------------------------\n`;
    }
    await JournalEntry.create({folder: folderId, name: journalName, content: journalContent, "permission.default": 3}, {renderSheet: true});
    saveDataToFile(fileContent, "text/plain", fileName);
}
else return ui.notifications.warn(`Journal - ${journalName} already exists`);
