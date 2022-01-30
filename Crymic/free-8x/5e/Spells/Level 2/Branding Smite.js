if (args[0] === "on") {
let target = canvas.tokens.get(args[1])
target.update({"dimLight": 5, "lightColor": "#fffab8", "hidden": false});
}
else if (args[0] === "off") {
target.update({"dimLight": 0, "lightColor": "",});
}