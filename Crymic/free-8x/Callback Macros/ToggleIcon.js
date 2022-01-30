(async ()=>{
let target = canvas.tokens.get(args[0]);
let img = args[1];
if (args[2] === "on"){
    await target.toggleEffect(img, {active : true}); 
}
if (args[2] === "off"){
    await target.toggleEffect(img, {active : false});
}
})();
