class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  init(data) {
    this.fromLevel = data.fromLevel || 'Level1'; 
  }

  create() {
    this.cameras.main.setBackgroundColor('#2b1b1b');

    const title = this.add.text(this.scale.width / 2, 150, '☠ GAME OVER ☠', {
      fontFamily: 'Arial Black',
      fontSize: '64px',
      color: '#ff4c4c',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    const retryBtn = this.add.text(this.scale.width / 2, 300, '↻ RETRY LEVEL', {
      fontFamily: 'Arial',
      fontSize: '36px',
      color: '#ffffff',
      backgroundColor: '#28a745',
      padding: { x: 20, y: 10 }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.sound.play('playButton', { volume: 0.4 });
        this.time.delayedCall(150, () => {
          this.scene.start(this.fromLevel); 
        });
      })
      .on('pointerover', () => {
        retryBtn.setStyle({ backgroundColor: '#3ed265', color: '#000000' });
        this.tweens.add({ targets: retryBtn, scale: 1.1, duration: 150 });
      })
      .on('pointerout', () => {
        retryBtn.setStyle({ backgroundColor: '#28a745', color: '#ffffff' });
        this.tweens.add({ targets: retryBtn, scale: 1.0, duration: 150 });
      });

    const menuBtn = this.add.text(this.scale.width / 2, 380, '🏠 MAIN MENU', {
      fontFamily: 'Arial',
      fontSize: '36px',
      color: '#ffffff',
      backgroundColor: '#007bff',
      padding: { x: 20, y: 10 }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.sound.play('playButton', { volume: 0.4 });
        this.time.delayedCall(150, () => {
          this.scene.start('Menu');
        });
      })
      .on('pointerover', () => {
        menuBtn.setStyle({ backgroundColor: '#339dff', color: '#000000' });
        this.tweens.add({ targets: menuBtn, scale: 1.1, duration: 150 });
      })
      .on('pointerout', () => {
        menuBtn.setStyle({ backgroundColor: '#007bff', color: '#ffffff' });
        this.tweens.add({ targets: menuBtn, scale: 1.0, duration: 150 });
      });
  }
}
