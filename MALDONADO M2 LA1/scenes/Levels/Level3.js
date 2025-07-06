class Level3 extends Phaser.Scene {
  constructor() {
    super('Level3');
  }

  create() {
    console.log('🕹️ Level3 started');

    this.levelMusic = this.sound.add('lvl1Music', { loop: true, volume: 0.5 });
    this.levelMusic.play();

    const map = this.make.tilemap({ key: 'map3' });
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

    this.player = this.physics.add.sprite(10, 343, 'characterTiles', 0)
      .setScale(1.2)
      .setCollideWorldBounds(true);
    this.physics.add.collider(this.player, layers.Main);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.monsters = [];
    const monsterPositions = [
      [590, 280],
      [497, 150],
      [600, 50]
    ];

    monsterPositions.forEach(([x, y]) => {
      const monster = this.physics.add.sprite(x, y, 'characterTiles', 101)
        .setScale(1)
        .setCollideWorldBounds(true);
      this.physics.add.collider(monster, layers.Main);
      this.physics.add.collider(this.player, monster, this.handleMonsterCollision, null, this);
      this.monsters.push(monster);
    });

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
    const coinPositions = [[100, 310], [274, 278], [98, 149], [435, 244], [498, 244], [560, 20]];
    coinPositions.forEach(([x, y]) => {
      const coin = this.coins.create(x, y, 'token')
        .setOrigin(0.5)
        .setScale(2.5);
      coin.body.setSize(12, 12);
      coin.body.setOffset(10, 10);
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
    this.addClimbZone(272, 105, 32, 105);
    this.addClimbZone(176, 328, 32, 280);
    this.addClimbZone(400, 298, 32, 300);
    this.addClimbZone(528, 298, 32, 300);
  }

  update() {
    const speed = 150;
    const climbSpeed = 100;
    const monsterSpeed = 60;
    const isTouchingLadder = this.physics.overlap(this.player, this.climbZones);

    this.monsters.forEach(monster => {
      const distance = Phaser.Math.Distance.Between(monster.x, monster.y, this.player.x, this.player.y);
      if (distance < 150) {
        if (Math.abs(monster.x - this.player.x) > 5) {
          if (this.player.x < monster.x) {
            monster.setVelocityX(-monsterSpeed);
            monster.anims.play('monster-walk-left', true);
          } else {
            monster.setVelocityX(monsterSpeed);
            monster.anims.play('monster-walk-right', true);
          }
        } else {
          monster.setVelocityX(0);
          monster.anims.stop();
        }
      } else {
        monster.setVelocityX(0);
        monster.anims.stop();
      }
    });

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

    if (isTouchingLadder && (this.WKey.isDown || this.SKey.isDown)) {
        this.player.body.allowGravity = false;

    if (this.WKey.isDown) {
        this.player.setVelocityY(-climbSpeed);
    } else if (this.SKey.isDown) {
        this.player.setVelocityY(climbSpeed);
    } else {
        this.player.setVelocityY(0);
    }
    } else {
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

    this.levelText = this.add.text(365, 245, 'Level 3', {
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
        this.scene.start('Congratulations');
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
    this.scene.start('GameOver', { fromLevel: 'Level3' });
    }
}