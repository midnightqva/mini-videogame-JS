const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");

let canvasSize;
let elementsSize;

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function setCanvasSize(){
    if (window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.75;
    } else{
        canvasSize = window.innerHeight * 0.75;
    }
    
    canvas.setAttribute("width", canvasSize);
    canvas.setAttribute("height", canvasSize);
    
    elementsSize = canvasSize / 10;
    
    startGame();
}

function startGame(){
    game.font = elementsSize + "px Verdana";
game.textAlign = "end";

for (let i = 1; i <= 10; i++) {
    console.log(i);
for (let j = 1; j <= 10; j++) {
    game.fillText(emojis["X"], elementsSize *i + 12 , elementsSize * j - 10);
    
}
    
}

}