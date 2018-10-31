
class Enemy {
  constructor(){
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = 75 * (Math.floor(Math.random() * 3) + 1);
    this.speed = Math.floor(Math.random() * 3) + 1;
  }

  update(dt) {
    if (this.x < 505) {
      this.x += 101 * dt * this.speed
    } else {
      this.x = 0;
      this.speed = Math.floor(Math.random() * 3) + 1;
    }
  }


  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  reset(){
    this.x = 0;
    this.y = 75 * (Math.floor(Math.random() * 3) + 1);
    this.speed = Math.floor(Math.random() * 3) + 1;
  }


}

class Player {
  constructor() {
    this.sprite = 'images/char-cat-girl.png';
    this.x = 0;
    this.y = 75 * (Math.floor(Math.random() * 4) + 4);
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  reset() {
    this.x = 0;
    this.y = 75 * (Math.floor(Math.random() * 4) + 4);
  }

  update() {
    
  }

  handleInput(keyCode){
    switch (keyCode) {
      case 'left':
        this.x  = (this.x - 110 < 0) ? this.x : this.x - 110;
        break;
      case 'up':
        this.y  = (this.y - 75 < 0) ? this.y : this.y - 75;
        break;
      case 'right':
        this.x  = (this.x + 110 > ctx.canvas.width) ? this.x : this.x + 110;
        break;
      case 'down':
        this.y  = (this.y + 75 > 375) ? this.y : this.y + 75;
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
let player = new Player();



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
