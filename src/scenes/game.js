// Useful vars
let width, height, mContext, colliders = [], collide;

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
            }, 800);
        }

        function newCollision (ball){
            colliders.push(collide = mContext.add.sprite(ball.x, ball.y, 'collide', 0).setScale(.5));
            collide.anims.play('collide');

            setTimeout(() => {
                if(colliders.length > 1){
                    colliders[0].destroy();
                    colliders.shift();
                }
            }, 1000);
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
                .setCollideWorldBounds(true)
                .setCircle(55.5)
                .setBounce(1);

        pad1 = this.physics.add.sprite((width/2), ((height) - 100), 'pad')
                .setScale(.8)
                .setName("Pad1")
                .setCircle(93.5)
                .setImmovable(true)
                .setVelocity(this.getRandomInt(-10, 10))
                .setInteractive()
                .setCollideWorldBounds(true);

        pad2 = this.physics.add.sprite((width/2), 100, 'pad').
                setScale(.8)
                .setName("Pad2")
                .setCircle(93.5)
                .setImmovable(true)
                .setVelocity(this.getRandomInt(-10, 10))
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
