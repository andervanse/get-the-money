var Game = new Phaser.Class({

    items: [ 
        { name: 'clock', points: 5 },
        { name: 'bomb-5', points: -5 },
        { name: 'bomb-10', points: -10 },
        { name: 'one_bill', points: 1 },
        { name: 'five_bill', points: 5 },
        { name: 'ten_bill', points: 10 },
        { name: 'fifty_bill', points: 50 }, 
        { name: 'one_hundred_bill', points: 100 }
    ],
    Extends: Phaser.Scene,
    initialize: function Game() {
        Phaser.Scene.call(this, { key: 'game' });
    },
    gameState: { score: null },
    difficulty: {
        easy: {
            velocity: 300,
            gravity: 200
        },
        normal: {
            velocity: 400,
            gravity: 300,
        },
        hard: {
            velocity: 650,
            gravity: 500
        }
    },
    durationInSeconds: null,
    middleX: null,
    middleY: null,
    create: function() {
        this.durationInSeconds = 15;
        this.gameState.score = 0;
        this.middleX = this.game.config.width/2.0;
        this.middleY = this.game.config.height/2.0;
        this.add.image(this.middleX, this.middleY, 'background');

        this.scene.stop('menu');
        this.gameState.countdown = this.add.text(6, 5, 'Time: ' + this.durationInSeconds, { font: '28px Courier bold', fill: 0x000099 });
        this.gameState.scoreText = this.add.text(140, 5, 'Score: 0', { font: '28px Courier bold', fill: 0x000099 });
        const score = localStorage.getItem('score');

        if (score) {
            this.add.text(6, 45, 'Best score: ' + score, { font: '22px Courier bold', fill: 0x000099 });
        }
        
        this.gameState.ground = this.add.rectangle(0, this.game.config.height, this.game.config.width*2, 10, 0Xfcba03).setAlpha(0.8);
        this.physics.add.existing(this.gameState.ground);
        this.gameState.ground.body.setImmovable(true);
        
        this.gameState.bucket = this.physics.add.sprite(this.middleX, this.game.config.height - 30, 'bucket');
        this.gameState.bucket.setScale(1.2);
        this.gameState.bucket.setCollideWorldBounds(true);

        this.gameState.cursors = this.input.keyboard.createCursorKeys();
        this.gameState.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.gameState.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.gameState.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.gameState.pointer = this.game.input.activePointer;
        this.game.input.mouse.capture = true;
        this.gameState.money = this.physics.add.group();

        this.physics.add.collider(this.gameState.bucket, this.gameState.money, this.onHitItem, null, this);               
        this.physics.add.collider(this.gameState.money, this.gameState.ground, this.onMoneyHitGround, null, this);
        this.physics.add.collider(this.gameState.bucket, this.gameState.ground, null, null, this);

        this.time.addEvent({ 
            delay: 1000, 
            callback: function() { 
                if (this.durationInSeconds > 0) {
                   this.durationInSeconds--; 
                   this.gameState.countdown.setText('Time: ' + this.durationInSeconds);
                }
            }, 
            callbackScope: this, 
            repeat: -1, 
            loop: true
        });  

        this.gameState.timedEvent = this.time.addEvent({ 
            delay: 500, 
            callback: this.onDropItemEvent, 
            callbackScope: this, 
            repeat: 4, 
            loop: true  
        });
    
    }, 

    onDropItemEvent: function() {
        let item = this.items[Phaser.Math.Between(0, this.items.length-1)];
        var droppingItem = this.gameState.money.create(Phaser.Math.Between(30, this.game.config.width - 30), 8, item.name);
        droppingItem.points = item.points;
        droppingItem.name = item.name;
        droppingItem.body.setGravityX(Phaser.Math.Between(-200, 200));
        droppingItem.setInteractive();

        droppingItem.setBounce(0.8);

        if (droppingItem.name.indexOf('bomb') >= 0) {
           droppingItem.setScale(1.6); 
        } else {
           droppingItem.setScale(1.1);
        }

        droppingItem.setCollideWorldBounds(true);        

        if (this.gameState.score <= 400) {
            droppingItem.body.gravity.y = this.difficulty.easy.gravity;
            droppingItem.body.velocity.y = this.difficulty.easy.velocity;
        } else if (this.gameState.score > 400) {
            droppingItem.body.gravity.y = this.difficulty.normal.gravity;
            droppingItem.body.velocity.y = this.difficulty.normal.velocity;
        } else if (this.gameState.score > 700) {
            droppingItem.body.gravity.y = this.difficulty.hard.gravity;
            droppingItem.body.velocity.y = this.difficulty.hard.velocity;
        }
    },

    onHitItem: function(bucket, item) {

        if (item.name === 'clock') {
            this.durationInSeconds += item.points; 
            this.gameState.countdown.setText('Time: ' + this.durationInSeconds);          
        } else if (item.name.indexOf('bomb') >= 0) {
            this.durationInSeconds += item.points; 
            this.gameState.countdown.setText('Time: ' + this.durationInSeconds);          
        } else {
            this.gameState.score += item.points;
            this.gameState.scoreText.setText('Score: ' + this.gameState.score);
        }
        item.destroy();        
    },

    onMoneyHitGround: function(ground, money) {
        money.destroy();        
    },

    update: function() {

        const leftClicked = (this.gameState.pointer.isDown && this.gameState.pointer.x <= this.gameState.bucket.x);
        const rightClicked = (this.gameState.pointer.isDown && this.gameState.pointer.x >= this.gameState.bucket.x);

        if (leftClicked || 
             this.gameState.cursors.left.isDown | this.gameState.keyA.isDown) {
            this.gameState.bucket.rotation = -0.12;
            this.gameState.bucket.x -= 7;
        }

        if (rightClicked || 
             this.gameState.cursors.right.isDown | this.gameState.keyD.isDown) {
            this.gameState.bucket.rotation = 0.12;
            this.gameState.bucket.x += 7;
        }

        if (this.gameState.cursors.left.isUp 
            && this.gameState.cursors.right.isUp
            && this.gameState.keyA.isUp
            && this.gameState.keyD.isUp
            && this.gameState.pointer.isUp) {
            this.gameState.bucket.rotation = 0.00;
        }

        if (Phaser.Input.Keyboard.JustDown(this.gameState.spaceBar)) { 
            console.log('space pause');           
            this.scene.launch('pause');
            this.scene.pause();
        }

        if (this.durationInSeconds <= 0) {

            this.gameState.money.getChildren().forEach(function(m) {
                m.destroy();
            });

            this.physics.pause();
            this.add.text(this.middleX, this.middleY, 'GAME OVER', { font: '46px Courier', fill: 0x000099 })
                    .setOrigin(0.5, 1);

            const score = localStorage.getItem('score');

            if ((score && this.gameState.score > score) || !score) {
                localStorage.setItem('score', this.gameState.score);
            }

            this.time.addEvent({ 
                delay: 800, 
                callback: function() { 
                    this.scene.stop();
                    this.scene.start('start');                    
                }, 
                callbackScope: this, 
                repeat: 0, 
                loop: false
            }); 
        }
    }
});

export default Game;
