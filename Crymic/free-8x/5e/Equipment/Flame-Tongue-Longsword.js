// Edit this macro to support into any Flame Tongue Weapon you have. Requires Token Magic FX. Press Shift and Click on the weapon to activate it.
let confirmed = false;
let weapon = actor.items.find(i => i.name === "Flame Tongue Longsword");
let wpUpdate = duplicate(weapon);
let damageParts = wpUpdate.data.damage.parts;

let onFX =
[{
    filterType: "xfire",
    filterId: "myChromaticXFire",
	enabled: true,
    time: 0,
    blend: 2,
    amplitude: 1.1,
    dispersion: 0,
    chromatic: true,
    scaleX: 1,
    scaleY: 1,
    inlay: false,
    animated :
    {
      time : 
      { 
        active: true, 
        speed: -0.0015, 
        animType: "move" 
      }
    }
}];

let offFX = [{ 
	 filterType: "xfire",
	 filterId: "myChromaticXFire",        
	 enabled: false
	 }];

async function unleash(damageParts, wpUpdate) {
  if (damageParts.length < 2) {
damageParts.push(["2d6", "fire"]);
await actor.updateEmbeddedEntity("OwnedItem", wpUpdate);
  }
ChatMessage.create({
					        user: game.user._id,
                            speaker: ChatMessage.getSpeaker({token: actor}),
                            content: `Flames erupt from ${actor.name}'s longsword.`
});
TokenMagic.addUpdateFilters(token, onFX);
token.update({"dimLight": 40, "brightLight": 40,});  
}

async function restore(damageParts, wpUpdate) {
damageParts.slice(-1);
await actor.updateEmbeddedEntity("OwnedItem", wpUpdate);
ChatMessage.create({
					        user: game.user._id,
                            speaker: ChatMessage.getSpeaker({token: actor}),
                            content: `Flames from ${actor.name}'s longsword go out.`
});
TokenMagic.addUpdateFilters(token, offFX);
token.update({"dimLight": 0, "brightLight": 0,});     
}

if (event.shiftKey) {
 new Dialog({
		title: "Flame Tongue Longsword",
		content: "<p>Do you speak the key phrase?</p>",
		buttons: {
		confirmed: { label: "Flame On", callback: () => confirmed = true },			
        cancel: { label: "Flame Off", callback: () => confirmed = false }
        },
		close: html => {
		if (confirmed) {
		unleash(damageParts, wpUpdate);		
		}
       else{ 
       restore(damageParts, wpUpdate);
       }		
		}
}).render(true);
}
else {
game.dnd5e.rollItemMacro("Flame Tongue Longsword");
}