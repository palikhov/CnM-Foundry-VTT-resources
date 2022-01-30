// Change label names and choice images to what you want..
(async()=>{
async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
const transitionType = 6;
let params = "";
let choice = "";
let filterId = "";
new Dialog({
        title: "Polymorph",
        content: `Pick a shape`,
        buttons: {
		one: {label: "Shape One", callback: () => {
		    if (token.TMFXhasFilterId("shapeOne")) return ui.notifications.error(`You are already in this shape.`);
		    choice = "icons/svg/mystery-man.svg";
		    filterId = "shapeOne";
		}},
		two: {label: "Shape Two", callback: () => {
		    if (token.TMFXhasFilterId("shapeTwo")) return ui.notifications.error(`You are already in this shape.`);
		    choice = "icons/svg/acid.svg";
		    filterId = "shapeTwo";
		}},
		three: {label: "Shape Three", callback: () => {
		    if (token.TMFXhasFilterId("shapeThree")) return ui.notifications.error(`You are already in this shape.`);
		    choice = "icons/svg/cave.svg";
		    filterId = "shapeThree";
		}},
        four: {label: "Cancel", callback: () => {
            filterId = "cancel";
		}}    
        },
		close : async () => {
		    if (filterId === "cancel"){
		    let cancel_filter = "";
		    if (token.TMFXhasFilterId("shapeOne")) {  cancel_filter = "shapeOne";}
		    if (token.TMFXhasFilterId("shapeTwo")) {  cancel_filter = "shapeTwo";}
		    if (token.TMFXhasFilterId("shapeThree")) {  cancel_filter = "shapeThree";}
		    console.log(cancel_filter);
		     params =
                [{
                    filterType: "polymorph",
                    filterId: cancel_filter,
                    type: transitionType,
                    animated:
                    {
                        progress:
                        {
                            active: true,
                            loops: 1
                        }
                    }
                }];
                await token.TMFXaddUpdateFilters(params);
		    }
		    else {
            params =    [{
                    filterType: "polymorph",
                    filterId: filterId,
                    type: transitionType,
                    padding: 70,
                    magnify: 1,
                    imagePath: choice,
                    animated:
                    {
                        progress:
                        {
                            active: true,
                            animType: "halfCosOscillation",
                            val1: 0,
                            val2: 100,
                            loops: 1,
                            loopDuration: 1000
                        }
                    }
                }];

		    await token.TMFXaddUpdateFilters(params);
		    }
		    if (filterId === "shapeOne"){
		    await wait(1000);
		    await token.TMFXdeleteFilters("shapeTwo");
		    await token.TMFXdeleteFilters("shapeThree");
		     }
		    if (filterId === "shapeTwo"){
			    await wait(1000);
		     await token.TMFXdeleteFilters("shapeOne");
		     
		    await token.TMFXdeleteFilters("shapeThree");
		    }
		    if (filterId === "shapeThree"){
				    await wait(1000);
		     await token.TMFXdeleteFilters("shapeOne");
		     
		    await token.TMFXdeleteFilters("shapeTwo");
		    }
		  }
}).render(true);
})();
