// Furnace converted macro of this, refernce MagicMissiles.execute(caster, hit_targets);
// args[0] === caster.actor
// args[1] === target array

/// This macro pulls from the JB2A list of Purple Magic Missiles to throw 3 random paths at targeted tokens
let mmA = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_30ft_01_1200x400.webm";
let mmB = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_30ft_02_1200x400.webm";
let mmC = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_30ft_03_1200x400.webm";
let mmD = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_30ft_04_1200x400.webm";
let mmE = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_30ft_05_1200x400.webm";
let mmF = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_30ft_06_1200x400.webm";
let mmG = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_30ft_07_1200x400.webm";
let mmH = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_30ft_08_1200x400.webm";
let mmI = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_30ft_09_1200x400.webm";
let mmAA = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_60ft_01_2400x400.webm";
let mmBB = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_60ft_02_2400x400.webm";
let mmCC = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_60ft_03_2400x400.webm";
let mmDD = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_60ft_04_2400x400.webm";
let mmEE = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_60ft_05_2400x400.webm";
let mmFF = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_60ft_06_2400x400.webm";
let mmGG = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_60ft_07_2400x400.webm";
let mmHH = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_60ft_08_2400x400.webm";
let mmII = "modules/JB2A_DnD5e/Library/1st_Level/Magic_Missile_INSTANTANEOUS/MagicMissile_01_Purple_60ft_09_2400x400.webm";

function random_itemA(itemsA)
{
return itemsA[Math.floor(Math.random()*itemsA.length)];
}

var itemsA = [mmA, mmB, mmC, mmD, mmE, mmF, mmG, mmH, mmI];

function random_itemB(itemsB)
{
return itemsB[Math.floor(Math.random()*itemsB.length)];
}

var itemsB = [mmAA, mmBB, mmCC, mmDD, mmEE, mmFF, mmGG, mmHH, mmII];

var myStringArray = Array.from(game.user.targets);
for (var i = 0; i < myStringArray.length; i++) {
let mainTarget = canvas.tokens.get(myStringArray[i].id);
let myToken = canvas.tokens.controlled[0];
let halfGrid = canvas.scene.data.grid/2;
let srcX = (myToken.data.x + (myToken.data.width*halfGrid));
let srcY = (myToken.data.y + (myToken.data.height*halfGrid));
let tarX = (mainTarget.data.x + (mainTarget.data.width*halfGrid));
let tarY = (mainTarget.data.y + (mainTarget.data.height*halfGrid));
let outerRad = Math.sqrt(Math.pow(mainTarget.data.width*halfGrid,2) + Math.pow(myToken.data.width*halfGrid,2));
let anDeg = -(Math.atan(((srcY - tarY)/(srcX - tarX)))*57.3);
let anDist = Math.sqrt(Math.pow(srcX-tarX,2)+Math.pow(srcY-tarY,2));
async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

let anFile = random_itemA(itemsA);
let anFileSize = 600;
switch(true){
 case (anDist<=1200):
    anFileSize = 1200;
    anFile = random_itemA(itemsA);
    break;
 default:
    anFileSize = 2400;
    anFile = random_itemB(itemsB);
    break;
}

let anFile2 = random_itemA(itemsA);
switch(true){
 case (anDist<=1200):    
    anFileSize = 1200;
    anFile2 = random_itemA(itemsA);
    break;
 default:
    anFileSize = 2400;
    anFile2 = random_itemB(itemsB);
    break;
}

let anFile3 = random_itemA(itemsA);
switch(true){
 case (anDist<=1200):
    anFileSize = 1200;
    anFile3 = random_itemA(itemsA);
    break;
 default:
    anFileSize = 2400;
    anFile3 = random_itemB(itemsB);
    break;
}

let anScale = Math.sqrt(Math.pow(srcX-tarX,2)+Math.pow(srcY-tarY,2))/anFileSize;
let anScaleY = anScale;
if (anDist<=600){anScaleY = 0.6}
if (anDist>=700 && anDist <=1200){anScaleY = 0.8}
if (anDist>=1300 && anDist <=1800){anScaleY = 0.6}
if (anDist>=1900){anScaleY = anScale}


if(srcX>tarX){anDeg = anDeg+180}
if(srcX==tarX){if(srcY>tarY){anDeg=90}else{anDeg=-90}}

let spellAnim = 
                    {
                     file: anFile,
                      position: {
                        x: srcX,
                        y: srcY
                      },
                      anchor: {
                       x: 0,
                       y: 0.5
                      },
                      angle: anDeg,
                      scale: {
                       x: anScale,
                       y: anScaleY
                      }
                    }; 
let spellAnim2 = 
                    {
                     file: anFile2,
                      position: {
                        x: srcX,
                        y: srcY
                      },
                      anchor: {
                       x: 0,
                       y: 0.5
                      },
                      angle: anDeg,
                      scale: {
                       x: anScale,
                       y: anScaleY
                      }
                    }; 
let spellAnim3 = 
                    {
                     file: anFile3,
                      position: {
                        x: srcX,
                        y: srcY
                      },
                      anchor: {
                       x: 0,
                       y: 0.5
                      },
                      angle: anDeg,
                      scale: {
                       x: anScale,
                       y: anScaleY
                      }
                    }; 
canvas.fxmaster.playVideo(spellAnim);
await wait (80);
canvas.fxmaster.playVideo(spellAnim2);
await wait (120);
canvas.fxmaster.playVideo(spellAnim3);
await wait (50);
game.socket.emit('module.fxmaster', spellAnim,spellAnim2,spellAnim3);
await wait (50);
}
