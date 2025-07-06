class Level2 extends Phaser.Scene {
  constructor() {
    super('Level2');
  }

  create() {
    console.log('🕹️ Level2 started');

    this.levelMusic = this.sound.add('lvl1Music', { loop: true, volume: 0.5 });
    this.levelMusic.play();

    const map = this.make.tilemap({ key: 'map2' });
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

    this.player = this.physics.add.sprite(10, 109, 'characterTiles', 0)
      .setScale(1.2)
      .setCollideWorldBounds(true);
    this.physics.add.collider(this.player, layers.Main);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.monster = this.physics.add.sprite(466, 336, 'characterTiles', 101)
      .setScale(1)
      .setCollideWorldBounds(true);
    this.physics.add.collider(this.monster, layers.Main);
    this.physics.add.collider(this.player, this.monster, this.handleMonsterCollision, null, this);

    this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('characterTiles', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'walk-left', frames: this.anims.generateFrameNumbers('characterTiles', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'monster-walk-right', frames: this.anims.generateFrameNumbers('characterTiles', { start: 96, end: 99 }), frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'monster-walk-left', frames: this.anims.generateFrameNumbers('characterTiles', { start: 101, end: 105 }), frameRate: 6, repeat: -1 });

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
    const coinPositions = [[180, 310], [434, 310], [401, 310], [369, 310], [592, 310], [80, 310]];
    coinPositions.forEach(([x, y]) => {
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
    this.addClimbZone(48, 270, 32, 300);
    this.addClimbZone(208, 368, 32, 300);
    this.addClimbZone(271, 330, 32, 230);
  }

  update() {
    const speed = 150;
    const climbSpeed = 100;
    const monsterSpeed = 60;
    const isTouchingLadder = this.physics.overlap(this.player, this.climbZones);

    const distance = Phaser.Math.Distance.Between(this.monster.x, this.monster.y, this.player.x, this.player.y);
    if (distance < 250) {
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

    if (isTouchingLadder) {
      if (this.WKey.isDown) {
        this.player.body.allowGravity = false;
        this.player.setVelocityY(-climbSpeed);
      } 
      else if (this.SKey.isDown) {
        this.player.body.allowGravity = false;
        this.player.setVelocityY(climbSpeed);
      }
      else {
        if (!this.WKey.isDown && this.player.body.velocity.y <= 0) {
          this.player.setVelocityY(0);
          this.player.body.allowGravity = false;
        }
      }
    } 
    else {
      this.player.body.allowGravity = true;
    }

    if (this.WKey.isDown && this.player.body.onFloor() && !this.jumpCooldown) {
      this.player.setVelocityY(-250);
      this.sound.play('jumpSfx', { volume: 0.3 });
      this.jumpCooldown = true;
      this.time.delayedCall(500, () => this.jumpCooldown = false);
    }
  }

  handleMonsterCollision(player, monster) {
    if (this.playerIsInvincible) return;
    this.takeDamage();
  }

  takeDamage() {
    this.playerHealth--;
    this.updateHeartsUI();
    this.playerIsInvincible = true;
    this.player.setTint(0xff0000);
    this.sound.play('hurtSfx', { volume: 0.3 });

    this.time.delayedCall(1000, () => {
      this.playerIsInvincible = false;
      this.player.clearTint();
    });

    if (this.playerHealth <= 0) {
      this.gameOver();
    }
  }

  updateHeartsUI() {
    this.fullHearts.forEach((heart, index) => {
      heart.setVisible(index < this.playerHealth);
    });
    this.emptyHearts.forEach((heart, index) => {
      heart.setVisible(index >= this.playerHealth);
    });
  }

  setupHeartsUI() {
    this.fullHearts = [];
    this.emptyHearts = [];
    const baseX = 375; 
    const baseY = 230;
    const heartSpacing = 25;

    for (let i = 0; i < this.maxHealth; i++) {
      const fullHeart = this.add.image(baseX + i * heartSpacing, baseY, 'heart')
        .setScrollFactor(0)
        .setScale(0.1)
        .setDepth(9999);

      const emptyHeart = this.add.image(baseX + i * heartSpacing, baseY, 'emptyHeart')
        .setScrollFactor(0)
        .setScale(0.1)
        .setDepth(9998);

      this.fullHearts.push(fullHeart);
      this.emptyHearts.push(emptyHeart);
    }

    this.coinText = this.add.text(365, 260, 'Coins: 0', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '12px',
      fill: '#dce800'
    }).setScrollFactor(0).setDepth(9999);

    this.levelText = this.add.text(365, 245, 'Level 2', {
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
      this.time.delayedCall(300, () => {
        this.levelMusic.stop();
        this.scene.start('Level3');
      });
    }
  }

  addClimbZone(x, y, width, height) {
    const zone = this.add.zone(x, y, width, height);
    this.physics.add.existing(zone, true);
    this.climbZones.add(zone);
  }

  gameOver() {
    this.player.setTint(0x000000);
    this.player.anims.stop();
    this.physics.pause();
    if (this.levelMusic) this.levelMusic.stop();
    this.scene.start('GameOver', { fromLevel: 'Level2' });
  }

}