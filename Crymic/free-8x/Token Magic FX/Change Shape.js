// This macro contains a small tutorial : how to work with non-infinite loops and halfCosOscillation animType

// Click once to transform your token and again to revert to the original shape (thank to halfCosOscillation)

// There is 9 types of metamorphose
// 1 - Simple transition
// 2 - Dreamy
// 3 - Twist
// 4 - Water drop
// 5 - TV Noise
// 6 - Morphing
// 7 - Take off/Put on you disguise!
// 8 - Wind
// 9 - Hologram

// change the type here
let transitionType = 6;
let transformImg = "Whatever-Token-Image-here.png";
const lastArg = args[args.length - 1];
let target = canvas.tokens.get(lastArg.tokenId);
if (args[0] === "on") {
let params = [{
                    filterType: "polymorph",
                    filterId: "changeShape",
            enabled: true,
                    type: transitionType,
                    padding: 70,
                    magnify: 1,
                    imagePath: transformImg,
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

TokenMagic.addUpdateFilters(target, params);
// Uncomment if you want to make them BIGGER!
//target.update({"width": 2, "height": 2,});
}
else if (args[0] === "off") {
let params = [{ 
    filterType: "polymorph",
    filterId: "changeShape",
    enabled: false
}];
TokenMagic.addUpdateFilters(target, params);
// Adjusts them back the original size.
//target.update({"width": 1, "height": 1,});
}
