// Useful vars
let width, height, mContext, enabelColition = true, enabelSoundColition = true, minVelocity = 1200;

let ball, pad1, pad2, limits = [], fullScreen, colitionSound = ['disk-1', 'disk-2'], goalRedAnim, goalBlueAnim, ballResetAnim, scoreTextBlue, scoreTextRed, goalSound, backgroundMusic;

export class Game extends Phaser.Scene {
    constructor ()
    {
        super('Game');
    }

    create (){
        mContext = this;
        this._init();
        this.physics.world.setFPS(120);

        /* FULLSCREEN */
        fullScreen.setInteractive().on('pointerdown', function() {
            if (mContext.scale.isFullscreen) {
                mContext.scale.stopFullscreen();
                fullScreen.setTexture('fullScreen-on');
                // On full screen off
            } else {
                mContext.scale.startFullscreen();
                fullScreen.setTexture('fullScreen-off');
                // On start fulll screen
            }
        });

        // Drag pads
        this.input.setDraggable([pad1, pad2]);
        this.input.on('drag', (pointer, obj, dragX, dragY) => {
            if(obj.name === "Pad1" && dragY > height/2){
                obj.setPosition(dragX, dragY);
            }else if(obj.name === "Pad2" && dragY < ((this.game.config.height)/2)){
                obj.setPosition(dragX, dragY);
            }
        });

        // Ball rotation
        this.physics.world.on('worldstep', () => {
            ball.setAngularVelocity(
                Phaser.Math.RadToDeg(ball.body.velocity.x / ball.body.halfWidth)
            );
        });

        this.physics.add.collider(ball, pad1, newCollision);
        this.physics.add.collider(ball, pad2, newCollision);
        this.physics.add.collider(ball, limits, goal);

        function goal (ball, limit){
            goalSound.play();
            ballResetAnim.setAlpha(1);
            ballResetAnim.anims.play('disk-reset', true);

            ball.setPosition((width/2), (height/2));
            ball.body.enable = false;
            mContext.cameras.main.shake(100);

            if (limit.name === 'Player1'){
                goalRedAnim.setAlpha(1);
                goalRedAnim.anims.play('red-goal', true);
                goalRedAnim.on('animationcomplete', () => {
                    goalRedAnim.setAlpha(0);
                });

                pad1.score++;
                if (pad1.score > 9){mContext.scene.restart();}
                scoreTextBlue.setText(pad1.score);
            }else if (limit.name === 'Player2'){
                goalBlueAnim.setAlpha(1);
                goalBlueAnim.anims.play('blue-goal', true);
                goalBlueAnim.on('animationcomplete', () => {
                    goalBlueAnim.setAlpha(0);
                });

                pad2.score++;
                if (pad2.score > 9){mContext.scene.restart();}
                scoreTextRed.setText(pad2.score);
            }

            ballResetAnim.on('animationcomplete', () => {
                ball.body.enable = true;
                ball.setVelocity(mContext.getRandomInt(-minVelocity, minVelocity))
                ballResetAnim.setAlpha(0);
            });
        }

        function newCollision (ball, pad){
            /* ANIMATION */
            let collide = mContext.physics.add.sprite(ball.x, ball.y, 'collide', 0).setScale(.5);
            collide.anims.play('collide');
            collide.on('animationcomplete', () => {
                collide.destroy();
            });

            /* COLITION HANDLER */
            if (enabelColition){
                enabelColition = !enabelColition;
                let diff = 0;
                if (ball.x < pad.x){
                    // Si la pelota está en la parte izquierda del sprite
                    diff = pad.x - ball.x;
                    ball.setVelocityX(-10 * diff);
                }
                else if (ball.x > pad.x){
                    // Si la pelota está en la parte derecha del sprite
                    diff = ball.x -pad.x;
                    ball.setVelocityX(10 * diff);
                }
                else{
                    // La pelota golpea el centro del sprite
                    ball.setVelocity(50 + Math.random() * 8);
                }
                setTimeout(() => enabelColition = !enabelColition, 500);
            } 

            /* SOUND EFFECTS */
            if (enabelSoundColition){
                enabelSoundColition = !enabelSoundColition;

                let sound = mContext.sound.add(colitionSound[mContext.getRandomInt(0, 2)]);
                setTimeout(() => {
                    enabelSoundColition = !enabelSoundColition;
                    sound.play();
                }, 50);
            }
        }
    } 

    update(){
        if ((ball.body.velocity.y > 0) && ball.body.velocity.y < minVelocity){
            ball.setVelocityY(minVelocity);
        }else if ((ball.body.velocity.y < 0) && (ball.body.velocity.y * -1) < minVelocity){
            ball.setVelocity(-minVelocity);
        }
    }

    _init(){
        width = this.game.config.width;
        height = this.game.config.height;
        this.add.image(width/2, height/2, 'back').setScale(1, 1.02);

        fullScreen = this.add.image(50, 50, 'fullScreen-on').setScale(.6); 

        ball = this.physics.add.sprite((width/2), (height/2), 'ball')
                .setScale(.70)
                .setName("Ball")
                .setVelocity(this.getRandomInt(-minVelocity, minVelocity))
                .setCollideWorldBounds(true)
                .setCircle(76)
                .setBounce(1);

        pad1 = this.physics.add.sprite((width/2), ((height) - 100), 'blue-pad')
                .setScale(.8)
                .setName("Pad1")
                .setCircle(93.5)
                .setImmovable(true)
                .setInteractive()
                .setCollideWorldBounds(true);
        pad1.score = 0;

        pad2 = this.physics.add.sprite((width/2), 100, 'red-pad').
                setScale(.8)
                .setName("Pad2")
                .setCircle(93.5)
                .setImmovable(true)
                .setInteractive()
                .setCollideWorldBounds(true);
        pad2.score = 0;

        limits.push(this.add.rectangle((width/2), 0, (width/5), 10, 0x6666ff).setName("Player1"));
        limits.push(this.add.rectangle((width/2), height, (width/5), 10, 0x6666ff).setName("Player2"));

        limits.forEach(limit => {
            limit.score = 0;
            this.physics.add.existing(limit, true);
            limit.setAlpha(0);
        });

        scoreTextRed = this.add.text((width - 100), (height/2) - 120, pad2.score, { font: '64px neon' });
        scoreTextRed.setTint(0xff0000);

        scoreTextBlue = this.add.text((width - 100), (height/2) + 60, pad1.score, { font: '64px neon' });
        scoreTextBlue.setTint(0x4deeea);

        /* ANIMS */
        this.anims.create({
            key: 'disk-reset',
            frames: this.anims.generateFrameNumbers('disk-reset', { start: 0, end: 35 }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: 'collide',
            frames: this.anims.generateFrameNumbers('collide', { start: 0, end: 15 }),
            frameRate: 60,
            repeat: 0
        });

        this.anims.create({
            key: 'red-goal',
            frames: this.anims.generateFrameNumbers('red-goal', { start: 0, end: 15 }),
            frameRate: 60,
            repeat: 0
        });

        this.anims.create({
            key: 'blue-goal',
            frames: this.anims.generateFrameNumbers('blue-goal', { start: 0, end: 15 }),
            frameRate: 60,
            repeat: 0
        });

        goalRedAnim = this.add.sprite((width/2), 150, 'red-goal', 0).setAlpha(0);
        goalBlueAnim = this.add.sprite((width/2), (height - 150), 'blue-goal', 0).setAlpha(0);
        ballResetAnim = this.physics.add.sprite((width/2), (height/2), 'disk-reset', 0).setScale(.3).setAlpha(0);

        goalSound = this.sound.add('goal');
        goalSound.setVolume(0.2);

        backgroundMusic = this.sound.add('background-music');
        backgroundMusic.setVolume(.4);
        backgroundMusic.play();
    }

    getRandomInt(min = 0, max){
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
