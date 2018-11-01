
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Enemy {
  constructor(){
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = 50 * getRandomInt(1,3)
    this.speed = getRandomInt(1, 3)
  }

  update(dt) {
    if (this.x < 505) {
      this.x += 75 * dt * this.speed
    } else {
      this.x = 0;
      this.speed = getRandomInt(1, 3)
    }
  }


  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  reset(){
    this.x = 0;
    this.y = 75 * getRandomInt(1, 3)
    this.speed = getRandomInt(1, 3)
  }


}

class Player {
  constructor(sprite) {
    this.sprite = sprite;
    this.x = 101 * getRandomInt(0, 4);
    this.y = 83 * getRandomInt(4, 5)
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  reset() {
    this.x = 101 * getRandomInt(0, 4);
    this.y = 83 * getRandomInt(4, 5)
  }

  update() {
  }

  handleInput(keyCode){
    switch (keyCode) {
      case 'left':
        this.x  = (this.x - 101 < 0) ? this.x : this.x - 101;
        break;
      case 'up':
        this.y  = (this.y - 83 < 0) ? this.y : this.y - 83;
        break;
      case 'right':
        this.x  = (this.x + 101 >= ctx.canvas.width) ? this.x : this.x + 101;
        break;
      case 'down':
        this.y  = (this.y + 82 >= 420) ? this.y : this.y + 82;
        break;
    }
    this.render();
  }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];
for (let i=0; i<6;i++){
  allEnemies[i] = new Enemy();
}
let playerSprites = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-princess-girl.png',
        'images/char-pink-girl.png',
        'images/char-horn-girl.png'
      ]
let player = new Player(playerSprites[getRandomInt(0,playerSprites.length - 1)]);



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
