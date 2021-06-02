var Preloader = new Phaser.Class({

    Extends: Phaser.Scene,
    initialize: function Preloader() {
        Phaser.Scene.call(this, { key: 'preloader', active: true });        
    },

    preload: function() {
        this.load.image('buttonBG', './assets/button-ok.png');
        this.load.image('game', './assets/game.png');
        this.load.image('bucket', './assets/bucket.png');
        this.load.image('clock', './assets/clock.png');
        this.load.image('money', './assets/money.png');
        this.load.image('one_bill', './assets/1_bill.png');
        this.load.image('five_bill', './assets/5_bill.png');
        this.load.image('ten_bill', './assets/10_bill.png');
        this.load.image('fifty_bill', './assets/50_bill.png');
        this.load.image('one_hundred_bill', './assets/100_bill.png');

        this.load.image('ground', './assets/ground.png');
    },

    create: function() {
        this.scene.start('start');
    }

});

export default  Preloader;