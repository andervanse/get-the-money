var Game = new Phaser.Class({

    items: [ 
        { name: 'clock', points: 0 },
        { name: 'one', points: 1 },
        { name: 'five', points: 5 },
        { name: 'ten', points: 10 },
        { name: 'fifty', points: 50 }, 
        { name: 'one_hundred', points: 100 }
    ],
    Extends: Phaser.Scene,
    gameState: { score: 0 },
    initialize: function Game() {
        Phaser.Scene.call(this, { key: 'game' });
    },

    difficulty: {
        easy: {
            velocity: 300,
            gravity: 300
        },
        normal: {
            velocity: 400,
            gravity: 350,
        },
        hard: {
            velocity: 450,
            gravity: 400
        }
    },

    durationInSeconds: 15,

    create: function() {
        this.durationInSeconds = 15;
        this.scene.stop('menu');
        this.gameState.scoreText = this.add.text(10, 30, 'Score: 0', { font: '16px Courier', fill: 0x000099, fontWeight: 'bold' });
        this.gameState.countdown = this.add.text(10, 55, 'Time: ' + this.durationInSeconds, { font: '16px Courier', fill: 0x000099, fontWeight: 'bold' });

        this.gameState.ground = this.physics.add.staticImage(0, this.game.config.height, 'ground');
        this.gameState.ground2 = this.physics.add.staticImage(360, this.game.config.height, 'ground');
        this.gameState.ground3 = this.physics.add.staticImage(600, this.game.config.height, 'ground');
        this.gameState.ground.setImmovable(true);
        this.gameState.ground2.setImmovable(true);
        this.gameState.ground3.setImmovable(true);
        
        this.gameState.bucket = this.physics.add.sprite(this.game.config.width/2, this.game.config.height - 40, 'bucket');
        this.gameState.bucket.setScale(1.2);
        this.gameState.bucket.setCollideWorldBounds(true);

        this.gameState.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.gameState.cursors = this.input.keyboard.createCursorKeys();
        this.gameState.money = this.physics.add.group();

        this.physics.add.collider(this.gameState.bucket, this.gameState.money, this.onHitItem, null, this);               
        this.physics.add.collider(this.gameState.money, this.gameState.ground, this.onMoneyHitGround, null, this);
        this.physics.add.collider(this.gameState.money, this.gameState.ground2, this.onMoneyHitGround, null, this);
        this.physics.add.collider(this.gameState.money, this.gameState.ground3, this.onMoneyHitGround, null, this);

        this.physics.add.collider(this.gameState.bucket, this.gameState.ground, null, null, this);
        this.physics.add.collider(this.gameState.bucket, this.gameState.ground2, null, null, this);
        this.physics.add.collider(this.gameState.bucket, this.gameState.ground3, null, null, this);

        this.time.addEvent({ 
            delay: 1000, 
            callback: function() { 
                if (this.durationInSeconds >= 0) {
                   this.durationInSeconds--; 
                   this.gameState.countdown.setText('Time: ' + this.durationInSeconds);
                }
            }, 
            callbackScope: this, 
            repeat: -1, 
            loop: true
        });  

        this.gameState.timedEvent = this.time.addEvent({ 
            delay: 1000, 
            callback: this.onDropMoneyEvent, 
            callbackScope: this, 
            repeat: 3, 
            loop: true  
        });
    }, 

    onDropMoneyEvent: function() {
        let item = this.items[Phaser.Math.Between(0, this.items.length-1)];
        let itemName = item.name;

        if (itemName !== 'clock') {
            itemName = item.name + '_bill';
        }

        var droppingItem = this.gameState.money.create(Phaser.Math.Between(30, this.game.config.width - 30), 5, itemName );
        droppingItem.points = item.points;
        droppingItem.name = item.name;

        if (this.gameState.score < 400) {
            droppingItem.body.gravity.y = this.difficulty.easy.gravity;
            droppingItem.body.velocity.y = this.difficulty.easy.velocity;
            console.log('gravity:', droppingItem.body.gravity, 'velocity:', droppingItem.body.velocity);
        } else if (this.gameState.score > 400) {
            droppingItem.body.gravity.y = this.difficulty.normal.gravity;
            droppingItem.body.velocity.y = this.difficulty.normal.velocity;
            console.log('gravity:', droppingItem.body.gravity, 'velocity:', droppingItem.body.velocity);
        } else if (this.gameState.score > 1000) {
            droppingItem.body.gravity.y = this.difficulty.hard.gravity;
            droppingItem.body.velocity.y = this.difficulty.hard.velocity;
            console.log('gravity:', droppingItem.body.gravity, 'velocity:', droppingItem.body.velocity);
        }

        droppingItem.setInteractive();
        droppingItem.setBounce(0.5);
        droppingItem.setScale(1.3);
        droppingItem.setCollideWorldBounds(true);
        droppingItem.setVelocity(Phaser.Math.Between(-100, 400), 20);        
    },

    onHitItem: function(bucket, item) {

        if (item.name === 'clock') {
            this.durationInSeconds += 5;  
            this.gameState.countdown.setText('Time: ' + this.durationInSeconds);          
        }

        this.gameState.score += item.points;
        this.gameState.scoreText.setText('Score: ' + this.gameState.score);
        item.destroy();
    },

    onMoneyHitGround: function(money, ground) {
        ground.destroy();
    },

    update: function() {

        if (this.gameState.cursors.left.isDown) {
           this.gameState.bucket.x -= 5;
        }

        if (this.gameState.cursors.right.isDown) {
           this.gameState.bucket.x += 5;
        }

        if (this.durationInSeconds == 0) {

            this.gameState.money.getChildren().forEach(function(m) {
                m.destroy();
            });

            this.physics.pause();            
            this.add.text(this.game.config.width/2, this.game.config.height/2, 'GAME OVER', { font: '42px Courier', fill: 0x000099, fontWeight: 'bold' })
                    .setOrigin(0.5, 1);

            this.time.addEvent({ 
                delay: 1000, 
                callback: function() { 
                    this.scene.start('start');
                    this.scene.stop();             
                }, 
                callbackScope: this, 
                repeat: 0, 
                loop: false
            }); 
        }
    }
});

export default Game;
