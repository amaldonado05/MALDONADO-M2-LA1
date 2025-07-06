class Congratulations extends Phaser.Scene {
  constructor() {
    super('Congratulations');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1e1e2f');

    this.sound.stopAll(); 

    this.victoryMusic = this.sound.add('victoryMusic', { loop: true, volume: 0.5 });
    this.victoryMusic.play();

    this.add.text(this.scale.width / 2, 150, 'YOU WON!', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '48px',
      color: '#00ffcc',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(this.scale.width / 2, 250, 'I hope you enjoyed my game! :)', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const backButton = this.add.text(this.scale.width / 2, 340, 'Back To Menu', {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#28a745',
      padding: { x: 20, y: 10 },
      align: 'center',
      fixedWidth: 280
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      this.sound.play('playButton', { volume: 0.4 });

      if (this.victoryMusic && this.victoryMusic.isPlaying) {
        this.victoryMusic.stop();
      }

      this.scene.start('Menu');
    })
    .on('pointerover', () => {
      backButton.setStyle({ backgroundColor: '#34d058', color: '#000000' });
      this.tweens.add({ targets: backButton, scale: 1.1, duration: 150 });
    })
    .on('pointerout', () => {
      backButton.setStyle({ backgroundColor: '#28a745', color: '#ffffff' });
      this.tweens.add({ targets: backButton, scale: 1.0, duration: 150 });
    });

    this.add.text(this.scale.width - 10, this.scale.height - 10, 'Made by Alvaro Maldonado Zavala', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '14px',
      color: '#ffffff'
    })
    .setOrigin(1, 1)
    .setScrollFactor(0)
    .setDepth(9999);
  }
}
