
//GLobal 

let collision = false;
let stars = 5;
let pointCounter = 0;


// Enemies player must avoid
var Enemy = function(x, y, speed) {

    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = "images/enemy-bug.png";
    // this is called every time you do `new Enemy(n,n)
    // the new object will automatically be pushed to the array.
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
//collision detected!
function checkCollisions() {

    for (var i = 0; i < allEnemies.length; i++) {
        var enemy = new Enemy(allEnemies[i].x, allEnemies[i].y);
        if (player.x < enemy.x + 80 &&
            player.x + 80 > enemy.x &&
            player.y < enemy.y + 60 &&
            60 + player.y > enemy.y) {
            resetPlayer();
            collision = true;
            updateStarRating();
        };
        
    };
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.player = 'images/char-pink-girl.png';
};

Player.prototype.update = function(dt) {
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.player), this.x, this.y);
};

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

    if (this.y < 5) {
        updatePointCounter();
    };

    if (this.y < 0) {
        setTimeout(() => {
            resetPlayer();
        }, 100);
    };
    $('.runner').runner('start');
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

var enemyLocation = [63, 147, 230];

enemyLocation.forEach(function (locationY) {
    enemy = new Enemy(0, locationY, 200);
    allEnemies.push(enemy);
});

var player = new Player(202, 405);

function resetPlayer() {
    player.x = 202;
    player.y = 405;
}

function updatePointCounter() {
    pointCounter += 10;
    $('span.points').text(pointCounter);
}

// $('.close').on('click', function() {
//     event.preventDefault();
//     $('.score-popup').hide();
//     $('.score-window').hide();
// });



//Counts stars
function starsCounter() {
    let starsCount = stars;
    if (collision === true) {
        stars -= 1;
    }
    return stars;
};

//Updates stare raiting
function updateStarRating() {
    const star = `
        <li>
            <i class='fa fa-star'></i>
        </li>
    `;
    let starsNumber = starsCounter();
    $('.stars').empty();
    for (let i = 0; i < starsNumber; i = i + 1) {
        $('.stars').append(star);
    }
};

//Resets the game and the score
$('.restart, .button').on('click', function() {
    event.preventDefault();
    $('span.points').text('0');
    $('.runner').runner('reset', true);
    pointCounter = 0;
    collision = false;
    stars = 5;
    updateStarRating();
    resetPlayer();
    $('.score-popup').hide();
    $('.score-window').hide();
    init();
});

//Displays final score
function displayFinalScore() {
    let starsNumber = starsCounter();
    console.log(starsNumber);
    if (starsNumber === 0) {
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

//Closes pop-up with the final score
$('.close').on('click', function() {
    event.preventDefault();
    $('.score-popup').hide();
    $('.score-window').hide();
});


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
