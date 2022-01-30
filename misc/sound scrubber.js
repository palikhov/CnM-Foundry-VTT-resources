function mainDialog(){
    const d = new Dialog({
        title: "Scrub through song",
        content: dialogContent,
        buttons: {
            prev: {
                label: `<i class="fas fa-backward"></i>`,
                callback: (html) => {
                    scrubSpeed = parseInt(html.find("[name=scrub-speed]")[0].value);
                    changeSong("prev", playListId, songId, scrubSpeed);
                    keepOpen = true;
                }
            },
            start: {
                label: `<i class="fas fa-play"></i>`,
                callback: () => {
                    playSong(playListId, songId);
                    keepOpen = true;
                }
            },
            stop: {
                label: `<i class="fas fa-pause"></i>`,
                callback: () => {
                    pauseSong(playListId, songId);
                    keepOpen = true;
                }
            },
            next: {
                label: `<i class="fas fa-forward"></i>`,
                callback: (html) => {
                    scrubSpeed = parseInt(html.find("[name=scrub-speed]")[0].value);
                    changeSong("next", playListId, songId, scrubSpeed);
                    keepOpen = true;
                }
            }
        },
        close: () => {
            if(!keepOpen) return;
            dialogContent = `<form>
                                <div class="form-group">
                                    <label>Scrub speed (s):</label>
                                    <input type="number" name="scrub-speed" value="${scrubSpeed}"/>
                                </div>
                            </form>`;
            keepOpen = false;
            mainDialog();
        }
    });
    d.render(true);
}
async function changeSong(direction, playListId, songId, scrubSpeed){
    const change = direction === "prev" ? -1 * scrubSpeed : scrubSpeed;
    const plist = game.playlists.get(playListId);
    const song = plist.sounds.get(songId); 
    const time = song.sound.container.context.currentTime - song.sound.startTime; 
    let pausedTime = time + change;
    pausedTime = pausedTime < 0 ? 0.1 : pausedTime;
    await plist.updateEmbeddedDocuments("PlaylistSound", [{_id: song.data._id, pausedTime, playing: false}]); 
    await new Promise(resolve => setTimeout(resolve, 100));
    await plist.updateEmbeddedDocuments("PlaylistSound", [{_id: song.data._id, playing: true}]);
}

async function pauseSong(playListId, songId) {
    const plist = game.playlists.get(playListId);
    const song = plist.sounds.get(songId);
    const time = song.sound.container.context.currentTime - song.sound.startTime ; 
    await plist.updateEmbeddedDocuments("PlaylistSound", [{_id: song.data._id, pausedTime: time, playing: false}]);
}

async function playSong(playListId, songId) {
    const plist = game.playlists.get(playListId);
    const song = plist.sounds.get(songId);
    await plist.updateEmbeddedDocuments("PlaylistSound", [{_id: song.data._id, playing: true}]);
}

if(!game.playlists.find(pl => pl.playing))return ui.notifications.info("No sound is currently playing.");
const playListId = game.playlists.find(pl => pl.playing).id;
const songId = game.playlists.find(pl => pl.playing).sounds.find(s=> s.playing).id;
let dialogContent = `<form>
                        <div class="form-group">
                            <label>Scrub speed (s):</label>
                            <input type="number" name="scrub-speed" value="5"/>
                        </div>
                    </form>`;
let scrubSpeed = 0;
let keepOpen = false;
mainDialog();
