class Level1 extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  create() {
    console.log('🕹️ Level1 started');

    this.levelMusic = this.sound.add('lvl1Music', { loop: true, volume: 0.5 });
    this.levelMusic.play();

    const map = this.make.tilemap({ key: 'map' });
    const ambienceTiles = map.addTilesetImage('AMBIENCE', 'mapTiles');
    const characterTiles = map.addTilesetImage('Characters', 'characterTiles');
    const sunTiles = map.addTilesetImage('sun', 'sunTiles');
    const allTiles = [ambienceTiles, characterTiles, sunTiles];

    const layers = {
      Main: map.createLayer('Main', allTiles, 0, 0),
      Signs: map.createLayer('Signs', allTiles, 0, 0),
      Coins: map.createLayer('Coins', allTiles, 0, 0),
      Ladders: map.createLayer('Ladders', allTiles, 0, 0)
    };

    for (const key in layers) {
      if (layers[key]) layers[key].setCollisionByProperty({ collides: true });
    }

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.setZoom(2.5); 

    this.player = this.physics.add.sprite(50, 333, 'characterTiles', 0)
      .setScale(1.2)
      .setCollideWorldBounds(true);
    this.physics.add.collider(this.player, layers.Main);

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.monster = this.physics.add.sprite(595, 274, 'characterTiles', 101)
      .setScale(1)
      .setCollideWorldBounds(true);
    this.physics.add.collider(this.monster, layers.Main);
    this.physics.add.collider(this.player, this.monster, this.handleMonsterCollision, null, this);

    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('characterTiles', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('characterTiles', { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'monster-walk-right',
      frames: this.anims.generateFrameNumbers('characterTiles', { start: 96, end: 99 }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: 'monster-walk-left',
      frames: this.anims.generateFrameNumbers('characterTiles', { start: 101, end: 105 }),
      frameRate: 6,
      repeat: -1
    });

    this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    this.jumpCooldown = false;
    this.playerHealth = 3;
    this.maxHealth = 3;
    this.playerIsInvincible = false;
    this.coinsCollected = 0;

    this.setupHeartsUI();

    this.coins = this.physics.add.staticGroup();
    [ [200, 310], [497, 275], [529, 275], [529, 87], [592, 87], [55, 150] ].forEach(([x, y]) => {
      this.coins.create(x, y, 'token').setOrigin(0.5).setScale(2.5).refreshBody();
    });
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

    this.exitButton = this.add.text(this.scale.width - 365, 220, '✖ EXIT', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#ff0000',
      padding: { x: 10, y: 6 }
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(9999).setInteractive({ useHandCursor: true });

    this.exitButton.on('pointerover', () => this.exitButton.setStyle({ backgroundColor: '#ff9999' }));
    this.exitButton.on('pointerout', () => this.exitButton.setStyle({ backgroundColor: '#ff4d4d' }));
    this.exitButton.on('pointerdown', () => {
      this.sound.play('playButton', { volume: 0.5 });
      this.time.delayedCall(200, () => {
        this.sound.stopAll();
        this.scene.start('Menu');
      });
    });

    this.climbZones = this.physics.add.staticGroup();
    this.addClimbZone(144, 343, 32, 300);
    this.addClimbZone(240, 277, 32, 300);
  }

  update() {
    if (!this.player || !this.monster) return;

    const speed = 120;
    const climbSpeed = 100;
    const jumpSpeed = -250;
    const onGround = this.player.body.blocked.down;
    let isClimbing = false;

    this.physics.overlap(this.player, this.climbZones, () => isClimbing = true);

    if (isClimbing && (this.SKey.isDown || this.WKey.isDown)) {
      this.player.body.allowGravity = false;
      this.player.setVelocityY(this.WKey.isDown ? -climbSpeed : climbSpeed);
    } else {
      this.player.body.allowGravity = true;
      if (this.WKey.isDown && onGround && !this.jumpCooldown) {
        this.player.setVelocityY(jumpSpeed);
        this.sound.play('jumpSfx', { volume: 0.3 });
        this.jumpCooldown = true;
      }
      if (!this.WKey.isDown && onGround) this.jumpCooldown = false;
    }

    if (this.AKey.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play('walk-left', true);
    } else if (this.DKey.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play('walk-right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.stop();
    }

    const distance = Phaser.Math.Distance.Between(this.monster.x, this.monster.y, this.player.x, this.player.y);
    const monsterSpeed = 60;
    if (distance < 300) {
      if (Math.abs(this.monster.x - this.player.x) > 5) {
        if (this.player.x < this.monster.x) {
          this.monster.setVelocityX(-monsterSpeed);
          this.monster.anims.play('monster-walk-left', true);
        } else {
          this.monster.setVelocityX(monsterSpeed);
          this.monster.anims.play('monster-walk-right', true);
        }
      } else {
        this.monster.setVelocityX(0);
        this.monster.anims.stop();
      }
    } else {
      this.monster.setVelocityX(0);
      this.monster.anims.stop();
    }
  }

  addClimbZone(x, y, width, height) {
    const zone = this.add.zone(x, y, width, height);
    this.physics.add.existing(zone, true);
    this.climbZones.add(zone);
  }

  setupHeartsUI() {
    this.hearts = [];
    const baseX = 375, baseY = 230, heartSpacing = 25;

    for (let i = 0; i < this.maxHealth; i++) {
      const heart = this.add.image(baseX + i * heartSpacing, baseY, 'heart')
        .setScrollFactor(0)
        .setScale(0.1)
        .setDepth(9999);
      this.hearts.push(heart);
    }

    this.coinText = this.add.text(365, 260, 'Coins: 0', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '12px',
      fill: '#dce800'
    }).setScrollFactor(0).setDepth(9999);

    this.levelText = this.add.text(365, 245, 'Level 1', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '12px',
      fill: '#dce800'
    }).setScrollFactor(0).setDepth(9999);
  }

  collectCoin(player, coin) {
    coin.destroy();
    this.coinsCollected++;
    this.coinText.setText(`Coins: ${this.coinsCollected}`);
    this.sound.play('coinSfx', { volume: 0.2 });

    if (this.coinsCollected >= 6) {
      if (this.levelMusic) this.levelMusic.stop();
      this.sound.play('playButton', { volume: 0.5 });
      this.time.delayedCall(500, () => this.scene.start('Level2'));
    }
  }

  handleMonsterCollision(player, monster) {
    if (this.playerIsInvincible) return;
    this.takeDamage(1);
    const knockback = player.x < monster.x ? -1 : 1;
    player.setVelocityX(knockback * 250);
    player.setVelocityY(-150);
    this.triggerInvincibility(player);
  }

  takeDamage(amount) {
    this.playerHealth -= amount;
    this.updateHearts();
    this.sound.play('hurtSfx', { volume: 0.3 });
    if (this.playerHealth <= 0) this.gameOver();
  }

  updateHearts() {
    this.hearts.forEach((heart, index) => {
      heart.setTexture(index < this.playerHealth ? 'heart' : 'emptyHeart');
    });
  }

  triggerInvincibility(target) {
    this.playerIsInvincible = true;
    target.setTint(0xff0000);

    this.tweens.add({
      targets: target,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        target.clearTint();
        target.setAlpha(1);
        this.playerIsInvincible = false;
      }
    });
  }

  gameOver() {
  this.player.setTint(0x000000);
  this.player.anims.stop();
  this.physics.pause();
  if (this.levelMusic) this.levelMusic.stop();
  this.scene.start('GameOver', { fromLevel: 'Level1' });
  }
}
