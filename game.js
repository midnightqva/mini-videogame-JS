const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const gameContainer = document.querySelector(".game-container");
const btnUp = document.querySelector("#up");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const btnDown = document.querySelector("#down");
const livesIcon = document.querySelector("#lives");
const time = document.querySelector("#time");
const record = document.querySelector("#record");
const result = document.querySelector("#result");
const continueContainer = document.getElementById("continue");
const yes = document.querySelector(".yes");
const no = document.querySelector(".no");

yes.addEventListener("click", resetGame);
no.addEventListener("click", closeGame);

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;


const playerPosition = {
    x: undefined,
    y: undefined,
}
const giftPosition = {
    x: undefined,
    y: undefined,
}
let enemiesPositions = [];

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
      canvasSize = window.innerWidth * 0.7;
    } else {
      canvasSize = window.innerHeight * 0.7;
    }
    
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    
    elementsSize = canvasSize / 10;
  
    playerPosition.x = undefined;
    playerPosition.y = undefined;

    startGame();
  }

function startGame(){
    game.font = elementsSize + "px Verdana";
    game.textAlign = "end";

    const map = maps[level];
    if(!map){
        gameWin();
        return;
    }

    if(!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split("\n");
    const mapRowsCol = mapRows.map(row => row.trim().split(""))
    console.log(map, mapRows, mapRowsCol);

    showLives(); 
    
    
    enemiesPositions = [];
    game.clearRect(0,0,canvasSize,canvasSize);

    mapRowsCol.forEach((row ,rowI) => {
    row.forEach((col , colI) => {
        const emoji = emojis[col];
        const posX = elementsSize * (colI + 1.2);
        const posY = elementsSize * (rowI + 0.9);

        if(col == "O"){
            if(!playerPosition.x && !playerPosition.y){
                playerPosition.x = posX;
                playerPosition.y = posY;
               // console.log({playerPosition})
            }
        }   else if(col == "I"){
            giftPosition.x = posX;
            giftPosition.y = posY;
        }   else if(col == "X"){
            enemiesPositions.push({
                x : posX,
                y : posY,
            })
        }

        game.fillText(emoji, posX, posY);
    });
});
    
    movePlayer();
}

function movePlayer(){
    const giftCollisionX = giftPosition.x.toFixed(2) == playerPosition.x.toFixed(2);
    const giftCollisionY = giftPosition.y.toFixed(2) == playerPosition.y.toFixed(2);
    const giftCollision = giftCollisionX && giftCollisionY;

    if(giftCollision){
        levelWin();
    }

    const enemiesCollision = enemiesPositions.find(enemy => {
        const enemiesCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemiesCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemiesCollisionX && enemiesCollisionY;
    } );
    
    if(enemiesCollision){
        console.log("Chocaste contra un enemigo :)");
    }

    if(enemiesCollision){
        levelFail();
    }

    
    game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y)
}

function levelWin(){
    console.log("Subiste de nivel");
    level ++;
    startGame();
}

function levelFail(){
    lives --;

    console.log("Vidas restantes: " + lives);
    
    if(lives <= 0){
        gameContainer.classList.add("inactive");
        continueContainer.classList.remove("inactive");
    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;

    startGame();
    
}

function gameWin(){
    console.log("! Terminaste el juego !");
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem("record_time");
    const playerTime = Date.now() - timeStart;

    if(recordTime) {
        if(recordTime >= playerTime){
            localStorage.setItem("record_time", playerTime);
            result.innerHTML = "Superaste el Record :)";
        } else{
            result.innerHTML = "Lo siento , no superaste el record :(";
        }
    }
    else{
        localStorage.setItem("record_time", playerTime);
        result.innerHTML ="Primera vez? Muy bien, ahora intenta superar el record";
    }
    console.log({recordTime, playerTime});
}

function showLives(){
    livesIcon.innerHTML = emojis["HEART"].repeat(lives);
}

function showTime(){
    time.innerHTML = Date.now() - timeStart;
}
function showRecord(){
    record.innerHTML = localStorage.getItem("record_time");
}


function resetGame(){
    continueContainer.classList.add("inactive");
    gameContainer.classList.remove("inactive");
    
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    
    
    level= 0;
    lives = 3;
    timeStart = undefined;
    startGame();
    console.log("Reinicio");
}
function closeGame(){
    window.close();
}


window.addEventListener("keydown", moveByKeys);
btnUp.addEventListener("click", moveUp);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
btnDown.addEventListener("click", moveDown);

function moveByKeys(event){
switch (event.key){
    case "ArrowUp" : moveUp();
    break;
    
    case "ArrowLeft" : moveLeft();
    break; 
    
    case "ArrowRight" : moveRight();
    break;

    case "ArrowDown" : moveDown();
    break;
}

}

function moveUp(){
    console.log("Me quiero mover hacia arriba");
    if((playerPosition.y - elementsSize) < 0){
        console.log("OUT");
    }else {
        playerPosition.y -= elementsSize;
        startGame();
    }
    }


function moveLeft(){
    console.log("Me quiero mover hacia izquierda");
    
    if((playerPosition.x - elementsSize) < elementsSize){
        console.log("OUT");
    }else {
        playerPosition.x -= elementsSize;
        startGame();
    }
}

function moveRight(){
    console.log("Me quiero mover hacia derecha");
    
    if((playerPosition.x + elementsSize) > canvasSize * 1.1){
        console.log("OUT");
    }else {
        playerPosition.x += elementsSize;
        startGame();
    }
}

function moveDown(){
    console.log("Me quiero mover hacia abajo");
    if((playerPosition.y + elementsSize) > canvasSize){
        console.log("OUT");
    }else{
        playerPosition.y += elementsSize;
        startGame();
    }

}