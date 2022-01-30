canvas.tokens.controlled.forEach(token => {
let transitionType = 2;
// How many images you got? This will roll a random die for each image you have. Make sure to title them as "x.png"
let change = new Roll("1d65").roll();
// Change image patch to match yours.
let pic = `graphics/tokens/bulk/${change.total}.png`;
let params = [{
                    filterType: "polymorph",
                    filterId: "getHigh",
                    enabled: true,
                    type: transitionType,
                    padding: 70,
                    magnify: 1,
                    imagePath: pic,
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
  TokenMagic.addUpdateFilters(token, params);  
});