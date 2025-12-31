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


//X = wall, O = skip, P = pac man, ' ' = food
//Ghosts: b = blue, o = orange, p = pink, r = red
const tileMap = [
     "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
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
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX" 
]


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

    pacManleft = new Image();
    pacManleft.src = "./pacmanLeft.png";

    pacManRight = new Image();
    pacManRight.src = "./pacmanRight.png";

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


    
    
    //  BLOCKS CREATION 
    class Block {
        constructor(image,x,y,width,height){
                    this.x = x;
                    this.y = y;
                    this.image = image;
                    this.width = width;
                    this.height = height;
        }
    }
    
