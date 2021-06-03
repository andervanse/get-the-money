var Start = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Start() {
        Phaser.Scene.call(this, { key: 'start' });
    },

    enter: null,
    create: function() {        
        self = this;
        
        const middleX = this.game.config.width/2.0;
        const middleY = this.game.config.height/2.0;
        this.add.image(middleX, middleY, 'background');        
        this.add.image(middleX, middleY, 'game').setOrigin(0.5, 0.5);        
        const font = { font: '46px Courier bold', color: '#fceebd' };

        const score = localStorage.getItem('score');
        if (score) {
           this.add.text(20, 20, 'Best Score: ' + score, { font: '32px Courier bold', color: '#000' })
                                     .setOrigin(0, 0);
        }

        this.playButton = this.add.text(middleX, middleY, 'Play', font)
                                  .setOrigin(0.59);
                                  
        this.playButton.setInteractive();

        this.playButton.on('pointerover', function() {
            self.playButton.setFill('#f2ff03');
        });

        this.playButton.on('pointerout', function() {
            self.playButton.setFill('#fceebd');
        });

        this.playButton.on('pointerup', function() {
            self.scene.stop();
            self.scene.start('game');
        });        

        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    },

    update: function() {
        if (Phaser.Input.Keyboard.JustDown(this.enter)) { 
            self.scene.stop();
            self.scene.start('game');
        }        
    }
});


export default Start;
