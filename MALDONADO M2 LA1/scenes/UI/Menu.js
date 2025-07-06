class Menu extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1e1e2f');

    let existingMusic = this.sound.get('menuMusic');
    if (existingMusic) {
      if (!existingMusic.isPlaying) existingMusic.play();
    } else {
      this.menuMusic = this.sound.add('menuMusic', { loop: true, volume: 0.5 });
      this.menuMusic.play();
    }

    const title = this.add.text(this.scale.width / 2, 150, '✨ COIN CRAZE ✨', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '64px',
      color: '#f9ff84',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    const playText = this.add.text(this.scale.width / 2, 300, '▶ PLAY', {
      fontFamily: 'Arial',
      fontSize: '40px',
      color: '#ffffff',
      backgroundColor: '#ffc107',
      padding: { x: 20, y: 10 },
      align: 'center',
      fixedWidth: 280 
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      this.sound.play('playButton', { volume: 0.4 });
      this.scene.start('LevelSelector');
    })
    .on('pointerover', () => {
      playText.setStyle({ backgroundColor: '#ffdb4d', color: '#000000' });
      this.tweens.add({ targets: playText, scale: 1.1, duration: 150, ease: 'Power1' });
    })
    .on('pointerout', () => {
      playText.setStyle({ backgroundColor: '#ffc107', color: '#ffffff' });
      this.tweens.add({ targets: playText, scale: 1.0, duration: 150, ease: 'Power1' });
    });

    const guideText = this.add.text(this.scale.width / 2, 380, '📘 GUIDE', {
      fontFamily: 'Arial',
      fontSize: '40px',
      color: '#ffffff',
      backgroundColor: '#ffc107',
      padding: { x: 20, y: 10 },
      align: 'center',
      fixedWidth: 280 
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      this.sound.play('playButton', { volume: 0.4 });
      this.scene.start('Instructions');
    })
    .on('pointerover', () => {
      guideText.setStyle({ backgroundColor: '#ffdb4d', color: '#000000' });
      this.tweens.add({ targets: guideText, scale: 1.1, duration: 150, ease: 'Power1' });
    })
    .on('pointerout', () => {
      guideText.setStyle({ backgroundColor: '#ffc107', color: '#ffffff' });
      this.tweens.add({ targets: guideText, scale: 1.0, duration: 150, ease: 'Power1' });
    });

    const creditText = this.add.text(this.scale.width - 10, this.scale.height - 10, 'Made by Alvaro Maldonado Zavala', {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '14px',
    color: '#ffffff'
    })
    .setOrigin(1, 1) 
    .setScrollFactor(0)
    .setDepth(9999);
  }
}
