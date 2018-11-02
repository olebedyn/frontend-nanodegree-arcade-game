
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


class Enemy {
  constructor(){
    this.sprite = 'images/enemy-bug.png';
    this.x = this.initX();
    this.y = this.initY();
    this.speed = this.initSpeed();
  }

  update(dt) {
    if (this.x < 505) {
      this.x += 75 * dt * this.speed
    } else {
      this.x = 0;
      this.y = this.initY();
      this.speed = getRandomInt(1, 3)
    }
  }

  initX() {
    return 0;
  }


  initY() {
    return 50 * getRandomInt(1,3);
  }

  initSpeed() {
    return getRandomInt(1, 3);
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
  constructor(sprite = 'images/char-cat-girl.png') {
    this.sprite = 'images/char-cat-girl.png';
    this.x = this.initX();
    this.y = this.initY();
    this.lives = 3;
  }

  setSprite(sprite) {
    this.sprite = sprite;
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  getLives() {
    return this.lives;
  }

  die() {
    this.lives--;
  }

  initX() {
    return 101 * getRandomInt(0, 4);
  }

  initY() {
    return 83 * getRandomInt(4, 5);
  }

  reset() {
    this.x = this.initX();
    this.y = this.initY();
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

// function selectHero(obj) {
//   document.querySelector('.hero-avatar.selected').classList.remove('selected');
//   obj.classList.add('selected');
//   settings.selectHero = obj.getAttribute('src');
// }

// function startGame() {
//   init();
//   settings.difficulty = document.getElementById('range').value;
//   localStorage.setItem("selectedHero", settings.selectHero);
//   localStorage.setItem("gameDifficulty", settings.difficulty);
//   document.getElementById('overlay').classList.remove('visible');
//   for (let i=0; i < gameDifficultyToGameSettings(settings.difficulty).numEnemies; i++){
//     allEnemies[i] = new Enemy();
//   }
//   let player = new Player(settings.selectHero);
// }


function gameDifficultyToGameSettings(selectedDifficulty){
  switch (selectedDifficulty) {
    case "1":
      return 3
      break;
    case "2":
      return 6
      break;
    case "3":
      return 9
      break;
    default:
      return 3
  }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];
for (let i=0; i < 6; i++){
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
