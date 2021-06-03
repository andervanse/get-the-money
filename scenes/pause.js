var Pause = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function Start() {
        Phaser.Scene.call(this, { key: 'pause' });
    },

    gameState: {},
    create: function() {        
        self = this;
        const middleX = this.game.config.width/2.0;
        const middleY = this.game.config.height/2.0;
        const font = { font: '46px Courier bold', color: '#000' };
        this.playButton = this.add.text(middleX, middleY, 'Pause', font).setOrigin(0.5);
        this.playButton.setInteractive();

        this.playButton.on('pointerup', function() {
            self.scene.resume('game');
            self.scene.stop();
        });        

        this.gameState.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    },

    update: function() {
        if (Phaser.Input.Keyboard.JustDown(this.gameState.spaceBar)) { 
            this.scene.resume('game');
            self.scene.stop();
        }
    }
});

export default Pause;
