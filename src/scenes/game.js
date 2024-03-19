// Useful vars
let width, height, mContext, enabelColition = true, minVelocity = 900;

let ball, pad1, pad2, limits = [];

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
        ball.setInteractive().on('pointerdown', function() {
            if (mContext.scale.isFullscreen) {
                mContext.scale.stopFullscreen();
                // On stop fulll screen
            } else {
                mContext.scale.startFullscreen();
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
            ball.setPosition((width/2), (height/2));
            ball.body.enable = false;
            limit.score += 1;
            mContext.cameras.main.shake(100);
            console.log(limit.name+" score: "+limit.score)

            setTimeout(() => {
                ball.body.enable = true;
                ball.setVelocity(mContext.getRandomInt(600, 800))
            }, 800);
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
        this.add.image(width/2, height/2, 'back').setScale(1.16, .94);

        ball = this.physics.add.sprite((width/2), (height/2), 'ball')
                .setScale(.8)
                .setName("Ball")
                .setVelocity(this.getRandomInt(600, 800))
                .setVelocity(0)
                .setCollideWorldBounds(true)
                .setCircle(76)
                .setBounce(1);

        pad1 = this.physics.add.sprite((width/2), ((height) - 100), 'pad')
                .setScale(.8)
                .setName("Pad1")
                .setCircle(93.5)
                .setImmovable(true)
                .setInteractive()
                .setCollideWorldBounds(true);

        pad2 = this.physics.add.sprite((width/2), 100, 'pad').
                setScale(.8)
                .setName("Pad2")
                .setCircle(93.5)
                .setImmovable(true)
                .setInteractive()
                .setCollideWorldBounds(true);

        limits.push(this.add.rectangle((width/2), 0, (width/5), 10, 0x6666ff).setName("Player1"));
        limits.push(this.add.rectangle((width/2), height, (width/5), 10, 0x6666ff).setName("Player2"));

        limits.forEach(limit => {
            limit.score = 0;
            this.physics.add.existing(limit, true);
            limit.setAlpha(0);
        });

        this.anims.create({
            key: 'collide',
            frames: this.anims.generateFrameNumbers('collide', { start: 0, end: 15 }),
            frameRate: 60,
            repeat: 0
        });
    }

    getRandomInt(min = 0, max){
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
