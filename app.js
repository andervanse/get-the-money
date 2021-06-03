import Preloader from './scenes/preloader.js';
import Start from './scenes/start.js';
import Game from './scenes/game.js';
import Pause from './scenes/pause.js';


if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js');
    });
}

//var width = window.innerWidth * window.devicePixelRatio -40;
//var height = window.innerHeight * window.devicePixelRatio -40;

 var width = window.innerWidth;
 var height = window.innerHeight;

 if (width > 800) {
     width = 800;
 }

 if (height > 600) {
    height = 600;
 }

var config = {
    type: Phaser.AUTO,
    parent: 'div-game',
    backgroundColor: 0xfceebd,
    width: width,
    height: height,
    debug: true,
    physics: {
        default: 'arcade',
        arcade: {
            enableBody: true,
            //debug: true
        }
    },
    scene: [
        Preloader,
        Start,        
        Game,
        Pause
    ]
};


var game = new Phaser.Game(config);

