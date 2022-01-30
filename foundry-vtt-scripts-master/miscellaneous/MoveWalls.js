// Author: Freeze#2689 on Discord.
// foundry ver 0.88
// how to use: activate Walls layer, select ONE wall segment you want to fine tune, then run this macro. Use the arrow buttons in the Dialog to fine tune the movement.

async function MoveX(direction, k, distance) {
    distance = direction == "left" ? distance * -1 : distance;
    if(canvas.walls.controlled.length > 1) return ui.notifications.warn("too many wallsegments selected.");
    const wallToMove = canvas.walls.controlled;
    let c = duplicate(wallToMove[0].data.c);
    const joinedWall = canvas.walls.placeables.filter(w => ((w.data.c[0] === c[k] && w.data.c[1] === c[k + 1]) || (w.data.c[2]=== c[k] && w.data.c[3] === c[k + 1])) && w.id !== wallToMove[0].id);
    const joinedWallUpdates = joinedWall.map(wall => {
        let coords = duplicate(wall.data.c);
        if (coords[1] === c[k+1] && coords[0] === c[k]) { coords[0] += distance; }
        if (coords[3] === c[k+1] && coords[2] === c[k]) { coords[2] += distance; }
        return {_id: wall.id, c: coords};
    });
    c[k] += distance;
    let updates = wallToMove.map(wall => ({ _id: wall.id, c}));
    updates = updates.concat(joinedWallUpdates);
    await canvas.scene.updateEmbeddedDocuments("Wall", updates);
}

async function MoveY(direction, k, distance) {
    if(canvas.walls.controlled.length > 1) return ui.notifications.warn("too many wallsegments selected.");
    distance = direction == "up" ? distance * -1 : distance;
    let wallToMove = canvas.walls.controlled;
    let c = duplicate(wallToMove[0].data.c);
    const joinedWall = canvas.walls.placeables.filter(w => ((w.data.c[1] === c[k] && w.data.c[0] === c[k - 1]) || (w.data.c[3]=== c[k] && w.data.c[2] === c[k - 1])) && w.id !== wallToMove[0].id);
    const joinedWallUpdates = joinedWall.map(wall => {
        let coords = duplicate(wall.data.c);
        if (coords[0] === c[k-1] && coords[1] === c[k]) { coords[1] += distance; }
        if (coords[2] === c[k-1] && coords[3] === c[k]) { coords[3] += distance; }
        return {_id: wall.id, c: coords};
    });
    c[k] += distance;
    let updates = wallToMove.map(wall => ({ _id: wall.id, c}));
    updates = updates.concat(joinedWallUpdates);
    await canvas.scene.updateEmbeddedDocuments("Wall", updates);
}
let d = new Dialog({
    title: "Wall mover",
    content: `<style>
                    #wall-mover-dialog .dialog-buttons {
                        flex-direction: column;
                    }
              </style>
              <h2>Move your Wall</h2>
              <p>-normal click: 1px</p><p>-shift + click: 10px</p>
             `,
    buttons: {
        spacer1: {
            label: `Node 1`,
            callback: () => {
                d.render(true);
            }
        },
        left1: {
            label: `<i class="fas fa-angle-left"></i>`,
            callback: async (html) => {
                let distance = event.shiftKey ? 10 : 1;
                d.render(true);
                await MoveX("left", 0, distance);
            }
        },
        right1: {
            label: `<i class="fas fa-angle-right"></i>`,
            callback: async (html) =>  {
                let distance = event.shiftKey ? 10 : 1;
                d.render(true);
                await MoveX("right", 0, distance);
            }
        },
        up1: {
            label: `<i class="fas fa-angle-up"></i>`,
            callback: async (html) => {
                let distance = event.shiftKey ? 10 : 1;
                d.render(true);
                await MoveY("up", 1, distance);
            }
        },
        down1: {
            label: `<i class="fas fa-angle-down"></i>`,
            callback: async (html) => {
                let distance = event.shiftKey ? 10 : 1;
                d.render(true);
                await MoveY("down", 1, distance);
               }
        },
        spacer2: {
            label: `Node 2`,
            callback: () => {
                d.render(true);
            }
        },
        left2: {
            label: `<i class="fas fa-angle-left"></i>`,
            callback: async (html) => {
                let distance = event.shiftKey ? 10 : 1;
                d.render(true);
                await MoveX("left", 2, distance);
            }
        },
        right2: {
            label: `<i class="fas fa-angle-right"></i>`,
            callback: async (html) =>  {
                let distance = event.shiftKey ? 10 : 1;
                d.render(true);
                await MoveX("right", 2, distance);
            }
        },
        up2: {
            label: `<i class="fas fa-angle-up"></i>`,
            callback: async (html) => {
                let distance = event.shiftKey ? 10 : 1;
                d.render(true);
                await MoveY("up", 3, distance);
            }
        },
        down2: {
            label: `<i class="fas fa-angle-down"></i>`,
            callback: async (html) => {
                let distance = event.shiftKey ? 10 : 1;
                d.render(true);
                await MoveY("down", 3, distance);
               }
        },
    },
},{
    id: "wall-mover-dialog",
    width: 175
});

d.render(true);
