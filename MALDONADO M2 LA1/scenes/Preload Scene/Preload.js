class Preload extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    console.log('🧩 Preloading assets...');

    this.load.on('progress', (value) => {
      console.log(`Loading: ${Math.floor(value * 100)}%`);
    });

    this.load.tilemapTiledJSON('map', 'assets/tilemaps/map.tmj');
    this.load.tilemapTiledJSON('map2', 'assets/tilemaps/map2.tmj');
    this.load.tilemapTiledJSON('map3', 'assets/tilemaps/map3.tmj');
    this.load.image('mapTiles', 'assets/images/map.png');
    this.load.image('sunTiles', 'assets/images/sun.png');
    this.load.spritesheet('characterTiles', 'assets/images/characters.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('ambienceSprites', 'assets/images/AMBIENCE.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.image('heart', 'assets/images/heart.png');
    this.load.image('emptyHeart', 'assets/images/empty_heart.png');
    this.load.image('token', 'assets/images/token.png');

    this.load.audio('coinSfx', 'assets/sounds/coin_sfx.mp3');
    this.load.audio('hurtSfx', 'assets/sounds/hurt_sfx.mp3');
    this.load.audio('playButton', 'assets/sounds/play_button.mp3');
    this.load.audio('jumpSfx', 'assets/sounds/jump_sfx.mp3');
    this.load.audio('menuMusic', 'assets/sounds/menu_music.mp3');
    this.load.audio('lvl1Music', 'assets/sounds/level1_music.mp3');
    this.load.audio('victoryMusic', 'assets/sounds/victory_music.mp3');
  }

  create() {
    console.log("✅ All assets loaded.");

    this.time.delayedCall(100, () => {
      this.scene.start('Menu');
    });
  }
}
