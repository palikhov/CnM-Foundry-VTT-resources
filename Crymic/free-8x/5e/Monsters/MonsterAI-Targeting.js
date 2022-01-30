if (!game.combat) return ui.notifications.warn(`Start a combat to use Monster AI Targeting.`);
let find_npc = await canvas.tokens.get(game.combat.current.tokenId);
let keys = Object.keys([find_npc.actor.data.data.attributes.movement]);
let values = Object.values([find_npc.actor.data.data.attributes.movement]);
let movement = values.map((item, i) => Object.assign({}, item, keys[i]))[0];
const find_range = movement.walk !== 0 ? movement.walk : movement.fly !== 0 ? movement.fly : movement.burrow !== 0 ? movement.burrow : movement.swim;
let move = "";
let short_range = ["mwak", "msak"];
let long_range = ["rwak", "rsak", "save", "util"];
let melee_weapon = find_npc.actor.items.filter(i => short_range.includes(i.data.data.actionType) && (i.data.data.range.value != null || i.data.data.range.long != null)).sort((a, b) => a.data.data.range.value < b.data.data.range.value ? 1 : -1);
let ranged_weapon = find_npc.actor.items.filter(i => long_range.includes(i.data.data.actionType) && (i.data.data.range.value != null || i.data.data.range.long != null)).sort((a, b) => a.data.data.range.long < b.data.data.range.long ? -1 : 1);
console.log(melee_weapon);
console.log(ranged_weapon);
let melee_range = melee_weapon.length > 0 ? melee_weapon[0].data.data.range.long > melee_weapon[0].data.data.range.value ? melee_weapon[0].data.data.range.long : melee_weapon[0].data.data.range.value : 0;
let ranged_range = ranged_weapon.length > 0 ? ranged_weapon[0].data.data.range.long > ranged_weapon[0].data.data.range.value ? ranged_weapon[0].data.data.range.long : ranged_weapon[0].data.data.range.value : 0;
let melee_distance = Number(melee_range);
let ranged_distance = Number(ranged_range);
console.log("Melee Range => ", melee_distance, "Ranged Distance => ", ranged_distance);
let find_target = "";
let find_npc_snap = await canvas.grid.getSnappedPosition(find_npc.x, find_npc.y, 1);
let melee = await MidiQOL.findNearby(CONST.TOKEN_DISPOSITIONS.HOSTILE, find_npc, melee_distance, null);
console.log(`List of Melee Targets (${melee_range}ft) =>`, melee);
let ranged = await MidiQOL.findNearby(CONST.TOKEN_DISPOSITIONS.HOSTILE, find_npc, ranged_distance, null);
console.log(`List of Ranged Targets (${ranged_range}ft) =>`, ranged);
let no_melee = await MidiQOL.findNearby(CONST.TOKEN_DISPOSITIONS.HOSTILE, find_npc, find_range, null);
let weaponList = [];
if (melee.length > 0) {
    let roll = await new Roll(`1d${melee.length} -1`).evaluate({ async: false });    
    find_target = melee[roll.total];
    let enemySnap = await canvas.grid.getSnappedPosition(find_target.x, find_target.y, 1);
    let ray = new Ray(find_npc_snap, enemySnap);
    let segments = [{ ray }];
    let targetDistance = canvas.grid.measureDistances(segments, { gridSpaces: true })[0];
    console.log(targetDistance);
    move = "Melee Attack";
    melee_weapon.reduce((list, weapon) => {
        console.log(weapon.data.data.range.value);
        if (weapon.data.data.range.value <= targetDistance) list.push(`<option value="${weapon.id}">${weapon.name}</option>`);
        return list;
    }, weaponList);
} else if ((melee.length === 0) && (ranged.length > 0)) {
    let roll = await new Roll(`1d${ranged.length} -1`).evaluate({ async: false });
    find_target = ranged[roll.total];
    let enemySnap = await canvas.grid.getSnappedPosition(find_target.x, find_target.y, 1);
    let ray = new Ray(find_npc_snap, enemySnap);
    let segments = [{ ray }];
    let targetDistance = canvas.grid.measureDistances(segments, { gridSpaces: true })[0];
    move = "Range Attack";
    ranged_weapon.reduce((list, weapon) => {
        console.log(weapon.data.data.range.value);
        if (weapon.data.data.range.value >= targetDistance) list.push(`<option value="${weapon.id}">${weapon.name}</option>`);
        return list;
    }, weaponList);
} else if ((melee.length === 0) && (ranged.length === 0)) {
    let roll = await new Roll(`1d${no_melee.length} -1`).evaluate({ async: false });
    find_target = no_melee[roll.total];
    let enemySnap = await canvas.grid.getSnappedPosition(find_target.x, find_target.y, 1);
    let ray = new Ray(find_npc_snap, enemySnap);
    let segments = [{ ray }];
    let targetDistance = canvas.grid.measureDistances(segments, { gridSpaces: true })[0];
    let attackDistance = melee_distance > ranged_distance ? melee_distance : ranged_distance;
    let moveDistance = Math.ceil(targetDistance - attackDistance);    
    move = `Move ${moveDistance}' and <b>Attack!</b>`;
}
console.log(weaponList);
let weaponsFound = weaponList.length > 0 ? `<select id="weaponAttack">${weaponList.join('')}</select>` : "";
console.log(`List of Move-to Targets (${find_range}ft) =>`, no_melee);
if (find_target === undefined) return ui.notifications.warn(`No Targets within range, move closer.`);
console.log('Final Target =>', find_target);
new Dialog({
    title: "Combat Targeting Manager",
    content: `<h2 style="text-align:center;">Targeting</h2><form><div style="position:relative;width:378px;height:90px;"><div style="position:relative;left:0;top:0;width:50%;"><img src="${find_npc.data.img}" height="50px;" style="display: block;margin-left: auto;margin-right: auto; border:none"><h4 style="text-align:center">${find_npc.name}</h4></div><div style="margin: auto;position: absolute;top: 0;left: 0;bottom: 0;right: 0;"><h3 style="color:red;text-align:center;font-size: 2em;font-style: italic;z-index:2;position: absolute;top: 0;left: 0;right: 0;">Versus</h3><div style="text-align:center;color: white;font-size: 2.5rem;z-index: 1;"><i class="fas fa-fist-raised"></i></div></div><div style="position:absolute;right:0;top:0;width:50%;"><img src="${find_target.data.img}" height="50px;" style="display: block;margin-left: auto;margin-right: auto; border:none;"><h4 style="text-align:center">${find_target.name}</h4></div></div><div class="form-group">${weaponsFound}</div></form>`,
    buttons: {
        attack: {
            icon: `<i class="fas fa-skull"></i>`,
            label: `${move}`, callback: async (html) => {
                // Edit the list below to include your own lines
                let adj = [
                    `savagely roars at`,
                    `scowls in anger at`,
                    `fumes with furious hatred at`,
                    `growls with rage at`,
                    `savagely growls at`,
                    `viciously grunts at`,
                    `howls in the air and attacks`,
                    `fiercely yells at`,
                    `guttural yells at`,
                    `stares menacingly at`,
                    `readies their attack against`,
                    `loathes the presence of`,
                    `brings malice upon`
                ];
                let random = Math.floor(Math.random() * (adj.length));
                await find_target.setTarget(true, { releaseOthers: true });
                let itemId = html.find('#weaponAttack').val();
                ChatMessage.create({
                    user: game.user._id,
                    speaker: ChatMessage.getSpeaker({ token: find_npc }),
                    content: `<p><em>${find_npc.name} ${adj[random]} ${find_target.name}</em></p>`,
                    type: CONST.CHAT_MESSAGE_TYPES.EMOTE
                }, { chatBubble: true });
                find_npc.actor.items.get(itemId).roll();
            }
        }
    }
}).render(true);
