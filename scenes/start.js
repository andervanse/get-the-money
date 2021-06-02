var Start = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Start() {
        Phaser.Scene.call(this, { key: 'start' });
    },

    create: function() {
        console.log('start');
        self = this;
        const middleX = this.game.config.width/2.0;
        const middleY = this.game.config.height/2.0;
        this.add.image(middleX, middleY, 'game').setOrigin(0.5, 0.5);        
        this.playButton = this.add.text(middleX, middleY, 'Play', { fontSize: '32px Courier' })
                                  .setOrigin(0.59)
                                  .setStyle({ fill: '#fceebd' });
                                  
        this.playButton.setInteractive();

        this.playButton.on('pointerover', function() {
            self.playButton.setStyle({ fill: '#14ff20' });
        });

        this.playButton.on('pointerout', function() {
            self.playButton.setStyle({ fill: '#fceebd' });
        });

        this.playButton.on('pointerup', function() {
            self.scene.stop();
            self.scene.start('game');
        });        
    }

});

export default Start;
