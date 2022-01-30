async function moveX(direction, fine) {
    let distance = fine ? 1 : 10;
    distance = direction == "left" ? (distance * (-1)) : distance;
    const tilesToMove = canvas.background.controlled.length ? canvas.background.controlled : canvas.foreground.controlled;
    const updates = tilesToMove.map(tile => ({
        _id: tile.id,
        x: (tile.data.x + distance)
    }));
    await canvas.scene.updateEmbeddedDocuments("Tile", updates);
}

async function moveY(direction, fine) {
    let distance = fine ? 1 : 10;
    distance = direction == "up" ? (distance * (-1)) : distance;
    const tilesToMove = canvas.background.controlled.length ? canvas.background.controlled : canvas.foreground.controlled;
    const updates = tilesToMove.map(tile => ({
        _id: tile.id,
        y: (tile.data.y + distance)
    }));
    await canvas.scene.updateEmbeddedDocuments("Tile", updates);
}

async function rotate(direction, fine) {
    let updates = [];
    if(direction !== "zero") {
        let increment = fine ? 5 : 45;
        increment = direction === "cw" ? increment : increment * -1;
        const tilesToMove = canvas.background.controlled.length ? canvas.background.controlled : canvas.foreground.controlled;
        updates = tilesToMove.map(tile => ({
            _id: tile.id,
            rotation: (tile.data.rotation + increment)%360
        }));
    }
    else {
        const tilesToMove = canvas.background.controlled.length ? canvas.background.controlled : canvas.foreground.controlled;
        updates = tilesToMove.map(tile => ({
            _id: tile.id,
            rotation: 0
        }));  
    }
    await canvas.scene.updateEmbeddedDocuments("Tile", updates);
}

async function handleEvents(html) {
    html.find("a.direction-button").click(function(){
        const fine = html.find("input[name=control]")[0].checked;
        if(this.className.includes("move-right"))   moveX("right", fine);
        if(this.className.includes("move-left"))    moveX("left",  fine);
        if(this.className.includes("move-up"))      moveY("up",    fine);
        if(this.className.includes("move-down"))    moveY("down",  fine);
        if(this.className.includes("rotate-right")) rotate("cw",   fine);
        if(this.className.includes("rotate-left"))  rotate("acw",  fine);
        if(this.className.includes("rotate-reset")) rotate("zero", fine);
    });
}
const style = `<style>
    #tile-mover-dialog .direction-button-box{
        display: flex;
        justify-content: space-evenly;
    }
    #tile-mover-dialog .direction-button {
            font-size: 2em;
            text-align: center;
            width: 60px;
            height: 40px;
            background-color: #bdbdbd8f;
            border-radius: 3px;
            line-height: 40px;
            border: 2px groove var(--color-border-light-highlight);
    }
</style>`;

const content = style + `<fieldset><legend>Move</legend><div class="direction-button-box">
    <a class="direction-button move-left"><i class="fas fa-long-arrow-alt-left"></i></a>
    <a class="direction-button move-up"><i class="fas fa-long-arrow-alt-up"></i></a>
    <a class="direction-button move-down"><i class="fas fa-long-arrow-alt-down"></i></a>
    <a class="direction-button move-right"><i class="fas fa-long-arrow-alt-right"></i></a>
</div></fieldset>
<hr>
<fieldset><legend>Rotate</legend><div class="direction-button-box">
    <a class="direction-button rotate-left"><i class="fas fa-undo"></i></a>
    <a class="direction-button rotate-reset"><i class="fab fa-creative-commons-zero"></i></a>
    <a class="direction-button rotate-right"><i class="fas fa-redo"></i></a>
</div></fieldset>
<hr>
<form>
    <div class="form-group">
        <label>Fine control?</label>
        <div class="form-fields">
            <input name="control" type="checkbox" checked/>
        </div>
    </div>
    <p>Fine <i class="fas fa-arrows-alt"></i>: 1 pixel, <i class="fas fa-redo"></i>: 5 degrees</p>
    <p>Normal <i class="fas fa-arrows-alt"></i>: 10 pixels, <i class="fas fa-redo"></i>: 45 degrees</p>
</form>
<hr>`;

let d = new Dialog({
    title: "Tile mover",
    content,
    buttons: {
        close: {
            label: "Close"
        }
    },
    render: handleEvents
},
{
    width: 280,
    id: "tile-mover-dialog"
});

d.render(true);
