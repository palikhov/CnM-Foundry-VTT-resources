async function startSong(startTime, listId, songId){
    let plist = game.playlists.get(listId)
    let song = plist.sounds.find(s=> s.id === songId);
    await plist.updateEmbeddedDocuments("PlaylistSound", [{_id: song.id, pausedTime: startTime, playing: true}]);
}


async function getSongs(listId){
    let playlist = game.playlists.get(listId);
    let songOptions = playlist.sounds.reduce((acc, song)=> acc += `<option value="${song.id}">${song.name}</option>`,``);
    let songDialogContent = `<form>
                  <div class="form-group">
                        <label>Song:</label>
                        <select name="song-id">${songOptions}</select>
                  </div>
                  <div class="form-group">
                        <label>
                            Start time (in seconds)
                        </label>
                        <input type="number" value="0" name="start-time"/>
                  </div>
            </form>`;
    new Dialog({
        title: "Select song and start time",
        content: songDialogContent,
        buttons: {
            ok: {
                label: "Start",
                callback: (html)=> {
                    let songId = html.find("[name=song-id]")[0].value;
                    let startTime = parseInt(html.find("[name=start-time]")[0].value);
                    startSong(startTime, listId, songId);
                }
            }
        }
    }).render(true);
}

let playlistOptions = game.playlists.reduce((acc,p) => acc += `<option value="${p.id}"> ${p.name}</option>`,``);
const content = `<form>
                    <div class="form-group">
                        <label>
                            Playlist:
                        </label>
                        <select name="list">${playlistOptions}</select>
                    </div>
                    
                 </form>`;

new Dialog({
    title: "Select Playlist",
    content,
    buttons: {
        ok: {
            label: "Select Playlist",
            callback: (html)=> {
                let list = html.find("[name=list]")[0].value;
                getSongs(list);
            }
        }
    }
}).render(true);
