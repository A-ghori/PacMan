// Board 
let board;
const tileSize = 32;
const columnSize = 19;
const rowSize = 21;
const Boardwidth = tileSize * columnSize;
const Boardheight = tileSize * rowSize;
let context;

let orangeGhostImage;
let blueGhostImage;
let pinkGhostImage;
let pacmanLeftImage;
let pacmanRightImage;
let pacmanUpImage;
let pacmanDownImage;
let wallImage;

let debugText = "";
let debugEl;

//X = wall, O = skip, P = pac man, ' ' = food
//Ghosts: b = blue, o = orange, p = pink, r = red
const tileMap = [
  "XXXXXXXXXXXXXXXXXXX",
  "X        X        X",
  "X XX XXX X XXX XX X",
  "X XX XXX X XXX XX X",
  "X                 X",
  "X XX X XXXXX X XX X",
  "X    X       X    X",
  "XXXX XXXX XXXX XXXX",
  "OOOX X       X XOOO",
  "XXXX X XXrXX X XXXX",
  "O       bpo       O",
  "XXXX X XXXXX X XXXX",
  "OOOX X       X XOOO",
  "XXXX X XXXXX X XXXX",
  "X        X        X",
  "X XX XXX XX XXX XX X",
  "X  X     P     X X",
  "XX X X XXXXX X X XX",
  "X    X   X   X    X",
  "X XXXXXX X XXXXXX X",
  "XXXXXXXXXXXXXXXXXXX"
];

// Set is a JS datastructe use for prevenet duplicate sets in an array if duplicate happens then also it choose only one set the orginal one 
const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;


let directions = ['L','R','D','U'];
let score = 0;
let lives = 3;
let gameOver = false;

    window.onload = function () {
    board = document.getElementById('board');
    board.width = Boardwidth;
    board.height = Boardheight;
    context = board.getContext('2d'); // used for drawing on the board ;
    loadImages();
    loadMap();
    update();



// SetTimeInterval, setTimeout, requestAnimationframe -> its fps 
// so let say i need 20 fps ->  so 1 sec = 1000 milsec and i need 20 sec it means 2000 milsec => 
// Time per Frame (ms): Milliseconds per Frame = 1000 / FPS.
//For 120 FPS: 1000 / 120 = 8.33ms.

//const fps = 120
//setInterval(update,fps);

// Just add arrown key and left right key for pacman movement test 
document.addEventListener("keyup", movePacman);

console.log(board.width);
console.log(`The BoardWidth is ${Boardwidth}`);
console.log(`The BoardHeight is ${Boardheight}`);
console.log(walls.size);
console.log(foods.size);
console.log(`We have ${ghosts.size} fucking ghosts have in this fucking game`);


}

// Loading all Images
function loadImages () {
    wallImage = new Image();
    wallImage.src= "./wall.png";
    
    pinkGhostImage = new Image();
    pinkGhostImage.src = "./redGhost.png";

    orangeGhostImage = new Image();
    orangeGhostImage.src = "./orangeGhost.png";

    blueGhostImage = new Image();
    blueGhostImage.src = "./blueGhost.png";

    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "./pacmanLeft.png";

    pacmanRightImage = new Image();
    pacmanRightImage.src = "./pacmanRight.png";

    pacmanDownImage = new Image();
    pacmanDownImage.src = "./pacmanDown.png"

    pacmanUpImage = new Image();
    pacmanUpImage.src = './pacmanUp.png'


}



// LoadMap for game Engine giving game sense where to create the walls and put the pacmann and ghosts position without repetetion 

function loadMap() {

// 
    walls.clear();
    ghosts.clear();
    foods.clear();


    for(let c=0; c<columnSize; c++){
        for(let r=0; r<rowSize; r++){
            
            const rows = tileMap[r];
            const tileMapChar = rows[c];
            
            const x = c * tileSize;
            const y = r * tileSize;
            
            if(tileMapChar === "X"){ // blocks walls
                const wall = new Block(wallImage,x,y,tileSize,tileSize);
                walls.add(wall)
            }
            else if(tileMapChar === "b"){ // for blueGhost
                const ghost = new Block(blueGhostImage, x , y , tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if(tileMapChar === "p") { // for pinkGhost
                const ghost = new Block(pinkGhostImage, x , y , tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if(tileMapChar === "o") { // orangeghost
                const ghost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if(tileMapChar === ' '){ // for foods
                // Because Food = 4  and tileSize = 32 
                //centerOffset = (containerSize - objectSize) / 2 => (32 - 4 ) / 2 = 14
                const food = new Block(null,x+14, y+14, 4 ,4)
                foods.add(food)
            }
            
            else if(tileMapChar === 'P') { // Pacman for default i need Pacman face right 
                pacman = new Block(pacmanRightImage, x , y ,tileSize, tileSize);
            }
        }
    }
}


function update(){
    
// First i need to create move function for pacman and ghosts
    move();

    //Second i have to create a draw function to draw all the elements on the board
    draw(); 
    
    const fps = 8;
    setTimeout(update, 1000 / fps);
}
  

// Drawing function
function draw(){
        
    
    if (debugEl) debugEl.textContent = debugText;


    context.clearRect(0,0, Boardwidth, Boardheight); // to clear the board before drawing again 
    // Formula -> drawImage(image, dx, dy, dWidth, dHeight)
    

    debugEl = document.createElement('div');
    debugEl.id = 'debug-overlay';
    debugEl.style.position = 'fixed';
    debugEl.style.top = '12px';
    debugEl.style.left = '12px';
    debugEl.style.padding = '8px 12px';
    debugEl.style.background = 'rgba(0,0,0,0.7)';
    debugEl.style.color = '#fff';
    debugEl.style.font = '16px Arial';
    debugEl.style.borderRadius = '6px';
    debugEl.style.zIndex = '9999';
    debugEl.textContent = '';
    document.body.appendChild(debugEl);


    context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);
    
    for(const wall of walls){
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height)
    }
    for(const ghost of ghosts){
        context.drawImage(ghost.image, ghost.x, ghost.y,ghost.width, ghost.height)
    }
// For Foods 
context.fillStyle = 'brown ';
for(const food of foods){
    context.fillRect(food.x, food.y, food.width, food.height);
}
}

function move(){
pacman.x += pacman.velocityX;
pacman.y += pacman.velocityY;

ghosts.x += ghosts.velocityX;
ghosts.y += ghosts.velocityY;


// check Wall Collision for Pacman
    for(let wall of walls){
        if(collision(pacman, wall)){
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
      break;
        }

    }

    // Check Food Collision for Pacman
    for (let food of foods){
        if(collision(pacman, food)){
            foods.delete(food);
            score += 10;
            debugText = `Food Eating Score: ${score}`;
            break;
        }
    }

    // Ghosts Collision with Pacman 
    for(let ghost of ghosts){
        if(collision(pacman , ghost)){
            lives -= 1;
            score -= 50; 
            debugText = `Ghosts Ne Teri Maa Ko Chod Di Score: ${score} Lives Left: ${lives}`;
        }
    }
    
}


// movePacman Function
    function movePacman(event){
        if(event.code === "ArrowUp" || event.code === "KeyW" ){
            debugText = "Upar Kar MotherChod";
            pacman.updateDirection('U');
        }
        else if(event.code === "ArrowDown" || event.code === "KeyS"){
            debugText = "Niche Kar Be Lawre";
            pacman.updateDirection('D');
        }
        else if(event.code === "ArrowLeft" || event.code === "KeyA"){
            debugText = "Du Duu Piyaga ?";
            pacman.updateDirection('L')
        } 
        else if(event.code === "ArrowRight" || event.code === "KeyD"){
            debugText = "Right ME TERI MAE KI CHUU";
            pacman.updateDirection('R')
        } 
        else {
            debugText = "Krrish Ka Gana Sunege "
        }
    }
    

    // This is the collision formula for detecting collision between two rectangles[Source Google]
    function collision(a,b){
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }



    //  BLOCKS CREATION 
    class Block {
        constructor(image,x,y,width,height){
                    this.x = x;
                    this.y = y;
                    this.image = image;
                    this.width = width;
                    this.height = height;
  
  
                    this.startX = x;
                    this.startY = y;


                    this.direction = "R" // default direction right
                    this.velocityX = 0;
                    this.velocityY = 0;
                }


            updateDirection(direction){
            this.direction = direction;
            const prev = this.direction;
         this.x += this.velocityX;
            this.y += this.velocityY;

            this.updateVelocity();
for (let wall of walls){
    if(collision(this, wall)){
        this.direction = prev;
        this.updateVelocity();
        return 
    }
}
            }


        updateVelocity(){ // I have total 4 direction l , r, u , d
            if(this.direction === 'U') {
                this.velocityX = 0;
                this.velocityY = - tileSize / 4;
            }
            else if(this.direction === 'D') {
                this.velocityX = 0;
                this.velocityY = tileSize / 4;
            }
            else if(this.direction === 'L'){
                this.velocityX = - tileSize / 4;
                this.velocityY = 0;
            }
            else if(this.direction === "R") {
                this.velocityX = tileSize / 4;
                this.velocityY = 0;
            }

         
            // Update PacMan image based on direction
            if(pacman.direction === 'U'){
                pacman.image = pacmanUpImage;
            }
           else if(pacman.direction === 'D'){
                pacman.image = pacmanDownImage;
            }
            else if(pacman.direction === "L"){
                pacman.image = pacmanLeftImage;
            }
            else if(pacman.direction === 'R'){
                pacman.image = pacmanRightImage;
            }
            else {
                pacman.image = pacmanRightImage;
            }
        }
    }
    
