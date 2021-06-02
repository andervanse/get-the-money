import Preloader from './scenes/preloader.js';
import Start from './scenes/start.js';
import Game from './scenes/game.js';

var config = {
    type: Phaser.AUTO,
    parent: 'div-game',
    backgroundColor: 0xfceebd,
    width: 800,
    height: 600,
    debug: true,
    physics: {
        default: 'arcade',
        arcade: {
            //gravity: { y: 700 },
            enableBody: true
        }
    },
    scene: [
        Preloader,
        Start,
        Game
    ]
};

var game = new Phaser.Game(config);

