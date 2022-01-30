// 5e party long rest command for the GM //
Main();
async function Main(){
    let macroActors = game.actors.filter(a => a.data.type == "character");
    for (let macroActor of macroActors) {
        await macroActor.longRest({dialog: false, chat: true, newDay: true});
    }
}