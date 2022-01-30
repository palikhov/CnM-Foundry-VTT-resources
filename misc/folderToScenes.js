/**
 * experimental!
 *
 * this macro will create a scenes folder named after the folder your files are in.
 * it will automatically create the scenes with the name of the file as name of the scene.
 * you will have to provide a dpi of the maps, so if some are of different dpi, this will require editing later i suggest using the most common one in the dialog.
 * the path you need to enter => modules/some module/maps  or   worlds/myworld/battlemaps etc. as long as the last folder is indeed where the pngs or webps are located.
 */
 


async function createScenes(html) {
    // setting the folder and the resolution
    let folder = html.find("[name=folder]")[0].value;
    let dpi = parseInt(html.find("[name=resolution]")[0].value) || 100;
    // getting the files from the designated folder...
    let battleMapsList = await FilePicker.browse("data", folder);
    let battleMaps = battleMapsList.files;
    // preparing data for the Scene creation.
    let folderName = folder.replace(/\//g, "-");  // removes  "/" in favor of "-"
    let gameFolder = await Folder.create({parent: null, name: folderName, type:"Scene"}); // creates the folder to dump in the scenes.
    // here we iterate over each file in the data folder.
    for(let battleMap of battleMaps) {
        let imageFile = new Image();   // this is all to get the dimensions of the image.
        imageFile.onload = async function () {
            battleMap = battleMap.replace(/%20/g, " ");
            let extensionLength = battleMap.length - battleMap.lastIndexOf(".");
            let battleMapName = battleMap.substring(battleMap.lastIndexOf("/") + 1, battleMap.length - extensionLength);
            battleMapName = battleMapName.replace(/_/g, " ");
            let dimensions = {width: this.width, height: this.height}
            //here we actually create the scene!
            await Scene.create({name: battleMapName, img: battleMap, folder: gameFolder.id, navigation: false, padding: 0.05, grid: dpi, width: dimensions.width, height: dimensions.height});
        }
        imageFile.src = battleMap;

        
    }
}

let dialogContent = `<div>Choose the correct folder your battlemaps are located in:</div>
                    <div><input name="folder" size=50 placeholder="assets/maps" />
                    <div>Resolution of maps: <input name="resolution" size=5 placeholder="100"</div>
                    `;
const d = new Dialog({
    title: "Scene creator",
    content: dialogContent,
    buttons: {
        accept: {
            label: "GO!",
            callback: (html) => {
                createScenes(html);
            }
        },
        cancel: {
            label: "Cancel"
        }
    }
}).render(true);
