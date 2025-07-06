class LevelSelector extends Phaser.Scene {
  constructor() {
    super('LevelSelector');
  }

  create() {
    this.cameras.main.setBackgroundColor('#1e1e2f');

    this.add.text(this.scale.width / 2, 120, 'SELECT A LEVEL', {
      fontFamily: 'Arial Black',
      fontSize: '48px',
      color: '#f9ff84',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    const buttonData = [
      { label: '▶ LEVEL 1', sceneKey: 'Level1' },
      { label: '▶ LEVEL 2', sceneKey: 'Level2' },
      { label: '▶ LEVEL 3', sceneKey: 'Level3' }
    ];

    buttonData.forEach((data, index) => {
      const btn = this.add.text(this.scale.width / 2, 240 + index * 80, data.label, {
        fontFamily: 'Arial',
        fontSize: '36px',
        color: '#ffffff',
        backgroundColor: '#ffc107',
        padding: { x: 20, y: 10 },
        align: 'center'
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      
      .on('pointerover', () => {
        btn.setStyle({ backgroundColor: '#ffdb4d', color: '#000000' });
        this.tweens.add({
          targets: btn,
          scale: 1.1,
          duration: 150,
          ease: 'Power1'
        });
      })
      
      .on('pointerout', () => {
        btn.setStyle({ backgroundColor: '#ffc107', color: '#ffffff' });
        this.tweens.add({
          targets: btn,
          scale: 1.0,
          duration: 150,
          ease: 'Power1'
        });
      })
      
      .on('pointerdown', () => {
        this.sound.play('playButton', { volume: 0.4 }); 
        this.time.delayedCall(150, () => {
          this.sound.stopAll();
          this.scene.start(data.sceneKey);
        });
      });
    });

    const backButton = this.add.text(this.scale.width / 2, this.scale.height - 80, '🔙 BACK', {
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
