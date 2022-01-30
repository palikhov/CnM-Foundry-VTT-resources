// Allows the GM to change other user's hotbar from the GM client, in case of a player screwing up / prepping an adventure with ready made actors 
// and macros for the players.
// v9 tested only, but probably works in v0.89 of FoundryVTT.

function userSelect() {
    const select = $("#macro-placement-dialog select[name=user-id]");
    const userId = select[0].value;
    const user = game.users.get(userId);
    const rows = [1,2,3,4,5].reduce((rows, tab, i)=> {
        const row = [1,2,3,4,5,6,7,8,9,10].reduce((row, pos) => {
            pos = pos + (i * 10);
            const img = !game.macros.get(user.data.hotbar[pos]) ? "" : game.macros.get(user.data.hotbar[pos]).data.img;
            const hoverText = !game.macros.get(user.data.hotbar[pos]) ? "Empty" : game.macros.get(user.data.hotbar[pos]).data.name;
            return row += `<a class="macro-slot slot-${pos}"><img src="${img}"><span class="hover-text">${hoverText}</span></a>`;
        }, `<div class="tab-label">Bar ${tab}:</div>`);
        rows.push(row);
        return rows;
    },[]);
    for(let i = 0; i < 5; i++) {
        let element = $(`.row${i+1}`);
        element.empty();
        element.append(rows[i]);
    }
    $("#macro-placement-dialog a.macro-slot").click(macroLeftClick);
    $("#macro-placement-dialog a.macro-slot").contextmenu(macroRightClick);
}

async function macroLeftClick(event){
    const macroId = $("#macro-placement-dialog select[name=macro-id]")[0].value;
    const userId = $("#macro-placement-dialog select[name=user-id]")[0].value;
    const slotNumber = Number(Array.from(event.currentTarget.classList)[1].split("-")[1]);
    const user = game.users.get(userId);
    let hotbar = duplicate(user.data.hotbar);
    hotbar[slotNumber] = macroId;
    await user.update({hotbar},{diff: false, render: true, recursive: false, noHook: true});
    userSelect();
}

async function macroRightClick(event){
    const userId = $("#macro-placement-dialog select[name=user-id]")[0].value;
    const slotNumber = Number(Array.from(event.currentTarget.classList)[1].split("-")[1]);
    const user = game.users.get(userId);
    let hotbar = duplicate(user.data.hotbar);
    delete hotbar[slotNumber];
    await user.update({hotbar}, {diff: false, render: true, recursive: false, noHook: true});
    userSelect();
}

async function handleEvents(html) {
    html.find("[name=user-id]").change(userSelect);
    userSelect();
}

const sortedMacros = game.macros.contents.sort((a,b) => {
    if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if(a.name.toLowerCase() === b.name.toLowerCase()) return 0;
});
const optionsMacro = sortedMacros.reduce((acc, e) => acc += `<option value="${e.id}">${e.name}</option>`,``);
const optionsUser = game.users.reduce((acc, e) => acc += `<option value="${e.id}">${e.name}</option>`,``);

const style = `<style>
    #macro-placement-dialog .window-content {
        background: none;
        color: white;
    }
    #macro-placement-dialog img {
        border: none;
    }
    #macro-placement-dialog select {
        background-color: #CCC;
    }
    #macro-placement-dialog .macro-box-row {
        display: flex;
        justify-content: space-between;
        padding: 10px;
    }
    #macro-placement-dialog .macro-slot {
        width: 75px;
        height: 75px;
        border: 2px solid #CCC;
    }
    #macro-placement-dialog .tab-label {
        line-height: 75px; 
    }
    #macro-placement-dialog a.macro-slot:hover{
        border: 2px solid red;
    }
    #macro-placement-dialog .hover-text{
        visibility: hidden;
        width: max-content;
        background-color: white;
        color: #000;
        text-align: center;
        border-radius: 6px;
        padding: 5px 5px;
        position: absolute;
        z-index: 1;
    }
    #macro-placement-dialog .macro-slot:hover .hover-text {
        visibility: visible;
    }
</style>`;
const content = style + `<form>
    <div class="form-group">
        <label>User:</label>
        <div class="form-fields">
            <select name="user-id">${optionsUser}</select>
        </div>
    </div>
    <div class="form-group">
        <label>Macro:</label>
        <div class="form-fields">
            <select name="macro-id">${optionsMacro}</select>
        </div>
    </div>
    <hr>
    <div class="macro-box-row row1"></div>
    <div class="macro-box-row row2"></div>
    <div class="macro-box-row row3"></div>
    <div class="macro-box-row row4"></div>
    <div class="macro-box-row row5"></div>
</form>`;

new Dialog ({
    title: "Hotbar Management Tool",
    content,
    buttons: {},
    render: handleEvents
},{
    id: "macro-placement-dialog",
    width: 900
}).render(true);
