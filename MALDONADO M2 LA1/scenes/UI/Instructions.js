class Instructions extends Phaser.Scene {
  constructor() {
    super('Instructions');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1e1e2f');

    const title = this.add.text(this.scale.width / 2, 100, '📘 INSTRUCTIONS', {
      fontFamily: 'Arial Black',
      fontSize: '48px',
      color: '#f9ff84',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    const instructions = this.add.text(this.scale.width / 2, 250,
      'You are a coin-crazy explorer!\n\nEvade monsters and collect all coins in each level to move on to the next one!',
      {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: 600, useAdvancedWrap: true }
      }
    ).setOrigin(0.5);

    const backButton = this.add.text(this.scale.width / 2, 400, '🔙 BACK', {
      fontFamily: 'Arial',
      fontSize: '36px',
      color: '#ffffff',
      backgroundColor: '#ffc107',
      padding: { x: 20, y: 10 },
      align: 'center'
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      this.sound.play('playButton', { volume: 0.4 });
      this.scene.start('Menu');
    })
    .on('pointerover', () => {
      backButton.setStyle({ backgroundColor: '#ffdb4d', color: '#000000' });
      this.tweens.add({ targets: backButton, scale: 1.1, duration: 150, ease: 'Power1' });
    })
    .on('pointerout', () => {
      backButton.setStyle({ backgroundColor: '#ffc107', color: '#ffffff' });
      this.tweens.add({ targets: backButton, scale: 1.0, duration: 150, ease: 'Power1' });
    });
  }
}
