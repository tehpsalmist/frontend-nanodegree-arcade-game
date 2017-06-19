// Passing in the coordinates and speed allows greater flexibility
// when adding new features and varying characters.
var Enemy = function(h, v, s, r) {
    //h represents horizontal
    this.x = h;
    //v represents vertical
    this.y = v;
    // negative values passed in for s cause the enemy to travel
    // backwards (<--right-to-left).
    this.speed = s;
    // The resetLoc variable allows you to keep the enemies
    // in either a steady rhythm (by passing in the same value for
    // each speed type), or a more sporadic pattern (by passing in
    // entirely different values for each enemy--try it out!).
    this.resetLoc = r;
    // this if statement determines which direction the bug is
    // traveling (based on negative or positive speed), and matches
    // up the appropriate image.
    if (this.speed < 0) {
        this.sprite = 'images/enemy-bug-rev.png';
    } else {
        this.sprite = 'images/enemy-bug.png';
    };
};

// Updates the enemy's position
// Parameter: dt, a time delta between ticks (set up in engine.js)
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed * dt * 75); //makes them move
    this.reset(); //makes them come back for more
    if (this.checkCollision() === true) {
        player.reset();
        // This for loop makes sure that the toy is dropped and
        // returned to the pool when the enemy hits the player.
        for (var i = allToys.length - 1; i >= 0; i--) {
             if (allToys[i].pickedUp === true) {
                allToys[i].pickedUp = false;
                allToys[i].reset();
             };
         };
    };
};

// Draws the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// This function determines which direction the enemy is traveling
// (negative speed runs backwards) and resets the enemy at its
// resetLoc value when it has fully passed off the canvas.
Enemy.prototype.reset = function() {
    if (this.x > 508 && this.speed > 0) {
        this.x = this.resetLoc;
    } else if (this.x < -105 && this.speed < 0) {
        this.x = this.resetLoc;
    };
};

// This function checks for a player-enemy collision. It is called
// in the main game loop by the Enemy.prototype.update function.
Enemy.prototype.checkCollision = function() {
    if (player.x > this.x - 70 &&
        player.x < this.x + 70 &&
        player.y > this.y - 10 &&
        player.y < this.y + 10) {
        var collision = true;
    } else {
        var collision = false;
    };
    return collision;
};

// Passing in the initial coordinates gives flexibility when adding
// new features and creating a variety of players.
var Player = function(h, v) {
    this.sprite = 'images/char-princess-girl.png';
    this.x = h;
    this.y = v;
    // The reset values are preserved here.
    this.resetLocX = h;
    this.resetLocY = v;
    // Determines whether the player can pick up another toy ("empty")
    // or not ("full"). I designed it to be one-at-a-time gameplay.
    this.full = false;
    this.enemyPoints = 0;
    this.playerPoints = 0;
    this.messageBoard = 'Abi! Clean up your toys!';
    this.pickedUpName = '';
};

// Parameter: dt, a time delta between ticks (which isn't in use here, actually)
Player.prototype.update = function(dt) {
    //Display Scoring
    document.getElementById("enemyPoints").innerHTML = player.enemyPoints;
    document.getElementById("playerPoints").innerHTML = player.playerPoints;

    if (this.y < 240 && this.y > 70) {
        if (this.full === true) {
            this.messageBoard = 'Bring the ' + this.pickedUpName + ' back to the rock!';
        } else {
        this.messageBoard = 'Careful in the road, Abi!';
        };
    };
    if (this.y > 230 && this.full === true) {
        this.messageBoard = 'Yay! You made it back!';
    }
};

// Draws the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    ctx.font = '18pt Helvetica';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText(this.messageBoard, 252.5, 575);
};

// I will confess, I copied this code from somewhere, and changed
// the values to my liking. Works like a dream.
// This moves the player based on the arrow keys.
Player.prototype.handleInput = function(key){
    if (key === 'left' && this.x > 5) {
        this.x -=30;
        };
    if (key === 'up' && this.y > 0) {
        this.y -= 83;
        };
    if (key === 'right' && this.x < 400) {
        this.x += 30;
        };
    if (key === 'down' && this.y < 400) {
        this.y +=83;
        };
    // I included this, because portions of the characters that go
    // above the water background image do not disappear. It looked
    // super tacky, so I attached a clearRect to these keystrokes.
    if (key === 'left' || 'right' || 'down') {
        ctx.clearRect(0, 0, 505, 100);
    }
};

// Sends the player back to her initial location
Player.prototype.reset = function() {
    this.x = this.resetLocX;
    this.y = this.resetLocY;
    // This function also empties the player's hands, so she can
    // go pick up the toy she just dropped.
    this.full = false;
    this.enemyPoints++;
    this.messageBoard = 'No, no, Abi!';
};

// Class for creating the drop-off rock. New values can be passed in
// for different drop off points in different levels.
var Rock = function(h, v) {
    this.sprite = 'images/Rock.png';
    this.x = h;
    this.y = v;
};

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Toy = function(h, v, oX, oY, img, n) {
    this.sprite = img;
    this.name = n;
    this.x = h;
    this.y = v;
    this.resetLocX = h;
    this.resetLocY = v;
    // Differences in image sizes and shape required these offset
    // variables to be necessary. Specifying how each image fits
    // in the blocks and in relation to the player keeps everything
    // looking sharp and the pickup/dropoff functions working properly.
    this.offsetX = oX;
    this.offsetY = oY;
    // When pickedUp is true, the toy will move with the player.
    this.pickedUp = false;
    // This variable is used once to cause the drop off chain of functions,
    // then set back to false to avoid pickup capability while player is full.
    this.droppingOff = false;
    // When droppedOff is true, pickUp() is prevented.
    this.droppedOff = false;
};

// Draws the toys on the canvas
Toy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Sends the toy to its original location when the player hits an enemy.
Toy.prototype.reset = function() {
    this.x = this.resetLocX;
    this.y = this.resetLocY;
};

// Runs in engine.js with the player and enemy update functions. This
// function makes sure that only one toy at a time is picked up/dropped off.
Toy.prototype.update = function() {
    if (player.full === false && this.droppedOff === false) {
        this.checkPickUp();
    };
    if (this.pickedUp === true) {
        this.carry();
    }
    if (this.droppedOff === false) {
        this.checkDropOff();
    };
    if (this.droppingOff === true) {
        this.dropOff();
    }
};

// This function is called by toy-update, and determines if the player is
// close enough to pick up the toy.
Toy.prototype.checkPickUp = function() {
    if (player.x > this.x - 35 &&
        player.x < this.x + 35 &&
        player.y > this.y - 35 &&
        player.y < this.y + 35) {
        // If the conditions are met, the toy is picked up, and the
        // player's arms are now "full."
        this.pickedUp = true;
        player.full = true;
        player.pickedUpName = this.name;
        player.messageBoard = 'You grabbed the ' + this.name + '!';
    };
    // Once the toy has been labeled "picked up," the if condition
    // does not need to be satisfied exactly anymore. This return
    // statement alone will trigger the carry function, which mimics
    // the player's location + offset values.
    return this.pickedUp;
};

// Establishes the toy's new location aligned with the player.
Toy.prototype.carry = function() {
    this.x = player.x + this.offsetX;
    this.y = player.y + this.offsetY;
};

// When a toy is brought to the rock, its "dropped off" status is changed.
// This change triggers the drop off function when it is called by
// the update function.
Toy.prototype.checkDropOff = function() {
    if (rock.x > this.x - 35 &&
        rock.x < this.x + 35 &&
        rock.y > this.y - 35 &&
        rock.y < this.y + 35) {
        this.droppingOff = true;
    };
    return this.droppingOff;
};

// This function reassigns the toy's location to match up with the rock,
// with the offset making it visually pleasing.
Toy.prototype.dropOff = function() {
    this.x = rock.x + this.offsetX;
    this.y = rock.y + this.offsetY;
    this.droppingOff = false;
    player.playerPoints++;
    //Display which Toy was dropped off in index.html;
    var t = document.createTextNode(this.name);
    document.getElementById("toysRetrieved").appendChild(t);
    var br = document.createElement("br");
    document.getElementById("toysRetrieved").appendChild(br)
    // Changing droppedOff to true keeps it from being inspected by later
    // checkPickUp or checkDropOff functions.
    this.droppedOff = true;
    // Changing pickedUp to false unlinks it from the player's location.
    this.pickedUp = false;
    // Changing full to false allows the player to pick up another toy.
    player.full = false;
    // Messages to display after a Toy is dropped off
    if (player.playerPoints === 1) {
        player.messageBoard = 'Good job! 1 point!';
    } else if (player.playerPoints === 2) {
        player.messageBoard = 'Hey, you scored again!';
    } else if (player.playerPoints === 3) {
        player.messageBoard = 'Well done, Abi!';
    } else if (player.playerPoints === 4) {
        player.messageBoard = 'Nice work, you\'re almost done!';
    } else if (player.playerPoints === allToys.length) {
        if (player.enemyPoints === 0) {
            player.messageBoard = '0 deaths--BEAST MODE'
        } else if (player.enemyPoints < player.playerPoints) {
            player.messageBoard = 'Wow, those bugs didn\'t stand a chance!';
        } else if (player.enemyPoints === player.playerPoints) {
            player.messageBoard = 'It\'s a tie!';
        } else if (player.enemyPoints < 10) {
            player.messageBoard = player.enemyPoints + ' deaths: a valiant effort!';
        } else if (player.enemyPoints < 20) {
            player.messageBoard = player.enemyPoints + ' fails, better luck next time...';
        } else if (player.enemyPoints < 30) {
            player.messageBoard = player.enemyPoints + '? Don\'t quit your day job...';
        } else if (player.enemyPoints < 40) {
            player.messageBoard = 'Honestly, that was rather embarrassing.';
        } else if (player.enemyPoints < 50) {
            player.messageBoard = 'Well, you\'ve got persistence, at least...';
        } else {
            player.messageBoard = 'You died ' + player.enemyPoints + ' times...that\'s insane.';
        }
    };
};

// Character Variables

// This array keeps track of all instances of the Enemy class.
var allEnemies = [];

// New enemy variables pass in starting x and y, speed, and the resetLoc.

// Top row enemies (y = 63)
var enemyFast1 = new Enemy(-130, 63, 3, -130);
var enemyFast2 = new Enemy(-231, 63, 3, -130);
var enemyFast3 = new Enemy(-332, 63, 3, -130);

// Middle row enemies (y = 146)
var enemyAverage1 = new Enemy(510, 146, -2, 510);
var enemyAverage2 = new Enemy(611, 146, -2, 510);
var enemyAverage3 = new Enemy(813, 146, -2, 510);

// Bottom row enemies (y = 229)
var enemySlow1 = new Enemy(-130, 229, 1, -130);
var enemySlow2 = new Enemy(-231, 229, 1, -130);
var enemySlow3 = new Enemy(-433, 229, 1, -130);

// Pushes new instances of the Enemy class to the allEnemies array.
allEnemies.push(enemySlow1,
    enemyAverage1,
    enemyFast1,
    enemySlow2,
    enemyAverage2,
    enemyFast2,
    enemySlow3,
    enemyAverage3,
    enemyFast3
);

// New player variables pass in the initial x and y.
var player = new Player(-10, 404);

// New rock variables pass in the location x and y.
var rock = new Rock(405, 404);

// This array keeps track of all instances of the Toy class.
var allToys = [];

// New toy variables pass in starting x and y, visual Offset x and y,
// and the sprite image.
var blueGem = new Toy(10, 12, 7, 23, 'images/Gem Blue.png', 'Blue Gem')
var greenGem = new Toy(111, 12, 11, 23, 'images/Gem Green.png', 'Green Gem')
var key = new Toy(212, 12, 12, 23, 'images/Key.png', 'Gold Key')
var orangeGem = new Toy(313, 12, 9, 23, 'images/Gem Orange.png', 'Orange Gem')
var star = new Toy(416, 12, 7, 23, 'images/Star.png', 'Gold Star')

// Pushes new instances of the Toy class to the allToys array.
allToys.push(blueGem,
    greenGem,
    orangeGem,
    key,
    star
);

// This listens for key presses and sends the keys to the
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
