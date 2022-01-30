// Macro Author: Freeze#2689 (on discord)
// Macro version: 0.6
// Prerequisites: Advanced Macros, midiQOL and Item Macro, on Use version (optional support for Better Roll).
//
// Usage: Take the healing spells Cure Wounds, Healing Word, and their mass varieties from the 5e SRD compendium and place them in the item library
// On those items remove the healing formula on the details tab  and write ItemMacro (exactly) in On Use Macro, leave the rest as is. 
// Then click Item Macro on the title bar of the item, and paste this macro in the macro box.
//
// v 0.2 update: midiQOL made a change to how healing is handled by the damageOnlyWorkflow, adjusted to correct for this change + cosmetics.
// v 0.3 update: with Item5e: useSpell() to be deprecated, changed my macro to on use. Bonus no more searching for strings in chatmessages!
// v 0.4 update: Something about item already being declared by midiQOL forced a change.
// v 0.5 update: added support for druids and charisma casters.
// v 0.6 update: made the Blessed Healer chatmessage nicer, and Better Roll support (different chat message for the heal method.).

// some constants you might need to change depending on your language.
const domain = "Life Domain";
const healerClassNames = ["Cleric", "Warlock", "Sorcerer", "Bard", "Paladin", "Druid"]; // do not change order!
// spell names, which might be different in your language.
const cureWounds = "Cure Wounds";
const healingWord = "Healing Word";
const massHealingWord = "Mass Healing Word";
const massCureWounds = "Mass Cure Wounds";
// feature name, which might be different in your language.
const blessedHealer = "Blessed Healer";
//////////////////////////////////////////////////////////
async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
/////////////////////////////////////////////////////////
let hasDiscipleOfLife = false;
let hasBlessedHealer  = false;
let hasSupremeHealing = false;


const healerClasses = token.actor.itemTypes.class.filter(i => healerClassNames.includes(i.data.name));
const cleric = healerClasses.find(e => e.data.name === healerClassNames[0]); 
if (cleric) {
    hasDiscipleOfLife = ( cleric.data.data.levels >= 1 && cleric.data.data.subclass === domain )  ? true : false;  // at level 1 each Life Domain cleric gets a boost to their healing spells.
    hasBlessedHealer  = ( cleric.data.data.levels >= 6 && cleric.data.data.subclass === domain )  ? true : false;  // at level 6 they start healing themselves a bit too.
    hasSupremeHealing = ( cleric.data.data.levels >= 17 && cleric.data.data.subclass === domain ) ? true : false;  // at level 17 each Life Domain cleric gets to cast their healing spells with maxed out dice.
}
const targets = Array.from(game.user.targets);
const spellName = args[0].item.name;
const spellImg = args[0].item.img;

if (( spellName == cureWounds || spellName == healingWord ) && targets.length > 1) return ui.notifications.error(`Please target exactly 1 token when casting ${spellName}.`); 
let diceNumber = healerClasses.find(e => e.data.name === healerClassNames[1]) && item.data.data.preparation.mode === "pact" ? token.actor.data.data.spells.pact.level : args[0].spellLevel;
const bonusHealLevel = ( hasDiscipleOfLife == true ) ? Number(diceNumber) + 2 : 0;           // here the right amount of Disciple of Life bonus healing is determined.
diceNumber = ( spellName == massHealingWord || spellName == massCureWounds ) ? diceNumber - 2 : diceNumber;  // correcting for higher level spells. That have start their level different. MassHealWord = 1d4 or (3-2)d4 and MassCureWounds = 3d8 or (5-2)d8
const mod = !!healerClasses.find(e => (e.data.name === healerClassNames[0] || e.data.name === healerClassNames[5]) && healerClasses.length === 1) ? token.actor.data.data.abilities.wis.mod :  
            !!healerClasses.find(e => (e.data.name === healerClassNames[1] || e.data.name === healerClassNames[2] || e.data.name === healerClassNames[3] || e.data.name === healerClassNames[4]) && healerClasses.length === 1) ? token.actor.data.data.abilities.cha.mod : 
            token.actor.data.data.abilities.wis.mod > token.actor.data.data.abilities.cha.mod ? token.actor.data.data.abilities.wis.mod : token.actor.data.data.abilities.cha.mod; 
const formula = args[0].item.data.scaling.formula.replace("1", diceNumber);                             // the scaling formula for all healing spells are 1d4 or 1d8
for ( let target of targets ) {
    let healAmount = 0;
    let healRoll = {};
    if ( hasSupremeHealing == true ) {
        healRoll = new Roll(`${formula} + ${mod} + ${bonusHealLevel}`).evaluate({async: true, maximize: true});
    }
    else {
        healRoll = await new Roll(`${formula} + ${mod} + ${bonusHealLevel}`).evaluate({async: true});
    }
    game.dice3d?.showForRoll(healRoll, game.user, true);
    healAmount = healRoll.total;
    new MidiQOL.DamageOnlyWorkflow(actor, token, healAmount, "healing", [target], healRoll, 
                                    {flavor: `<p>Target: ${target.name}</p>`, itemCardId: args[0].itemCardId});
}
// for Better Rolls use below for the chatmessage. So the roll actually shows up.
// {flavor:`<div class="dnd5e red-full chat-card">
//          <div class="dnd5e chat-card item-card">
//          <header class="card-header flexrow red-header">
//          <img src="${spellImg}" width="36" height="36" title="${args[0].item.name}">
//          <h3 class="item-name">${args[0].item.name}</h3>
//          </header>
//          <p>Target: ${target.name}</p>
//          </div>
//          </div>`});

if ( hasBlessedHealer == true ) {                                                    // check for blessed healer to be able to self heal the cleric a bit when casting the healing spell.
    await wait(2000);                                                 
    let selfHeal = bonusHealLevel;
    let hp = Math.clamped(token.actor.data.data.attributes.hp.value + selfHeal, 0, token.actor.data.data.attributes.hp.max);
    await token.actor.update({"data.attributes.hp.value": hp});
    ChatMessage.create({speaker: {alias: token.name}, content: `<div class="dnd5e red-full chat-card">
                                            <div class="dnd5e chat-card item-card">
                                                <header class="card-header flexrow red-header">
                                                    <img src="${spellImg}" width="36" height="36" title="${blessedHealer}">
                                                    <h3 class="item-name">${blessedHealer}</h3>
                                                </header>
                                                <p>Healed self for ${selfHeal} hit points.</p>
                                            </div>
                                        </div>`});
}
