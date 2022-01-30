(async () => {
    let getItem = "";
    const flip = await new Roll('1dc').roll();
    game.dice3d?.showForRoll(flip);
    if (flip.total === 0) { getItem = "Miss"; }
    else {
        const fumble = await new Roll('1d6').roll();
        if (fumble.total === 1) getItem = "Distracted";
        if (fumble.total === 2) getItem = "Trip";
        if (fumble.total === 3) getItem = "Exhausted";
        if (fumble.total === 4) getItem = "Opening";
        if (fumble.total === 5) getItem = "Self-Inflicted Wound";
        if (fumble.total === 6) getItem = "Friendly Fire";

    }
    let getActor = await game.actors.getName("Fumble");
    await getActor.items.getName(getItem).roll();
})();