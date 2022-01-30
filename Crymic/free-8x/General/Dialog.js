// You can do a short cut version
new Dialog({
	title: `Dialog Box`,
	content: `<p>Stuff to say here</p>`,
	buttons: {
		one: {label: "Button One", callback: () => {
            // do stuff here
        }},
		two: {label: "Button Two", callback: () => {
            // do other stuff here
        }},
		three: {label: "Button Three", callback: () => {
            // do something else here
        }}
	},
    default: "one"
}).render(true);

// Or a long version if you want to pass few variables
let option = "";
new Dialog({
	title: `Dialog Box`,
	content: `<p>Stuff to say here</p>`,
	buttons: {
		one: {label: "On", callback: () => {
            option = true;
        }},
		two: {label: "Off", callback: () => {
            option = false;
        }}
	},
        default: "one",
   close : (html) => {
       if(option){
           // do stuff
       }
      
           // other things happen
      
    }
}).render(true);
