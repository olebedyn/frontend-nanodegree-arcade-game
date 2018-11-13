function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Player {
  constructor() {
    this.sprite = 'images/char-cat-girl.png';
    this.x = this.initX();
    this.y = this.initY();
    this.lives = 3;
    this.movementHandler = this.handleInput.bind(this); // define handler explicitly so it's possible to remove it later on when menu is shown
  }

  setSprite(sprite) {
    this.sprite = sprite;
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  die() {
    this.lives--;
  }

  getLivesCount(){
    return this.lives;
  }

  initX() {
    return 101 * getRandomInt(0, 4);
  }

  initY() {
    return 83 * getRandomInt(4, 5);
  }

  getY() {
    return this.y;
  }

  getX() {
    return this.x;
  }

  reset() {
    this.x = this.initX();
    this.y = this.initY();
    if (this.lives === 0) {
      this.lives = 3;
    }
  }

  update() { //not sure what to put here, both coordinates update and rendering is done in handleInput
  }

  handleInput(e){
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    const keyCode = allowedKeys[e.keyCode];

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
        this.y  = (this.y + 83 >= 420) ? this.y : this.y + 83;
        break;
    }
    this.render();
  }

  blockMovement() {
    document.removeEventListener('keyup', this.movementHandler);
  }

  allowMovement() {
    document.addEventListener('keyup', this.movementHandler);
  }
}

class Enemy {
  constructor(maxSpeed){
    this.sprite = 'images/enemy-bug.png';
    this.x = this.initX();
    this.y = this.initY();
    this.maxSpeed = maxSpeed;
    this.speed = this.initSpeed(maxSpeed);
  }

  update(dt) {
    if (this.x < 505) {
      this.x += 75 * dt * this.speed
    } else {
      this.x = 0;
      this.y = this.initY();
      this.speed = this.initSpeed(this.maxSpeed);
    }
  }

  initX() {
    return 0;
  }

  initY() {
    return 70 * getRandomInt(1,3);
  }

  initSpeed(maxSpeed) {
    return getRandomInt(1, maxSpeed);
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

class Game {
  constructor() {
    this.player = new Player();
    this.enemies = [];

    //menu elements
    this.startMenu = document.getElementById('overlay');
    this.gameDifficulty = document.getElementById('range');
    this.topLivesMenu = document.getElementById('lives');
    this.livesMenu = document.getElementById('lives-screen');
    this.aliveMenu = document.getElementById('alive-menu');
    this.deadMenu = document.getElementById('dead-menu');
    this.wonMenu = document.getElementById('won-menu');
  }

  /*
  This function adds different number of enemies with different max speed once the difficulty has been selected by the user.
  */
  addEnemies(){
    for (let i=0; i < parseInt(this.gameDifficulty.value) * 3; i++) {
      this.enemies.push(new Enemy(difficulty * 2));
    }
  }

  getEnemies() {
    return this.enemies;
  }

  getPlayer() {
    return this.player;
  }

  hideStartMenu() {
    this.startMenu.classList.remove('visible');
    this.topLivesMenu.classList.add('visible');
  }

  showStartMenu() {
    this.startMenu.classList.add('visible');
    this.topLivesMenu.classList.remove('visible');
  }

  showLivesMenu() {
    this.livesMenu.classList.add('visible');
    this.topLivesMenu.classList.add('invisible');
  }

  hideLivesMenu() {
    this.livesMenu.classList.remove('visible');
    this.topLivesMenu.classList.remove('invisible');
  }

  /*
    This function shows the
    number of hero lives left once collision occurs or shows game over in case no more hero lives left
  */
  showDeadScreen() {
    this.player.blockMovement();
    this.player.die();
    this.showLivesMenu();
    if (this.player.getLivesCount() === 0) {  //if it is a game over already
      this.showGameOverScreen();
    } else {
      this.adjustLivesCountInMenu();
      this.hideLivesMenu();
      this.continueGame();
    }
  }

 /*
 Subtract lives in menus when hero dies
 */
  adjustLivesCountInMenu() {
    const BIG_HEART_SELECTOR_VISIBLE = '.heart-big.active';
    const SMALL_HEART_SELECTOR_VISIBLE = '.heart-small.active';

    this.livesMenu.querySelector(BIG_HEART_SELECTOR_VISIBLE).classList.replace('active','invisible'); //remove heart from big lives screen
    this.topLivesMenu.querySelector(SMALL_HEART_SELECTOR_VISIBLE).classList.replace('active','invisible'); //remove heart from small lives screen
  }

/* Adjust lives number in menu back */
  resetLivesInMenus(){
    const BIG_HEART_SELECTOR_INVISIBLE = '.heart-big.invisible';
    const SMALL_HEART_SELECTOR_INVISIBLE = '.heart-small.invisible'

    let bigHeartsInvisible = this.livesMenu.querySelectorAll(BIG_HEART_SELECTOR_INVISIBLE);
    let smallHeartsInvisible = this.topLivesMenu.querySelectorAll(SMALL_HEART_SELECTOR_INVISIBLE);

    for (let bigHeart of bigHeartsInvisible) {
      bigHeart.classList.replace('invisible', 'active');
    }
    for (let smallHeart of smallHeartsInvisible) {
      smallHeart.classList.replace('invisible', 'active');
    }
  }

  showGameOverScreen() {
    this.topLivesMenu.classList.remove('visible'); //hide top lives menu
    this.aliveMenu.classList.add('invisible');
    this.deadMenu.classList.replace('invisible', 'visible');
    setTimeout( () => {
      this.livesMenu.classList.remove('visible');
      this.deadMenu.classList.replace('visible', 'invisible');
      this.restartGame();
    } , 2000)
  }

/* This just hides the lives menu and shows game field*/
  continueGame() {
    setTimeout( () => {
      this.livesMenu.classList.remove('visible');
      this.topLivesMenu.classList.add('visible');
      this.player.allowMovement();
    } , 2000)
  }

/*This will show congrats screen when player wins*/
  showCongratsScreen() {
    this.player.blockMovement();
    this.topLivesMenu.classList.remove('visible');
    this.wonMenu.classList.replace('invisible', 'visible');
    setTimeout( () => {
      this.wonMenu.classList.replace('visible', 'invisible');
      this.restartGame();
    } , 2000)
  }

  restartGame() {
    this.player.reset(); //reset player
    this.enemies = []; // cleanup enemies
    this.adjustLivesCountInMenu(); // reset lives icons in menus
    this.showStartMenu();
    this.resetLivesInMenus();
    this.aliveMenu.classList.remove('invisible');
    this.deadMenu.classList.replace('visible', 'invisible');
  }

  startGame() {
    this.addEnemies();
    this.hideStartMenu();
    this.player.allowMovement();
  }

  selectHero(obj) {
    document.querySelector('.hero-avatar.selected').classList.remove('selected');
    obj.classList.add('selected'); //highlight new hero
    const heroSrc = document.querySelector('.selected').getAttribute('src');
    this.player.setSprite(heroSrc);
    this.livesMenu.querySelector('.hero').setAttribute('src', heroSrc); //update hero image in lives screen as well
  }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Wrapping enemies and player into a game class object so it's easier to control game flow with all the screens that appear in-between. This also make the flow in the engine more readable and easier to change if needed
const game = new Game();
