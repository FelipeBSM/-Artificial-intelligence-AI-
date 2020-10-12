
/*Este algoritimo encontra o caminho até o seu destino.*/
var WIDTH = 400;
var HEIGHT = 400;

//size of tiles in grid;
tileW = 18;
tileH = 18;

//size of grid
tileRow = 20;
tileColumn = 20;

var tiles = []; //tiles array

var snakeTail = []; //snake array


//AI VARIABLES
var canvas_AI;
var context_AI;


//PLAYER
var canvas;
var context;
var UI;
var HscoreUI;
var HScore = 1;
var preHScore = 1;


// set up the initial tiles
for (c = 0; c < tileColumn; c++) {
    tiles[c] = [];
    for (r = 0; r < tileRow; r++) {
        tiles[c][r] = { x: c * (tileW + 3), y: r * (tileH + 3), state: 'e' , gcostX: 0,gcostY:0, fcostX: 0,fcostY:0, hcost: 0};//e for empty tile;
    }
}

xv = yv = 0;
gs = tc = 20;
px = py = 10; //player position
ax = Math.floor(Math.random() * tc); //apple position
ay = Math.floor(Math.random() * tc); //apple position

tiles[ax][ay].state = 'f'; // firts final position
trail = [];
tail = 1; //initializing tail
tiles[0][0].state = 's'; // setting up the start position

//A* costs
Gcost(tiles);
Fcost(tiles);
Hcost(tiles);

function reset()
{
    for (c = 0; c < tileColumn; c++) {
        tiles[c] = [];
        for (r = 0; r < tileRow; r++)
        {
         
            tiles[c][r] = { x: c * (tileW + 3), y: r * (tileH + 3), state: 'e', gcost: 0, fcost: 0, hcost: 0 };//e for empty tile;


        }
    }
    tiles[0][0].state = 's';
    tiles[ax][ay].state = 'f';
   
}
function clear() {
    context_AI.clearRect(0, 0, WIDTH, HEIGHT);
}
function rect(x, y, w, h, state) {
    if (state == 's') {
        context_AI.fillStyle = "lime";
    }
    else if (state == 'f') {
        context_AI.fillStyle = "red";
    }
    else if (state == 'x') {
        context_AI.fillStyle = "black";
    }
    else if (state == 'e') {
        context_AI.fillStyle = "1f1f1f";
    }
    else {
        context_AI.fillStyle = "blue";
    }

    context_AI.beginPath();
    context_AI.rect(x, y, w, h);
    context_AI.closePath();
    context_AI.fill();

}
function init() {
    canvas_AI = document.getElementById("gameAI");
    context_AI = canvas_AI.getContext("2d");
    setInterval(Draw, 10);
}
function Draw() {

    for (c = 0; c < tileColumn; c++) {
        for (r = 0; r < tileRow; r++) {
            rect(tiles[c][r].x, tiles[c][r].y, tileW, tileH, tiles[c][r].state); //calling rect function
        }
    }



}
var pathFound = false;
var queue = [[0, 0]];
function likeManhatan(queue) {
    var bestTile = 0;
    for (var i = 0; i < queue.length; i++)
    {
        if (queue[i][0] + queue[i][1] < queue[bestTile][0] + queue[bestTile][1])
        {
            bestTile = i;
        }
    }
    return bestTile;
}
function Gcost(tiles){
    for (var i = 0; i < tileColumn; i++) {
        for (var j = 0; j < tileRow; j++) {
            if (tiles[i][j].state == 'e') {
                tiles[i][j].gcostX = tiles[i][j].x - tiles[0][0].x;
                tiles[i][j].gcostY = tiles[i][j].y - tiles[0][0].y
                console.log(tiles[i][j].gcostX + tiles[i][j].gcostY);
            }
        }
    }
}
function Fcost(tiles) {
    for (var i = 0; i < tileColumn; i++) {
        for (var j = 0; j < tileRow; j++) {
            if (tiles[i][j].state == 'e') {
                tiles[i][j].fcostX = tiles[i][j].x - tiles[ax][ay].x;
                tiles[i][j].fcostY = tiles[i][j].y - tiles[ax][ay].y;
                console.log(tiles[i][j].fcostX + tiles[i][j].fcostY);
            }
        }
    }
}
function Hcost(tiles) {
    for (var i = 0; i < tileColumn; i++) {
        for (var j = 0; j < tileRow; j++) {
            if (tiles[i][j].state == 'e') {
                tiles[i][j].hcost = tiles[i][j].fcostX + tiles[i][j].fcostY + tiles[i][j].gcostX + tiles[i][j].gcostY
                console.log("TILE AT :" + i+ '/' + j + "possui hcost: " +tiles[i][j].hcost);
          
            }
        }
    }
}
function AIPath() {

   

    var XLoc;
    var YLoc;

    while (queue.length > 0 && !pathFound)
    {
        var indexTile = likeManhatan(queue);
        
        XLoc = queue[indexTile][0];
        YLoc = queue[indexTile][1];
        //console.log("Tile at: "+XLoc+ '/'+YLoc+ "index: "+indexTile);
        queue.splice(indexTile, 1);
        
        if (XLoc > 0)
        {
          
            if (tiles[XLoc - 1][YLoc].state == 'f') {
                console.log("NO IF 2");
                pathFound = true; //Found the Path
            }

        }
        if (XLoc < tileColumn - 1) {
          
            if (tiles[XLoc + 1][YLoc].state == 'f') {
                pathFound = true; //Found the Path
             
            }
        }

        //Y

        if (YLoc > 0) {
           
            if (tiles[XLoc][YLoc - 1].state == 'f') {
                pathFound = true; //Found the Path
              
            }

        }
        if (YLoc < tileRow - 1) {
            
            if (tiles[XLoc][YLoc + 1].state == 'f') {
                pathFound = true; //Found the Path
               
            }
        }
        ////////////////////////////////////////////////////////////////////
        if (XLoc > 0) {
           
            if (tiles[XLoc - 1][YLoc].state == 'e') {
                queue.push([XLoc - 1, YLoc]);
   
                tiles[XLoc - 1][YLoc].state = tiles[XLoc][YLoc].state + 'l';// seeting new state - because this tile was already checked.
             
            }

        }
        if (XLoc < tileColumn - 1) {
          
            if (tiles[XLoc + 1][YLoc].state == 'e') {
                queue.push([XLoc + 1, YLoc]);
                
                tiles[XLoc + 1][YLoc].state = tiles[XLoc][YLoc].state + 'r';// seeting new state - because this tile was already checked.
                
            }
        }

        //Y

        if (YLoc > 0) {
          
            if (tiles[XLoc][YLoc - 1].state == 'e') {
                queue.push([XLoc, YLoc - 1]);
                
                tiles[XLoc][YLoc - 1].state = tiles[XLoc][YLoc].state + 'u'; // seeting new state - because this tile was already checked.
               
            }

        }
        if (YLoc < tileRow - 1) {
           
            if (tiles[XLoc][YLoc + 1].state == 'e') {
                queue.push([XLoc, YLoc + 1]);
                tiles[XLoc][YLoc + 1].state = tiles[XLoc][YLoc].state + 'd';// seeting new state - because this tile was already checked.
               
            }
        }
    }

    if (!pathFound) {
        console.warn("path cant be found");
    }
    else {
        console.warn("path found");
        var path = tiles[XLoc][YLoc].state;
        var pathLenght = path.length;

        var currX = 0;
        var currY = 0;

        for (var i = 0; i < pathLenght - 1; i++)
        {
            //chech all the visited nodes - then walk up,down,left or right
            if (path.charAt(i + 1) == 'u') {
                currY -= 1;

            }
            if (path.charAt(i + 1) == 'd') {
                currY += 1;
            }
            if (path.charAt(i + 1) == 'r') {
                currX += 1;
            }
            if (path.charAt(i + 1) == 'l') {
                currX -= 1;
            }
            console.log("HCOST DE TILES X: " + tiles[currX][currY].hcost);
            tiles[currX][currY].state = 'x'; // set the path
        }
        
    }
}



window.onload = function ()
{
    canvas = document.getElementById("game");
    context = canvas.getContext("2d");
    UI = document.getElementById("UI");
    HscoreUI = document.getElementById("HScore");
    document.addEventListener("keydown", KeyPush);
   // document.addEventListener("keydown", MoveAI);
    setInterval(Game, 1000 / 12);
    init();
    AIPath();
    //AI

};


//snake game logic
function Game() {
    px += xv;
    py += yv;
    
    if (px < 0)
    {
        tail = 1;
        px = 10;
        py = 10;
    }
    if (px > tc - 1)
    {
        tail = 1;
        px = 10;
        py = 10;
    }
    //
    if (py < 0)
    {
        tail = 1;
        px = 10;
        py = 10;
    }
    if (py > tc - 1)
    {
        tail = 1;
        px = 10;
        py = 10;
    }

    UI.innerHTML = "Score: " + tail;
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "lime";

    for (var i = 0; i < trail.length; i++)
    {
        context.fillRect(trail[i].x * gs, trail[i].y * gs, gs - 2, gs - 2);
        if (trail[i].x == px && trail[i].y == py)
        {
            console.log(preHScore);
            if (HScore > preHScore) {

                HscoreUI.innerHTML = "High Score: " + HScore;
                preHScore = HScore;
            }
            else {
                preHScore = tail;
            }
            tail = 1;
            preHScore = HScore;
            HScore = tail;

        }
    }
    trail.push({ x: px, y: py });
    while (trail.length > tail)
    {
        trail.shift();
    }
    if (ax == px && ay == py)
    {
        
        tail++;

        ax = Math.floor(Math.random() * tc);
        ay = Math.floor(Math.random() * tc);
        if (ax == 0 && ay == 0) {
            ax = Math.floor(Math.random() * tc);
            ay = Math.floor(Math.random() * tc);
        }
        for (var i = 0; i < tileColumn; i++) {
            for (var j = 0; j < tileRow; j++) {
             
                if (tiles[i][j].state == 'f') {
                    tiles[i][j].state = 'e';
                    tiles[ax][ay].state = 'f';
                  
                }
         
          
              
             
            }
        }
       
        pathFound = false;
        AIPath();

    }

    context.fillStyle = "red";
    context.fillRect(ax * gs, ay * gs, gs - 2, gs - 2);
};

function KeyPush(evt) {
    let lastInputX = lastInputY = 0;
    lastInputX = xv;
    lastInputY = yv;
    switch (evt.key) {
        case 'ArrowUp':
            if (lastInputY !== 0) break;
            xv = 0; yv = -1;
            break;
        case 'ArrowDown':
            if (lastInputY !== 0) break;
            xv = 0; yv = 1;
            break;
        case 'ArrowLeft':
            if (lastInputX !== 0) break;
            xv = -1; yv = 0;
            break;
        case 'ArrowRight':
            if (lastInputX!== 0) break;
            xv = 1; yv = 0;
            break;
        case '1':
            AIPath();
            break;
    }
};

function ResetAI() {
    for (c = 0; c < tileColumn; c++) {
        tiles[c] = [];
        for (r = 0; r < tileRow; r++) {
            tiles[c][r] = { x: c * (tileW + 3), y: r * (tileH + 3), state: 'e' };//e for empty tile;
        }
    }
}

