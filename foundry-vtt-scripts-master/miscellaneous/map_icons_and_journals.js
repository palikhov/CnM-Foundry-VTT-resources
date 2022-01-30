//use this macro in conjunction with map_icons_and_journals.json from the same gitlab you got this macro from.

async function makeNotes(data) {
    const parentFolder = "Geography";
    for (let key of Object.keys(data)) {
        console.log(key, parentFolder);
        let folderId = game.folders.find(f => f.name === key && f.parentFolder.name === parentFolder )?.id;
        if(!folderId) folderId = (await Folder.createDocuments([{name: key, parent: game.folders.getName(parenFolder).id, type: "JournalEntry"}]))[0].id;
        const journalData = data[key].map(d => ({
            name: d.name,
            content: d.content,
            folder: folderId
        }));
        const created = await JournalEntry.createDocuments(journalData);
        const noteData = created.map((n, i) => ({
            entryId: n.id,
            fontSize: 20,
            iconSize: 32,
            x: data[key][i].x,
            y: data[key][i].y,
            icon: data[key][i].icon,
            iconTint: data[key][i].color,
            textAnchor: CONST.TEXT_ANCHOR_POINTS.CENTER
        }));
        await canvas.scene.createEmbeddedDocuments("Note", noteData);
        await new Promise(resolve => {setTimeout(resolve, 1000);});
    }
}

new Dialog({
    title: "test",
    content: `<input id="file-selector" type="file"/>`,
    buttons: {
        ok: {
            label: "ok",
            callback: (html) => {
                let JSONfile = html.find("#file-selector")[0].files.item(0);
                let reader = new FileReader();
                reader.readAsText(JSONfile);
                reader.onload = async function () {
                    let JSONstring = reader.result;
                    let data = JSON.parse(JSONstring);
                    makeNotes(data);
                };
            }
        }
    }
}).render(true);
