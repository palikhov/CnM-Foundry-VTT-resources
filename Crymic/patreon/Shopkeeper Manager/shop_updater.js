let target = canvas.tokens.controlled[0].actor;
if(!target) return ui.notifications.error(`Select a Shopkeeper to update`);
if(!target._sheet?.template.includes("lootsheetnpc5e")) return ui.notifications.error(`Update Actors Sheet to LootSheetNPC, before using this macro`);
let get_items = target.items.contents.sort((a,b) => a.name < b.name ? -1 : 1);
let currency = target.data.data.currency;
let item_list = "";
let common = "";
let uncommon = "";
let rare = "";
let very_rare = "";
let legendary = "";
for(let i = 0; i < get_items.length; i++) {
let item = get_items[i];
item.data.data.rarity === "Common" ? common = `<option value="Common" selected>Common *</option>` : common = `<option value="Common">Common</option>`;
item.data.data.rarity === "Uncommon" ? uncommon = `<option value="Uncommon" selected>Uncommon *</option>` : uncommon = `<option value="Uncommon">Uncommon</option>`;
item.data.data.rarity === "Rare" ? rare = `<option value="Rare" selected>Rare *</option>` : rare = `<option value="Rare">Rare</option>`;
item.data.data.rarity === "Very Rare" ? very_rare = `<option value="Very Rare" selected>Very Rare *</option>` : very_rare = `<option value="Very Rare">Very Rare</option>`;
item.data.data.rarity === "Legendary" ? legendary = `<option value="Legendary" selected>Legendary *</option>` : legendary = `<option value="Legendary">Legendary</option>`;
item_list += `<li style="border:1px solid #000;border-radius:5px;margin:3px;float:left;width:49%;"><div style="background:#006092;color:#fff;padding:2px 5px;"><h4 style="margin:0;padding:0;">${item.data.name}</h4><input type="text" id="itemname" value="${item.data.name}" hidden></div>
<div style="padding:2px 3px;display:inline-block;">
<img src="${item.data.img}" style="width:50px;height:50px;padding:0;margin:0;vertical-align: top;display:inline-block;">
<div style="display:inline-block;text-align:center;">
<div><label for="itempqty"><small>Qty</small></label></div>
<input type="num" id="itempqty" value="${item.data.data.quantity}" style="padding:2px; margin-top:2px;vertical-align: top; height:30px;width:50px;text-align:center;"></div>
<div style="display:inline-block;text-align:center;">
<div><label for="itemprice"><small>Price (gp)</small></label></div>
<input type="num" id="itemprice" value="${item.data.data.price}" style="padding:2px; margin:2px;vertical-align: top; height:30px;width:70px;text-align:center;"></div>
<div style="display:inline-block;text-align:center;">
<div><label for="itemrarity"><small>Rarity</small></label></div>
<select id="itemrarity" style="padding:2px; margin-top:2px;vertical-align: top; height:30px;width:115px;">${common}${uncommon}${rare}${very_rare}${legendary}</select></div>
</div></li>`;
}
let the_content = `<p>Current Funds on Shopkeeper.</p>
<form>
<div>
<ul style="list-style:none;margin:0 0 10px 0;padding:0;overflow: hidden;">
<li style="float:left;margin-right:10px;"><div style="text-align:center;background:#333;color:#fff;padding:3px 5px;"><label for="pp">PP</label></div><input id="pp" style="width:120px;padding:3px 5px;" value="${currency.pp.value}"></li>
<li style="float:left;margin-right:10px;"><div style="text-align:center;background:#333;color:#fff;padding:3px 5px;"><label for="pp">EP</label></div><input id="ep" style="width:120px;padding:3px 5px;" value="${currency.ep.value}"></li>
<li style="float:left;margin-right:10px;"><div style="text-align:center;background:#333;color:#fff;padding:3px 5px;"><label for="gp">GP</label></div><input id="gp" style="width:120px;padding:3px 5px;" value="${currency.gp.value}"></li>
<li style="float:left;margin-right:10px;"><div style="text-align:center;background:#333;color:#fff;padding:3px 5px;"><label for="sp">SP</label></div><input id="sp" style="width:120px;padding:3px 5px;" value="${currency.sp.value}"></li>
<li style="float:left;"><div style="text-align:center;background:#333;color:#fff;padding:3px 5px;"><label for="cp">CP</label></div><input id="cp" style="width:120px;padding:3px 5px;" value="${currency.cp.value}"></li>
</ul>
</div>
<hr>
<div><p>Items currently in stock.</p></div>
<div style="overflow-y: scroll;height: 390px;margin-bottom: 6px;border-bottom: 1px solid #666;"><ul style="list-style:none;margin:0 0 10px 0;padding:0;overflow: hidden;">${item_list}</ul></div></form>`;

new Dialog({
title: "Shop Manager",
content: `<p>Pick a pricing method</p><form><div class="form-group"><label for="pricing">Select a method (Auto)</label><select id="pricing"><option value="dmg">DMG</option><option value=xgte">XGtE</option></select></div></form>`,
buttons: {
		custom: {label: "Manual", callback: () => {
let x = new Dialog({
title: "Shop Manager",
content: the_content,
buttons: {
		update: {label: "Update Stock", callback: async (html) => {
		        let get_pp = html.find('input#pp')[0].value;
		        let get_ep = html.find('input#ep')[0].value;
		        let get_gp = html.find('input#gp')[0].value;
		        let get_sp = html.find('input#sp')[0].value;
		        let get_cp = html.find('input#cp')[0].value;
		        await target.update({"data.currency.pp.value" : get_pp, "data.currency.ep.value" : get_ep, "data.currency.gp.value" : get_gp, "data.currency.sp.value" : get_sp, "data.currency.cp.value" : get_cp});
		    for(let i = 0; i < get_items.length; i++) {
		        let get_name = html.find('input#itemname')[i].value;
		        let get_price = html.find('input#itemprice')[i].value;
		        let get_qty = html.find('input#itempqty')[i].value;
		        let get_rarity = html.find('select#itemrarity')[i].value;
		        await target.items.getName(get_name).update({"data.price": get_price, "data.quantity" : get_qty, "data.rarity" : get_rarity});
		    }      
		}}
}
});
x.position.width = 680;
x.position.height = 600;
x.render(true);
}},
auto: {label: "Auto", callback: async (html) => {
let pricing_table = html.find('select#pricing')[0].value;
let uncommon_price = "";
let rare_price = "";
let very_rare_price = "";
let legendary_price = "";
for(let i = 0; i < get_items.length; i++) {
let item = get_items[i];
let item_rarity_lower = item.data.data.rarity.toLowerCase();
if(pricing_table === "xgte"){
uncommon_price = new Roll('1d6*100').evaluate({async:false}).total;
rare_price = new Roll('2d10*1000').evaluate({async:false}).total;
very_rare_price = new Roll('(1d4+1)*10000').evaluate({async:false}).total;
legendary_price = new Roll('2d6*25000').evaluate({async:false}).total;
} else {
uncommon_price = Math.min(101,new Roll('1d5*100').evaluate({async:false}).total);
rare_price = Math.min(501, new Roll('1d10*500').evaluate({async:false}).total);
very_rare_price = Math.min(5001, new Roll('1d10*5000').evaluate({async:false}).total);
legendary_price = Math.min(50001, new Roll('1d20*50000').evaluate({async:false}).total);
}
if(item_rarity_lower === "uncommon") await target.items.getName(item.name).update({"data.price": uncommon_price});
if(item_rarity_lower === "rare") await target.items.getName(item.name).update({"data.price": rare_price});
if(item_rarity_lower === "very rare") await target.items.getName(item.name).update({"data.price": very_rare_price});
if(item_rarity_lower === "legendary") await target.items.getName(item.name).update({"data.price": legendary_price});
}
}}
}}).render(true);