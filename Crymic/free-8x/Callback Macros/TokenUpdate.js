// args[0] === token
// args[1] === updates
// animate false turns off sliding
(async()=>{
let animateOn = args[2] != "off" ? true : false;
await canvas.tokens.get(args[0].id).update(args[1], {animate : animateOn});
})();
