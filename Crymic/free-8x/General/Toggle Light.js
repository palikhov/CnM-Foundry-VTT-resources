let torch = async function() {

   const tokens = canvas.tokens.controlled;

   for (const token of tokens){
       if (token.data.brightLight != 0) {
           await token.update({"dimLight": 0, "brightLight": 0, "lightColor": "",}); 
       } else {
         await token.update({"dimLight": 40, "brightLight": 20, "lightAlpha" : 0.2,  "lightColor": "#ffc065", lightAnimation: {speed : 1, intensity : 4, type : "torch"}});
       }
   }
};
torch();