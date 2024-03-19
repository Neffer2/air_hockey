import { Boot } from './scenes/boot.js';
import { Preloader } from './scenes/preloader.js';
import { Game } from './scenes/game.js';
import { GameOver } from './scenes/gameOver.js';

const config = {
    type: Phaser.AUTO,
    width: 720,
    height: 1080,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT
    },
    scene: [
        Boot,
        Preloader,
        Game,
        GameOver
    ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    input :{
		activePointers: 3,
    }
};

export const game = new Phaser.Game(config);
