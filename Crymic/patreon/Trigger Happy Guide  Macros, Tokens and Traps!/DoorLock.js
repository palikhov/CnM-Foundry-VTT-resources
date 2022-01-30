// Execute as GM
(async()=>{
let getDoor = canvas.walls.get(args[0]);
let lock = getDoor.data.ds != 2 ? 2: 1;
await getDoor.update({"ds" : lock});
})();