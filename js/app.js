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

  getSprite() {
    return this.sprite;
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

  setLives(livesCount = 3) {
    this.lives = livesCount;
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

  update() {
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

  reset(){
    this.x = 0;
    this.y = 75 * getRandomInt(1, 3)
    this.speed = getRandomInt(1, 3)
  }
}

class Game {

  constructor() {
    this.player = new Player();
    this.enemies = [];
  }

  addEnemies(){
    const difficulty = parseInt(document.getElementById('range').value);
    for (let i=0; i < difficulty * 3; i++) {
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
    document.getElementById('overlay').classList.remove('visible');
    document.getElementById('lives').classList.add('visible');
  }

  showStartMenu() {
    document.getElementById('overlay').classList.add('visible');
    document.getElementById('lives').classList.remove('visible');
  }

  showLivesMenu() {
    this.player.blockMovement(); //block key input handling when menu is visible so users can't play blindfolded
    this.player.die(); //decrement player lives
    document.getElementById('lives-screen').classList.add('visible'); //show main lives screen
    if (this.player.getLivesCount() === 0) {  //if it's game over already
      this.showGameOverScreen();
    } else {
      this.adjustLivesCountInMenu(); //hide lives in game menus
      document.getElementById('lives').classList.remove('visible'); //hide top lives menu
      this.continueGame(); //show new live count and continue game
    }
  }


  adjustLivesCountInMenu() {
    const BIG_HEART_SELECTOR_VISIBLE = '.heart-big.active';
    const SMALL_HEART_SELECTOR_VISIBLE = '.heart-small.active';

    document.getElementById('lives-screen').querySelector(BIG_HEART_SELECTOR_VISIBLE).classList.replace('active','invisible'); //remove heart from big lives screen
    document.getElementById('lives').querySelector(SMALL_HEART_SELECTOR_VISIBLE).classList.replace('active','invisible'); //remove heart from small lives screen
  }

  resetLivesInMenus(){
    const BIG_HEART_SELECTOR_INVISIBLE = '.heart-big.invisible';
    const SMALL_HEART_SELECTOR_INVISIBLE = '.heart-small.invisible';

    let bigHeartsInvisible = document.getElementById('lives-screen').querySelectorAll(BIG_HEART_SELECTOR_INVISIBLE);
    let smallHeartsInvisible = document.getElementById('lives').querySelectorAll(SMALL_HEART_SELECTOR_INVISIBLE);

    for (let bigHeart of bigHeartsInvisible) {
      bigHeart.classList.replace('invisible', 'active');
    }
    for (let smallHeart of smallHeartsInvisible) {
      smallHeart.classList.replace('invisible', 'active');
    }
  }


  showGameOverScreen() {
    document.getElementById('lives').classList.remove('visible'); //hide top lives menu
    document.getElementById('lives-screen').querySelector('.alive-menu').classList.add('invisible');
    document.getElementById('lives-screen').querySelector('.dead-menu').classList.replace('invisible', 'visible');
    setTimeout( () => {
      document.getElementById('lives-screen').classList.remove('visible');
      document.getElementById('lives-screen').querySelector('.dead-menu').classList.replace('visible', 'invisible');
      this.restartGame();
    } , 2000)
  }

  continueGame() {
    setTimeout( () => {
      document.getElementById('lives-screen').classList.remove('visible');
      document.getElementById('lives').classList.add('visible');
      this.player.allowMovement();
    } , 2000)
  }

  showCongratsScreen() {
    this.player.blockMovement();
    document.getElementById('lives').classList.remove('visible');
    document.getElementById('won-menu').classList.replace('invisible', 'visible');
    setTimeout( () => {
      document.getElementById('won-menu').classList.replace('visible', 'invisible');
      this.restartGame();
    } , 2000)
  }

  restartGame() {
    this.player.reset(); //reset player
    this.enemies = []; // cleanup enemies
    this.adjustLivesCountInMenu(); // reset lives icons in menus
    this.showStartMenu();
    this.resetLivesInMenus();
    document.getElementById('lives-screen').querySelector('.alive-menu').classList.remove('invisible');
    document.getElementById('lives-screen').querySelector('.dead-menu').classList.replace('visible', 'invisible');
  }

  startGame() {
    this.addEnemies(); //initiate enemies
    this.hideStartMenu(); // hide main game menu
    this.player.allowMovement();
  }

  selectHero(obj) {
    document.querySelector('.hero-avatar.selected').classList.remove('selected');
    obj.classList.add('selected');
    const heroSrc = document.querySelector('.selected').getAttribute('src');
    this.getPlayer().setSprite(heroSrc);
    document.getElementById('lives-screen').querySelector('.hero').setAttribute('src', heroSrc);
  }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Wrapping enemies and player into a game class object so it's easier to control game flow with all the screens that appear in-between. This also make the flow in the engine more readable and easier to change if needed
const game = new Game();
