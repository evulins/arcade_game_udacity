
// Global variables
let collision = false;
let hearts = 5;
let pointCounter = 0;


// Enemies player must avoid
var Enemy = function(x, y, speed) {

    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = "images/enemy-bug.png";
};

// Updates the enemy's position and multiplies any movement by the dt parameter
// which will ensure the game runs at the same speed for all computers.
Enemy.prototype.update = function(dt) {

    this.x += this.speed * dt;

    if (this.x > 510) {
        this.x = -50;
        this.speed = 100 + Math.floor(Math.random() * 400);
    };
};

// Checks for collisions between the player and the enemies from 
// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
//If collision is detected than player goes back to the start point and looses one heart each time.
//If player has no hearts left then the game is over.
function checkCollisions() {

    for (var i = 0; i < allEnemies.length; i++) {
        var enemy = new Enemy(allEnemies[i].x, allEnemies[i].y);
        if (player.x < enemy.x + 80 &&
            player.x + 80 > enemy.x &&
            player.y < enemy.y + 60 &&
            60 + player.y > enemy.y) {
            resetPlayer();
            collision = true;
            updateHeartRating();
            displayFinalScore();
        };
        
    };
}

// Draws the enemy on the screen
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.player = 'images/char-pink-girl.png';
};

Player.prototype.update = function(dt) {
};

// Draws the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.player), this.x, this.y);
};

// Handles the player's moves
Player.prototype.handleInput = function(keyPress) {
    if (keyPress === 'left' && this.x > 0) {
        this.x -= 102;
    };
    if (keyPress === 'right' && this.x < 405) {
        this.x += 102;
    };
    if (keyPress === 'up' && this.y > 0) {
        this.y -= 83;
    };

    if (keyPress === 'down' && this.y < 405) {
        this.y += 83;
    };
// If player reaches the water, gets points and comes back to the start point
    if (this.y < 5) {
        updatePointCounter();
    };

    if (this.y < 0) {
        setTimeout(() => {
            resetPlayer();
        }, 100);
    };
// Starts the stopwatch
    if (keyPress === 'right' || keyPress === 'left' || keyPress === 'down' || keyPress === 'up') {
        $('.runner').runner('start');
    };
    
};



enemyLocation.forEach(function (y) {
    enemy = new Enemy(0, y, 200);
    allEnemies.push(enemy);
});

// Places the player object and sets it's position
var player = new Player(202, 405);

// Resets the player position
function resetPlayer() {
    player.x = 202;
    player.y = 405;
}

// Updates player's points
function updatePointCounter() {
    pointCounter += 10;
    $('span.points').text(pointCounter);
}

//Counts hearts (lifes)
function heartsCounter() {
    let heartsCount = hearts;
    if (collision === true) {
        hearts -= 1;
    }
    return hearts;
}

//Updates heart raiting
function updateHeartRating() {
    const heart = `
        <li>
            <i class="fas fa-heart"></i>
        </li>
    `;
    let heartsNumber = heartsCounter();
    $('.hearts').empty();
    for (let i = 0; i < heartsNumber; i = i + 1) {
        $('.hearts').append(heart);
    }
}

//Resets the game and the score
$('.restart, .button').on('click', function() {
    event.preventDefault();
    $('span.points').text('0');
    $('.runner').runner('reset', true);
    pointCounter = 0;
    collision = false;
    hearts = 5;
    updateHeartRating();
    resetPlayer();
    $('.score-popup').hide();
    $('.score-window').hide();
});

//Ends game and displays final score
function displayFinalScore() {
    if (hearts  === 0) {
        $('.runner').runner('stop');
        setTimeout (
            function() {
                const time = $('.runner').text();
                const scorePopup = $('.score-popup');
                scorePopup.find('.totalPoints').text(pointCounter);
                scorePopup.find('.totalTime').text(time);         
                scorePopup.show();
                $('.score-window').show();
            },
            500
        )
    }
}

// Listens for key presses and sends the keys
document.addEventListener('keyup', function(e) {
   
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };


    player.handleInput(allowedKeys[e.keyCode]);
});
