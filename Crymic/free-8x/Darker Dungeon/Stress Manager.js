let option = false;
let selectOption = [];
let getCharacters = game.actors.contents.filter(i => i.hasPlayerOwner && i.folder?.name === "Players" && i.data.type === "character" && i.isPolymorphed === false);
let playerList = getCharacters.reduce((list, target) => {
    list.push(`<li id="character" style="float:left;padding:5px;margin:2px;"><img src="${target.data.token.img}" style="border:none;" width="90" height="90" title="${target.name}"><div><b>Stress</b> ${target.data.data.resources.tertiary.value}</div><div><select id="stressSelect" name="${target.id}"><option value="null" default>-</option><option value="minor">Minor</option><option value="moderate">Moderate</option><option value="major">Major</option><option value="monstrous">Monstrous</option></select></div></li>`);
    return list;
}, []);
let x = new Dialog({
    title: `Stress Manager`,
    content: `<p>Pick a Character</p><form class="chatBox"><ul style="list-style:none">${playerList.join('')}</ul></form>`,
    buttons: {
        one: {
            icon: '<i class="fas fa-brain"></i>',
            label: "Gain", callback: () => option = "gain"            
        },
        two: {
            label: "Heal", callback: () => option = "heal"            
        },
        three: {
            label: "Reset", callback: () => option = "reset"
        }
    },
    default: "one",
    close: async (html) => {
        let selectList = Array.from(html.find('select#stressSelect'));
        let tableList = [];
        let selection = selectList.reduce((list, select) => {
            let stressId = `_id`;
            let stressRes = `data.resources.tertiary.value`;
            let final = {};
            let getActor = game.actors.get(select.name);
            let currentRes = getActor.getRollData().resources.tertiary.value > 0 ? getActor.getRollData().resources.tertiary.value : 0;
            let numDice = select.value === "minor" ? 1 : select.value === "moderate" ? "1d4" : select.value === "major" ? "1d6" : select.value === "monstrous" ? "1d6 + 4" : 0;
            let stressAmount = option === "gain" ? new Roll(`${currentRes + numDice}`).evaluate({ async: false }).total : option === "heal" ? Math.max(0, new Roll(`${currentRes - numDice}`).evaluate({ async: false }).total) : option === "reset" ? 0 : 0;
            final[stressId] = select.name;
            final[stressRes] = stressAmount;
            tableList.push(`<tr><td>${getActor.name}</td><td>${stressAmount}</td></tr>`);
            list.push(final);
            return list;
        }, []);
        let content = `<table><tr><th>Name</th><th>Amount</th></tr>${tableList.join('')}</table>`;
        ChatMessage.create({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ alias: "Stress Manager" }),
            content: content,
        });
        await Actor.updateDocuments(selection);
    }
});
x.position.width = 900;
x.position.height = 270;
x.render(true);
