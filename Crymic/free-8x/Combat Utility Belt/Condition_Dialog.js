(async()=>{
let apply = false;
let remove = false;
let all = false;
let target = canvas.tokens.controlled[0];
let conditionsApplied = "";
let conditionOptions = "";
let conditions_list = game.cub.conditions;
if(!target) return ui.notifications.error(`Please target exactly 1 token.`);
for(let i = 0; i < conditions_list.length; i++) {
    let condition_on = conditions_list[i];
    if (game.cub.hasCondition(condition_on.name, target)){
    conditionsApplied +=`<span style="box-shadow: 2px 2px rgba(0, 0, 0, 0.3);margin-top:5px;margin-left:5px;border:1px solid transparent;background:#6c757d;color:#fff;display: inline-block;padding: .25em .4em;font-size: 75%;line-height: 1;text-align: center;white-space: nowrap;vertical-align: baseline;    border-radius: .25rem;transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;"><img src="${condition_on.icon}" height="20px" width="20px" style="margin-right:10px;">${condition_on.name}</span>`;
 } 
}
for(let i = 0; i < conditions_list.length; i++) {
    let condition_toggle = conditions_list[i];
    let check_on = game.cub.hasCondition(condition_toggle.name, target) ? `ff0000` : `333`;
    conditionOptions +=`<li style="display:inline-block;width:33%;font-size:12px;padding:5px;">
    <div style="border:1px solid #${check_on};border-radius: .25rem;box-shadow: 2px 2px rgba(0, 0, 0, 0.3);">
    <input type="checkbox" value="${condition_toggle.name}" name="conditionBox">
    <label for="${condition_toggle.name}"><img src="${condition_toggle.icon}" height="20px" width="20px" style="margin-right:5px;"><span style="height:27px;line-height:27px;">${condition_toggle.name}</span></label>
    </div>
    </li>`;
}
let the_content = `<form><div><p>Current Effects on Target:</p>${conditionsApplied}</div><hr><p>Pick a Condition to Add or Remove.</p>
<div style="height: 370px;overflow: scroll;">
<ul style="list-style:none;margin:0;padding:0;">${conditionOptions}</ul></div></div>
</form>`;
let x = new Dialog({
	title: "Condition Manager",
	content: the_content,
	buttons: {
        apply: { label: "Apply it", callback: () => apply = true },
        remove: { label: "Remove it", callback: () => remove = true },
        all: { label: "Remove All", callback: () => all = true }
    },
	close: async (html) => {
        if (apply){
        const con_list = [];
        for(let i = 0; i < conditions_list.length; i++) {
            if (html.find('[name=conditionBox]')[i].checked) {
             let get_list = html.find('[name=conditionBox]')[i].value;
            con_list.push(get_list);
           }
        }
           await game.cub.addCondition(con_list, target);
        }
        if (remove){
        const con_list = [];
        for(let i = 0; i < conditions_list.length; i++) {
            if (html.find('[name=conditionBox]')[i].checked) {
                let get_list = html.find('[name=conditionBox]')[i].value;
                con_list.push(get_list);
            }
           }
           await game.cub.removeCondition(con_list, target);
        }
        if(all){
           await game.cub.removeAllConditions(target);
        }
    }
});
x.position.width = 700;
x.position.height = 560;
x.render(true);
})();
