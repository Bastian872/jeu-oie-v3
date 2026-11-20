const NB_CASES = 50;

const board = document.getElementById("board");
const popup = document.getElementById("popup");
const content = document.getElementById("popupContent");

const colors = [
"#ef4444",
"#f59e0b",
"#84cc16",
"#06b6d4",
"#8b5cf6"
];

let images = [];

const players = [
{
name:"🔵",
position:1
},
{
name:"🔴",
position:1
}
];

let currentPlayer = 0;

createBoard();

document
.getElementById("photos")
.addEventListener("change",e=>{
images=[...e.target.files];
});

document
.getElementById("btnPlay")
.addEventListener("click",play);

document
.getElementById("closePopup")
.addEventListener("click",()=>{
popup.style.display="none";
});

function createBoard(){

for(let row=0;row<10;row++){

let line=[];

for(let col=1;col<=5;col++){

line.push(row*5+col);

}

if(row%2===1){
line.reverse();
}

line.forEach(n=>{

const div=document.createElement("div");

div.className="cell";
div.id="case"+n;

div.style.background=
colors[n%colors.length];

div.innerHTML=n;

board.appendChild(div);

});

}

drawPlayers();
}

function drawPlayers(){

document
.querySelectorAll(".pawn")
.forEach(x=>x.remove());

players.forEach((player,index)=>{

let cell=
document.getElementById(
"case"+player.position
);

if(cell){

const pawn=
document.createElement("div");

pawn.className=
"pawn "+
(index===0?"blue":"red");

pawn.innerHTML=player.name;

cell.appendChild(pawn);

}

});

saveGame();
}

function play(){

let dice=
Math.floor(Math.random()*6)+1;

document
.getElementById("dice")
.innerHTML="🎲 "+dice;

movePlayer(
players[currentPlayer],
dice
);
}

function movePlayer(player,dice){

let steps=0;

const interval=setInterval(()=>{

if(steps>=dice){

clearInterval(interval);

specialCase(player);

return;

}

if(player.position<NB_CASES){

player.position++;

drawPlayers();

}

steps++;

},300);
}

function specialCase(player){

let pos=player.position;

if(pos===50){

victory(player);

return;
}

if(pos%11===0){

player.position=
Math.min(
NB_CASES,
player.position+3
);

drawPlayers();

showText(
"⭐ Bonus : avance de 3 cases"
);

}
else if(pos%7===0){

player.position=
Math.max(
1,
player.position-2
);

drawPlayers();

showText(
"🐌 Malus : recule de 2 cases"
);

}
else{

randomContent();

}

changePlayer();
}

function randomContent(){

const textes=
document
.getElementById("texts")
.value
.split("\n")
.filter(x=>x.trim());

let modes=[];

if(textes.length) modes.push("txt");
if(images.length) modes.push("img");

if(modes.length===0) return;

let mode=
modes[
Math.floor(
Math.random()*modes.length
)
];

if(mode==="txt"){

let t=
textes[
Math.floor(
Math.random()*textes.length
)
];

showText(t);
}
else{

let img=
images[
Math.floor(
Math.random()*images.length
)
];

let reader=
new FileReader();

reader.onload=e=>{

content.innerHTML=
"<img src='"+e.target.result+"'>";

popup.style.display="flex";

};

reader.readAsDataURL(img);
}
}

function showText(txt){

content.innerHTML=
"<h2>"+txt+"</h2>";

popup.style.display="flex";
}

function changePlayer(){

currentPlayer =
currentPlayer===0 ? 1 : 0;

document
.getElementById("tour")
.innerHTML=
"Tour du joueur "+
players[currentPlayer].name;
}

function victory(player){

alert(
"🏆 Victoire de "+
player.name
);

localStorage.removeItem(
"jeu_oie_v3"
);
}

function saveGame(){

localStorage.setItem(
"jeu_oie_v3",
JSON.stringify({
players,
currentPlayer
})
);
}

function loadGame(){

let save=
localStorage.getItem(
"jeu_oie_v3"
);

if(!save) return;

let game=
JSON.parse(save);

players[0].position=
game.players[0].position;

players[1].position=
game.players[1].position;

currentPlayer=
game.currentPlayer;

drawPlayers();
}

loadGame();

if ("serviceWorker" in navigator) {

    navigator.serviceWorker
    .register("service-worker.js")

    .then(() => {

        console.log("PWA active");

    });

}