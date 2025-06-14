export class Preloader extends Phaser.Scene {
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        // //  We loaded this image in our Boot Scene, so we can display it here
        // this.add.image(512, 384, 'background');

        // //  A simple progress bar. This is the outline of the bar.
        // this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        // //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        // const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        // //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        // this.load.on('progress', (progress) => {

        //     //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
        //     bar.width = 4 + (460 * progress);
        // });
    }

    preload ()
    {
        this.load.setPath('public/assets');
        this.load.image('ball', 'ball.png');
        this.load.image('fullScreen-on', 'fullscreen-on.png');
        this.load.image('fullScreen-off', 'fullscreen-off.png');
        this.load.image('blue-pad', 'blue-pad.png');
        this.load.image('red-pad', 'red-pad.png');
        this.load.image('back', 'fondo.png');    
        this.load.audio('disk-1', 'sounds/disk_1.wav');
        this.load.audio('disk-2', 'sounds/disk_2.wav');
        this.load.audio('goal', 'sounds/goal.wav');
        this.load.audio('background-music', 'sounds/background.mp3');
        this.load.spritesheet('collide', 'CrashSpriteSheet.png', { frameWidth: 625, frameHeight: 468.75 });
        this.load.spritesheet('red-goal', 'red-goal-compressedx2.png', { frameWidth: 552.25, frameHeight: 552.25 });
        this.load.spritesheet('blue-goal', 'blue-goal-compressedx2.png', { frameWidth: 552.25, frameHeight: 552.25 });
        this.load.spritesheet('disk-reset', 'disk-reset.png', { frameWidth: 406.25, frameHeight: 406.33 });
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Game');
    }
}
