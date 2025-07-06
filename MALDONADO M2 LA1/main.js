const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 720,
  pixelArt: true,
  parent: 'game-container', 
  scale: {
    mode: Phaser.Scale.FIT, 
    autoCenter: Phaser.Scale.CENTER_BOTH 
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: [Preload, Menu, Instructions, LevelSelector, Level1, Level2, Level3, Congratulations, GameOver]
};

const game = new Phaser.Game(config);
