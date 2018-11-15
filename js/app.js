function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Player {
  constructor() {
    this.sprite = 'images/char-cat-girl.png';
    this.x = this.initX();
    this.y = this.initY();
    this.lives = 3;

    /* define handler explicitly so it's possible to remove it
    later on when menu is shown */
    this.movementHandler = this.handleInput.bind(this);
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

  getLivesCount() {
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

  /*
  * Reset player's position and live count in case it's a game over or player
  * won a game
  */
  reset(isGameWon) {
    this.x = this.initX();
    this.y = this.initY();
    if (this.lives === 0 || isGameWon) {
      this.lives = 3;
    }
  }

  update() {
    // not sure what to put here, both coordinates update and rendering is done in handleInput
  }

  handleInput(e) {
    const allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };
    const keyCode = allowedKeys[e.keyCode];

    switch (keyCode) {
      case 'left':
        this.x = this.x - 101 < 0 ? this.x : this.x - 101;
        break;
      case 'up':
        this.y = this.y - 83 < 0 ? this.y : this.y - 83;
        break;
      case 'right':
        this.x = this.x + 101 >= ctx.canvas.width ? this.x : this.x + 101;
        break;
      case 'down':
        this.y = this.y + 83 >= 420 ? this.y : this.y + 83;
        break;
    }
    this.render();
  }

  /*
  * Disable keyborad controls
  */
  blockMovement() {
    document.removeEventListener('keyup', this.movementHandler);
  }

  /*
  * Enable keyborad controls
  */
  allowMovement() {
    document.addEventListener('keyup', this.movementHandler);
  }
}

class Enemy {
  constructor(maxSpeed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = this.initX();
    this.y = this.initY();
    this.maxSpeed = maxSpeed;
    this.speed = this.initSpeed(maxSpeed);
  }

  update(dt) {
    if (this.x < 505) {
      this.x += 75 * dt * this.speed;
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
    return 70 * getRandomInt(1, 3);
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
    this.initMenuElements = this.initElements.bind(this);
    document.addEventListener('DOMContentLoaded', this.initMenuElements);
  }

  /*
  * Initiate menu elements in class once the DOM is loaded
  * and then re-use to control game flow.
  */
  initElements() {
    this.startMenu = document.getElementById('main-menu');
    this.gameDifficulty = document.getElementById('range');
    this.topLivesMenu = document.getElementById('lives-top-menu');
    this.livesMenu = document.getElementById('lives-screen');
    this.aliveMenu = document.getElementById('alive-menu');
    this.deadMenu = document.getElementById('dead-menu');
    this.wonMenu = document.getElementById('won-menu');
  }

  /*
  * This function adds different number of enemies with different max speed
  * once the difficulty has been selected by the user.
  */
  addEnemies() {
    const difficulty = parseInt(this.gameDifficulty.value);

    for (let i = 0; i < difficulty * 3; i++) {
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
    this.topLivesMenu.classList.replace('invisible', 'visible');
  }

  showStartMenu() {
    this.startMenu.classList.add('visible');
    this.topLivesMenu.classList.replace('visible', 'invisible');
  }

  showLivesMenu() {
    this.livesMenu.classList.replace('invisible', 'visible');
    this.topLivesMenu.classList.replace('visible', 'invisible');
  }

  hideLivesMenu() {
    this.livesMenu.classList.replace('visible', 'invisible');
    this.topLivesMenu.classList.replace('invisible', 'visible');
  }

  /*
  * This function shows the number of hero lives left once collision occurs or
  * shows game over screen in case no more hero lives left
  */
  showDeadScreen() {
    this.player.blockMovement();
    this.player.die();
    this.showLivesMenu();
    if (this.player.getLivesCount() === 0) {
      this.showGameOverScreen();
    } else {
      this.adjustLivesCountInMenu();
      setTimeout(() => {
        this.hideLivesMenu();
        this.player.allowMovement();
      }, 2000);
    }
  }

  /*
  * This function hides additional lives in menus when hero dies.
  */
  adjustLivesCountInMenu() {
    const BIG_HEART_SELECTOR_VISIBLE = '.lives-screen__heart-big.active';
    const SMALL_HEART_SELECTOR_VISIBLE = '.lives-top-menu__heart-small.active';

    this.livesMenu
      .querySelector(BIG_HEART_SELECTOR_VISIBLE)
      .classList.replace('active', 'invisible'); // remove heart from big lives screen
    this.topLivesMenu
      .querySelector(SMALL_HEART_SELECTOR_VISIBLE)
      .classList.replace('active', 'invisible'); // remove heart from small lives screen
  }

  /*
  * This function resets lives in menus to initial state.
  */
  resetLivesInMenus() {
    const BIG_HEART_SELECTOR_INVISIBLE = '.lives-screen__heart-big.invisible';
    const SMALL_HEART_SELECTOR_INVISIBLE = '.lives-top-menu__heart-small.invisible';

    const bigHeartsInvisible = this.livesMenu.querySelectorAll(
      BIG_HEART_SELECTOR_INVISIBLE
    );
    const smallHeartsInvisible = this.topLivesMenu.querySelectorAll(
      SMALL_HEART_SELECTOR_INVISIBLE
    );

    for (const bigHeart of bigHeartsInvisible) {
      bigHeart.classList.replace('invisible', 'active');
    }
    for (const smallHeart of smallHeartsInvisible) {
      smallHeart.classList.replace('invisible', 'active');
    }
  }

  showGameOverScreen() {
    this.topLivesMenu.classList.replace('visible', 'invisible');
    this.aliveMenu.classList.add('invisible');
    this.deadMenu.classList.replace('invisible', 'visible');
    setTimeout(() => { // wait for a few seconds and then hide the screen
      this.livesMenu.classList.replace('visible', 'invisible');
      this.deadMenu.classList.replace('visible', 'invisible');
      this.restartGame();
    }, 2000);
  }

  showCongratsScreen() {
    this.player.blockMovement();
    this.topLivesMenu.classList.replace('visible', 'invisible');
    this.wonMenu.classList.replace('invisible', 'visible');
    setTimeout(() => { // wait for a few seconds and then hide the screen
      this.wonMenu.classList.replace('visible', 'invisible');
      this.restartGame(true);
    }, 2000);
  }

  /*
  * This function resets all the game parameters to the inital values.
  */
  restartGame(isGameWon = false) {
    this.player.reset(isGameWon); // reset player
    this.enemies = []; // cleanup enemies
    this.adjustLivesCountInMenu(); // reset lives icons in menus
    this.showStartMenu();
    this.resetLivesInMenus();
    this.aliveMenu.classList.remove('invisible');
    this.deadMenu.classList.replace('visible', 'invisible');
  }

  /*
  * This function is an entry point to the game.
  */
  startGame() {
    this.addEnemies();
    this.hideStartMenu();
    this.player.allowMovement();
  }

  /*
  * This function controls hero sprite selection on star menu screen.
  */
  selectHero(obj) {
    document
      .querySelector('.main-menu__hero-avatar.selected')
      .classList.remove('selected');
    obj.classList.add('selected'); // highlight new hero
    const heroSrc = document.querySelector('.selected').getAttribute('src');
    this.player.setSprite(heroSrc);
    // update hero image in lives screen as well
    this.livesMenu.querySelector('.lives-screen__hero').setAttribute('src', heroSrc);
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Wrapping enemies and player into a game class object so it's easier to control
//game flow with all the screens that appear in-between.
// This also make the flow in the engine more readable and easier to change if needed
const game = new Game();
