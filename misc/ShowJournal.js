const dialogOptions = game.journal.reduce((acc, e) => acc += `<option value=${e.id}>Journal Entry: ${e.name} </option>`, ``);
const dialogTemplate = `<form>
    <h1> Pick a Journal Entry to show </h1>
    <div class="form-group"><
        label>Journal:</label>
        <div class="form-fields">
            <select id="journal">${dialogOptions}</select>
        </div>
    </div>
    div class="form-group"><
        label>Show Image?</label>
        <div class="form-fields">
            <input id="image" type="checkbox">
        </div>
    </div>
</form>`;
new Dialog({
    title: "Show Journal:",
    content: dialogTemplate,
    buttons: {
        show: {
            label: "Show!",
            callback: (html) => {
                const journalId = html.find("#journal")[0].value;
                const checked = html.find("#image")[0].checked;
                const showJournal = game.journal.get(journalId);
                let type = "image";
                if (!checked) {
                    type = "text";
                }
                showJournal.show(type, true);
            }
        }
    },
    default: "show"
},{
    height: 200,
    width: 500
}).render(true);
