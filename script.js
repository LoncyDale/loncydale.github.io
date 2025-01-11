// ╔════╗ \\
// ║ UI ║ \\
// ╚════╝ \\

function updateMovesCounter()
{
    document.getElementById("movesCounter").innerHTML = "Ходы: " + gameMap.moves;
}

// Get modal window.
let modal = document.getElementById('modal');
document.getElementById("replayButton").addEventListener("click", reloadGame);

function reloadGame()
{
    document.location.reload();
}

// ╔══════════╗ \\
// ║ Gameplay ║ \\
// ╚══════════╝ \\

// When player wins.
function gameEvent_GameWin()
{
    console.log("Game win event executed.");
    clearInterval(this.gameTimerInterval);
    clearInterval(updateMovesCounterInterval);
    
    document.querySelector(".gamehead").textContent = "You Win";
    document.querySelector("#timeSpent").textContent = "Затрачено времени: " + (gameTime - diff);
    document.querySelector("#movesSpent").textContent = "Шагомер шагов: " + gameMap.moves;

    modal.style.display = "block";
    console.log("Win modal shown.");
}

// When player loses.
function gameEvent_GameOver()
{
    console.log("Game over event executed.");
    clearInterval(this.gameTimerInterval);
    clearInterval(updateMovesCounterInterval);

    document.querySelector(".gamehead").textContent = "Game Over";
    document.querySelector("#timeSpent").textContent = "Затрачено времени: " + (gameTime - diff);
    document.querySelector("#movesSpent").textContent = "Шагомер шагов: " + gameMap.moves;

    modal.style.display = "block";
    console.log("Loose modal shown.");
}

// Timer
function startTimer(gameDuration)
{
    var start = Date.now(),
        seconds,
        timerMessage = document.querySelector("#timer");
    diff = 0;
    
    function timer()
    {
        diff = gameDuration - (((Date.now() - start) / 1000) | 0);
        seconds = (diff % 60) | 0;
        //seconds = seconds < 10 ? "0" + seconds : seconds;
        timerMessage.textContent = "Особняк мутирует через " + seconds + " секунд.";
            
        if (diff <= 0)
        {
            //timerMessage.textContent = "Бесчисленные коридоры особняка поглотили сыщика.";
            playing = false;
            gameEvent_GameOver();
        }
    }

    timer(); // We need start timer before interval takes his first count. 
    this.gameTimerInterval = setInterval(timer, 1000);
}

// Key press detection (for keyboards).
let playing = true;
window.addEventListener('keydown',doKeyDown,true);

function doKeyDown(evt)
{
    let handled = false;
    if (playing)
    {
        switch (evt.keyCode)
        {
            case 38:  /* Up arrow was pressed */
                gameMap.moveup("canvas");
                handled = true
                break;
            case 87:  /* Up arrow was pressed */
                gameMap.moveup("canvas");
                handled = true
                break;
            case 40 :  /* Down arrow was pressed */
                gameMap.movedown("canvas");
                handled = true
                break;
            case 83 :  /* Down arrow was pressed */
                gameMap.movedown("canvas");
                handled = true
                break;
            case 37:  /* Left arrow was pressed */
                gameMap.moveleft("canvas");
                handled = true
                break;
            case 65:  /* Left arrow was pressed */
                gameMap.moveleft("canvas");
                handled = true
                break;
            case 39:  /* Right arrow was pressed */
                gameMap.moveright("canvas");
                handled = true
                break;
            case 68:  /* Right arrow was pressed */
                gameMap.moveright("canvas");
                handled = true
                break;
        }
        
        if (gameMap.checker("canvas"))
            playing = false
    }

    if (handled)
        evt.preventDefault(); // Prevent arrow keys from scrolling the page (supported in IE9+ and all other browsers)
}

// Swipe detection (for touch-screens)
window.addEventListener('touchstart', handleTouchStart, false);
window.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function getTouches(evt)
{
    return evt.touches || evt.originalEvent.touches;
}

function handleTouchStart(evt)
{
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt)
{
    if (!xDown || !yDown)
    {
        return;
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (playing)
    {
        if (Math.abs(xDiff) > Math.abs(yDiff))
        {
            if (xDiff > 0)
            {
                // Right swipe
                gameMap.moveleft("canvas");
            }
            else
            {
                // Left swipe
                gameMap.moveright("canvas");
            }
        }
        else
        {
            if (yDiff > 0)
            {
                // Down swipe
                gameMap.moveup("canvas");
            }
            else
            {
                // Up swipe
                gameMap.movedown("canvas");
            }
        }

        if (gameMap.checker("canvas"))
            playing = false
    }

    // Reset values
    xDown = null;
    yDown = null;
};

// ╔═════════════════╗ \\
// ║ Generating Maze ║ \\
// ╚═════════════════╝ \\

var dsd = function(size)
{
    this.N = size;
    this.P = new Array(this.N);
    this.R = new Array(this.N);

    this.init = function()
    {
        for (var i = 0; i < this.N; i++)
        {
            this.P[i] = i;
            this.R[i] = 0;
        }
    }

    this.union = function(x, y)
    {
        var u = this.find(x);
        var v = this.find(y);
        
        if (this.R[u] > this.R[v])
        {
            this.R[u] = this.R[v] + 1;
            this.P[u] = v;
        }
        else
        {
            this.R[v] = this.R[u] + 1;
            this.P[v] = u;
        }
    }

    this.find = function(x)
    {
        if (x == this.P[x])
            return x;
        this.P[x] = this.find(this.P[x]);
        return this.P[x];
    }
};

function random(min, max)
{
    return (min + (Math.random() * (max - min)));
};

function randomChoice(choices)
{
    return choices[Math.round(random(0, choices.length-1))];
};

var maze = function(X, Y)
{
    this.N = X;
    this.M = Y;
    this.S = 50; // Generated maze scale. DEF = 25.
    this.moves = 0;
    this.Board = new Array(2 * this.N + 1);
    this.EL = new Array();
    this.vis = new Array(2 * this.N + 1);
    this.delay = 2;
    this.x = 1;

    this.init = function()
    {
        for (var i = 0; i < 2 * this.N + 1; i++)
        {
            this.Board[i] = new Array(2 * this.M + 1);
            this.vis[i] = new Array(2 * this.M + 1);
        }

        for (var i = 0; i < 2 * this.N + 1; i++)
        {
            for (var j = 0; j < 2 * this.M + 1; j++)
            {
                if (!(i % 2) && !(j % 2))
                {
                    this.Board[i][j] = '+';
                }
                else if (!(i % 2))
                {
                    this.Board[i][j] = '-';
                }
                else if (!(j % 2))
                {
                    this.Board[i][j] = '|';
                }
                else
                {
                    this.Board[i][j] = ' ';
                }
                this.vis[i][j] = 0;
            }
        }
    }

    this.add_edges = function()
    {
        for (var i = 0; i < this.N; i++)
        {
            for (var j = 0; j < this.M; j++)
            {
                if (i != this.N - 1)
                {
                    this.EL.push([[i, j], [i + 1, j], 1]);
                }
                if (j != this.M - 1)
                {
                    this.EL.push([[i, j], [i, j + 1], 1]);
                }
            }
        }
    }

    //Hash function
    this.h = function(e)
    {
        return e[1] * this.M + e[0];
    }

    this.randomize = function(EL)
    {
        for (var i = 0; i < EL.length; i++)
        {
            var si = Math.floor(Math.random() * 387) % EL.length;
            var tmp = EL[si];
            EL[si] = EL[i];
            EL[i] = tmp;
        }

        return EL;
    }

    this.breakwall = function(e)
    {
        var x = e[0][0] + e[1][0] + 1;
        var y = e[0][1] + e[1][1] + 1;
        this.Board[x][y] = ' ';
    }

    this.gen_maze = function()
    {
        this.EL = this.randomize(this.EL);
        var D = new dsd(this.M * this.M);
        D.init();
        var s = this.h([0, 0]);
        var e = this.h([this.N - 1, this.M - 1]);
        this.Board[1][0] = ' ';
        this.Board[2 * this.N - 1][2 * this.M] = ' ';
        
        //Run Kruskal
        for (var i = 0; i < this.EL.length; i++)
        {
            var x = this.h(this.EL[i][0]);
            var y = this.h(this.EL[i][1]);
            
            if (D.find(s) == D.find(e))
            {
                if (!(D.find(x) == D.find(s) && D.find(y) == D.find(s)))
                {
                    if (D.find(x) != D.find(y))
                    {
                        D.union(x, y);
                        this.breakwall(this.EL[i]);
                        this.EL[i][2] = 0;
                    }
                }
            }

            else if (D.find(x) != D.find(y))
            {
                D.union(x, y);
                this.breakwall(this.EL[i]);
                this.EL[i][2] = 0;
            }
            else
            {
                continue;
            }
        }
    };

    this.draw_canvas = function(id)
    {
        this.canvas = document.getElementById(id);
        let scale = this.S;
        temp = []

        const wallTexture_h = new Image();
        const wallTexture_v = new Image();
        const pillarTexture = new Image();

        wallTexture_h.src = 'textures/texture_wall-h.jpg';
        wallTexture_v.src = 'textures/texture_wall-v.jpg';
        pillarTexture.src = 'textures/texture_stone.jpg';

        if (this.canvas.getContext)
        {
            this.ctx = this.canvas.getContext('2d');
            this.Board[1][0] = '$'

            // console.log(this.Board)

            for (var i = 1; i < 2 * this.N; i++) // RUNS 0 - 21
            {
                for (var j = 1; j < 2 * this.M; j++) // RUNS 0 - 21
                {
                    // ╔═══════════════════════════╗ \\
                    // ║ Checking if outer corners ║ \\
                    // ╚═══════════════════════════╝ \\

                    // if (i == 0 & j == 0) // Top left corner.
                    // {
                    //     this.ctx.fillStyle = "#0b052d";
                    //     this.ctx.fillRect(scale * i, scale * j, scale - 1, scale - 1);
                    // }
                    // else if (i == 2 * this.N && j == 0) // Top right corner.
                    // {
                    //     this.ctx.fillStyle = "#0b052d";
                    //     this.ctx.fillRect(scale * i, scale * j, scale - 1, scale - 1);
                    // }
                    // else if (i == 0 && j == 2 * this.M) // Bottom left corner.
                    // {
                    //     this.ctx.fillStyle = "#0b052d";
                    //     this.ctx.fillRect(scale * i, scale * j, scale - 1, scale - 1);
                    // }
                    // else if (i == 2 * this.N && j == 2 * this.M) // Bottom right corner.
                    // {
                    //     this.ctx.fillStyle = "#0b052d";
                    //     this.ctx.fillRect(scale * i, scale * j, scale - 1, scale - 1);
                    // }

                    // ╔═════════════════════════╗ \\
                    // ║ Checking if outer walls ║ \\
                    // ╚═════════════════════════╝ \\

                    // else if (0 < i < 2 * this.N && (j == 0 || j == 2 * this.M) && this.Board[i][j] != ' ') // Top and down walls.
                    // {
                    //     this.ctx.fillStyle = "#fcba03";
                    //     this.ctx.fillRect(scale * i, scale * j + scale / 4, scale - 1, 24);
                    // }
                    // else if (0 < j < 2 * this.M && (i == 0 || i == 2* this.N))
                    // {
                    //     this.ctx.fillStyle = "#8cfc03"; // Side walls.
                    //     this.ctx.fillRect(scale * i + scale / 4, scale * j, 24, scale - 1);
                    // }
                    // else
                    if (this.Board[i][j] != ' ')
                    {

                        // ╔═══════════════════╗ \\
                        // ║ Drawing inner map ║ \\
                        // ╚═══════════════════╝ \\

                        if (this.Board[i - 1][j] != ' ' && this.Board[i + 1][j] != ' ') // Horisontal
                        {
                            this.ctx.drawImage
                            (
                                wallTexture_h,
                                (scale * i) - (scale / 4),
                                (scale * j) + (scale / 4),
                                75,
                                25,
                            );
                        }
                        else if (this.Board[i][j - 1] != ' ' && this.Board[i][j + 1] != ' ') // Vertical
                        {
                            this.ctx.drawImage
                            (
                                wallTexture_v,
                                (scale * i) + (scale / 4),
                                (scale * j) - (scale / 4),
                                25,
                                75,
                            );
                        }
                        else
                        {
                            this.ctx.drawImage
                            (
                                pillarTexture,
                                (scale * i) + (scale / 4),
                                (scale * j) + (scale / 4),
                                25,
                                25,
                            );
                        }
                    }
                    else if(i < 5 && j < 5)
                        temp.push([i,j])

                    // this.ctx.fillStyle = "#0b052d"; // Walls color. STD = #0b052d
                    // this.ctx.fillRect(scale * i, scale * j, scale - 1, scale - 1);
                }
            }

            x = randomChoice(temp)
            // console.log(temp)
            this.Board[x[0]][x[1]] = '&'

            // this.ctx.fillStyle = "#c4192a"; // Player start color. STD = #c4192a
            // this.ctx.fillRect(scale* x[0], scale * x[1], scale, scale);

            characterSprite_Oleg = new Image();
            characterSprite_Oleg.src = 'textures/character_oleg.png';
            this.ctx.drawImage(characterSprite_Oleg, (scale * x[0]) - 15, (scale * x[1]) - 15, 70, 70);
                             //characterSprite_Oleg, (scale * a) - 10, (scale * b) - 10, scale * 1.3, scale * 1.3

            // characterSprite_Maximan = new Image();
            // characterSprite_Maximan.src = 'textures/character_maximan.png';
            // this.ctx.drawImage(characterSprite_Maximan, scale * (this.N * 2 - 1), scale * (this.M * 2), scale, scale); // Maximan's position.
        }
    };

    this.checkPos = function(id)
    {
        for (var i = 0; i < 2 * this.N + 1; i++)
        {
            for (var j = 0; j < 2 * this.M + 1; j++)
            {
                if (this.Board[i][j] == '&')
                {
                   // console.log(i,j)
                    return [i, j]
                }
            }
        }
    }

    this.moveclear = function(a, b)
    {
        var scale = this.S;

        // this.ctx = this.canvas.getContext('2d');
        // this.ctx.fillStyle = "#e27158"; // Player path color/ STD = #e27158
        // this.ctx.fillRect(scale * a, scale * b, scale, scale);
        
        this.ctx.clearRect((scale * a) - 10, (scale * b) - 10, 70, 70);
        
        this.Board[a][b] = ' '
    }

    this.move = function(a, b)
    {
        var scale = this.S;

        // this.ctx = this.canvas.getContext('2d');
        // this.ctx.fillStyle = "#c4192a"; // Moved player color. STD = #c4192a
        // this.ctx.fillRect(scale * a, scale * b, scale, scale);

        characterSprite_Oleg = new Image();
        characterSprite_Oleg.src = 'textures/character_oleg.png';
        this.ctx.drawImage(characterSprite_Oleg, (scale * a) - 15, (scale * b) - 15, 70, 70);

        this.Board[a][b] = '&'
    }

    this.moveup = function(id)
    {
        cord = this.checkPos(id);
        var scale = this.S;
        i = cord[0]
        j = cord[1]
        j -= 1

        if (j < 0)
            return
        else if (j > 2 * this.M)
            return
        else if (this.Board[i][j] == ' ')
        {
            this.moveclear(i, j + 1);
            this.move(i, j);
            this.moves += 1;
        }
        else
            return
    }

    this.movedown = function(id)
    {
        cord = this.checkPos(id);
        var scale = this.S;
        i = cord[0]
        j = cord[1]
        j += 1

        if(j < 0)
            return
        else if (j > 2 * this.M)
            return
        else if (this.Board[i][j] == ' ')
        {
            this.moveclear(i, j - 1);
            this.move(i, j);
            this.moves += 1;
        }
        else
            return
    }

    this.moveleft = function(id)
    {
        cord = this.checkPos(id);
        var scale = this.S;
        i = cord[0]
        j = cord[1]
        i -= 1
        if (i < 0)
            return
        else if (i > 2 * this.N)
            return
        else if (this.Board[i][j] == ' ')
        {
            this.moveclear(i + 1, j);
            this.move(i, j)
            this.moves += 1;
        }
        else
            return
    }

    this.moveright = function(id)
    {
        cord = this.checkPos(id);
        var scale = this.S;
        i = cord[0]
        j = cord[1]
        i += 1

        if(i < 0)
            return
        else if(i > 2 * this.N)
            return
        else if(this.Board[i][j] == ' ')
        {
            this.moveclear(i - 1, j);
            this.move(i, j);
            this.moves += 1;
        }
        else
            return
    }
    this.checker = function(id)
    {
        cord = this.checkPos(id);
        i = cord[0]
        j = cord[1]
        //console.log(cord)

        // if ((i == 19 && j == 20) || (i == 1 && j == 0)) //19, 20 - Coordinates of win position.
        if ((i == this.N * 2 - 1 && j == this.M * 2) || (i == 1 && j == 0)) //19, 20 - Coordinates of win position.
        {
            gameEvent_GameWin();
            return 1;
        }
        return 0
    }
};

// ╔═════════════╗ \\
// ║ Entry point ║ \\
// ╚═════════════╝ \\

let gameTime = 30;

gameMap = new maze(9, 14); // width, height.
gameMap.init();
gameMap.add_edges();
gameMap.gen_maze();
gameMap.draw_canvas("canvas"); // Rendering game.

startTimer(gameTime); // Run game timer.
let updateMovesCounterInterval = setInterval(updateMovesCounter, 100); // Run moves counter.