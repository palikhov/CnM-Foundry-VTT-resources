async function captureClick(fn, remove = true){
  const m = () => canvas.app.renderer.plugins.interaction.mouse.getLocalPosition(canvas.app.stage);
  const c = (p) => canvas.grid.getCenter(p.x,p.y);

  return await new Promise(async (resolve) => {
    $(document.body).on("click", async (e) => {
      if(remove) $(document.body).off("click");
      resolve(fn(e,m(),c(m())));
    });
  });
}

let tokens = [];
if(event.shiftKey) {
    console.log(canvas.tokens.placeables);
    tokens = canvas.tokens.placeables.filter(t => t.actor.type === "character" && t.actor.hasPlayerOwner);
}
else {
    tokens = canvas.tokens.controlled;
}
await new Promise(resolve => {setTimeout(resolve, 100)});
ui.notifications.warn(`Click to relocate!`);
await captureClick(async (event, position, grid) => {
    let update = tokens.map((t,i) => ({_id: t.id, x: grid[0] - canvas.grid.size / 2 + i * (canvas.grid.size / 2), y: grid[1] - canvas.grid.size / 2 + i * (canvas.grid.size / 2)}));
    console.log(`Click Captured | `, {event, position, grid});
    return await canvas.scene.updateEmbeddedDocuments("Token", update, {animate:false});
});

ui.notifications.info("Done!");
