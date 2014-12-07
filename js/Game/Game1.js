/**
 * Created by Nate on 12/6/2014.
 */

var game;

var GAME_SPEED = 1;
var PLAYER_SPEED = 40;

///The main game class
Game1 = function() {

	var gameWidth = 600;
	var kodingWidth = 400; // ;)
	
	var totalWidth = gameWidth + kodingWidth;
	var totalHeight = 600;

    game = new Phaser.Game(totalWidth, totalHeight, Phaser.CANVAS, 'phaser-game', {preload: Preload, create: Create, update: Update, render: Render });
	this.player;
	this.cursors;
    this.controlManager;

    ///Called before the game is started
    ///Use to load the game assets
    function Preload() {
		game.load.image('player','assets/player.png');
    }

    ///Use to instantiate objects before the game starts
    function Create() {

        this.controlManager = new ControlManager();

        game.world.setBounds(0, 0, gameWidth, totalHeight);
        game.physics.startSystem(Phaser.Physics.P2JS);

        this.player = new Player();
        game.physics.p2.enable(this.player.sprite);
        game.camera.follow(this.player.sprite);

        cursors = game.input.keyboard.createCursorKeys();

	    //game.camera.deadzone = new Phaser.Rectangle(100, 100, 600, 400);
    }

    ///Called every frame for updating
    function Update() {
        if(this.controlManager.IsArrowKeyUp_Pressed()) {
            this.player.vel_y = 1;
        }
        else if(this.controlManager.IsArrowKeyDown_Pressed()) {
            this.player.vel_y = -1;
        }

        if(this.controlManager.IsArrowKeyLeft_Pressed()) {
            this.player.vel_x = -1;
        }
        else if (this.controlManager.IsArrowKeyRight_Pressed()) {
            this.player.vel_x = 1;
        }
        this.player.Update(GAME_SPEED);
    }

    ///Called every frame for drawing
    function Render() {
	    game.context.fillStyle = 'rgba(255,0,0,0.6)';
	    game.context.fillRect(gameWidth, 0, kodingWidth, totalHeight);		
    }

};

Player = function() {
    this.vel_x = 0;
    this.vel_y = 0;

    this.sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    this.sprite.angle = 0;
    this.sprite.rotation = 0;
    this.sprite.anchor.setTo(0.5, 0.5);
//    this.sprite.immovable = false;

    this.xdir;
    this.ydir;

    this.Update = function(deltaTime)
    {

        this.sprite.body.x += (this.vel_x * PLAYER_SPEED * deltaTime);
        this.sprite.body.y += (this.vel_y * PLAYER_SPEED * deltaTime);

        this.xdir = (this.vel_x * PLAYER_SPEED * deltaTime);
        this.ydir = (this.vel_y * PLAYER_SPEED * deltaTime);

        this.vel_x = 0;
        this.vel_y = 0;
    };
};



ControlManager = function()
{
    this.IsArrowKeyUp_Pressed = function()
    {
        return this.isKeyPressed(Phaser.Keyboard.UP);
    };
    this.IsArrowKeyDown_Pressed = function()
    {
        return this.isKeyPressed(Phaser.Keyboard.DOWN);
    };
    this.IsArrowKeyLeft_Pressed = function()
    {
        return this.isKeyPressed(Phaser.Keyboard.LEFT);
    };
    this.IsArrowKeyRight_Pressed = function()
    {
        return this.isKeyPressed(Phaser.Keyboard.RIGHT);
    };



    this.isKeyPressed = function(key)
    {
        return (game.input.keyboard.isDown(key));
    }

};



/*Game1 = function()
{
    /**
     * Created by Nate on 12/6/2014.
     *//*
>>>>>>> e7db43c2d84f8837a9b0c8a68cbc04909616ea69
    EnemyTank = function (index, game, player, bullets) {

        var x = game.world.randomX;
        var y = game.world.randomY;

        this.game = game;
        this.health = 3;
        this.player = player;
        this.bullets = bullets;
        this.fireRate = 1000;
        this.nextFire = 0;
        this.alive = true;

        this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
        this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
        this.turret = game.add.sprite(x, y, 'enemy', 'turret');

        this.shadow.anchor.set(0.5);
        this.tank.anchor.set(0.5);
        this.turret.anchor.set(0.3, 0.5);

        this.tank.name = index.toString();
        game.physics.enable(this.tank, Phaser.Physics.ARCADE);
        this.tank.body.immovable = false;
        this.tank.body.collideWorldBounds = true;
        this.tank.body.bounce.setTo(1, 1);

        this.tank.angle = game.rnd.angle();

        game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);
    };

    EnemyTank.prototype.damage = function() {

        this.health -= 1;

        if (this.health <= 0) {
            this.alive = false;

            this.shadow.kill();
            this.tank.kill();
            this.turret.kill();

            return true;
        }
        return false;
    }

    EnemyTank.prototype.update = function() {

        this.shadow.x = this.tank.x;
        this.shadow.y = this.tank.y;
        this.shadow.rotation = this.tank.rotation;

        this.turret.x = this.tank.x;
        this.turret.y = this.tank.y;
        this.turret.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);

        if (this.game.physics.arcade.distanceBetween(this.tank, this.player) < 300) {
            if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
                this.nextFire = this.game.time.now + this.fireRate;

                var bullet = this.bullets.getFirstDead();
                bullet.reset(this.turret.x, this.turret.y);
                bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
            }
        }
    };



    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-game', { preload: preload, create: create, update: update, render: render });

    function preload () {
        game.load.atlas('tank', 'assets/tanks.png', 'assets/tanks.json');
        game.load.atlas('enemy', 'assets/enemy-tanks.png', 'assets/tanks.json');
        game.load.image('logo', 'assets/logo.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('earth', 'assets/scorched_earth.png');
        game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
    }


    var land;

    var shadow;
    var tank;
    var turret;

    var enemies;
    var enemyBullets;
    var enemiesTotal = 0;
    var enemiesAlive = 0;
    var explosions;

    var logo;

    var currentSpeed = 0;
    var cursors;

    var bullets;
    var fireRate = 100;
    var nextFire = 0;


    function create () {
        //  Resize our game world to be a 2000 x 2000 square
        game.world.setBounds(-1000, -1000, 2000, 2000);

        //  Our tiled scrolling background
        land = game.add.tileSprite(0, 0, 800, 600, 'earth');
        land.fixedToCamera = true;

        //  The base of our tank
        tank = game.add.sprite(0, 0, 'tank', 'tank1');
        tank.anchor.setTo(0.5, 0.5);
        tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

        //  This will force it to decelerate and limit its speed
        game.physics.enable(tank, Phaser.Physics.ARCADE);
        tank.body.drag.set(0.2);
        tank.body.maxVelocity.setTo(400, 400);
        tank.body.collideWorldBounds = true;

        //  Finally the turret that we place on-top of the tank body
        turret = game.add.sprite(0, 0, 'tank', 'turret');
        turret.anchor.setTo(0.3, 0.5);

        //  The enemies bullet group
        enemyBullets = game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets.createMultiple(100, 'bullet');

        enemyBullets.setAll('anchor.x', 0.5);
        enemyBullets.setAll('anchor.y', 0.5);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);

        //  Create some baddies to waste :)
        enemies = [];

        enemiesTotal = 20;
        enemiesAlive = 20;

        for (var i = 0; i < enemiesTotal; i++)
        {
            enemies.push(new EnemyTank(i, game, tank, enemyBullets));
        }

        //  A shadow below our tank
        shadow = game.add.sprite(0, 0, 'tank', 'shadow');
        shadow.anchor.setTo(0.5, 0.5);

        //  Our bullet group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet', 0, false);
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        //  Explosion pool
        explosions = game.add.group();

        for (var i = 0; i < 10; i++) {
            var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
            explosionAnimation.anchor.setTo(0.5, 0.5);
            explosionAnimation.animations.add('kaboom');
        }

        tank.bringToTop();
        turret.bringToTop();

        logo = game.add.sprite(0, 200, 'logo');
        logo.fixedToCamera = true;

        game.input.onDown.add(removeLogo, this);

        game.camera.follow(tank);
        game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
        game.camera.focusOnXY(0, 0);

        cursors = game.input.keyboard.createCursorKeys();
    }

    function removeLogo () {
        game.input.onDown.remove(removeLogo, this);
        logo.kill();
    }


    function update () {
        game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);
        enemiesAlive = 0;

        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i].alive) {
                enemiesAlive++;
                game.physics.arcade.collide(tank, enemies[i].tank);
                game.physics.arcade.overlap(bullets, enemies[i].tank, bulletHitEnemy, null, this);
                enemies[i].update();
            }
        }

        if (cursors.left.isDown) {
            tank.angle -= 4;
        }
        else if (cursors.right.isDown) {
            tank.angle += 4;
        }

        if (cursors.up.isDown) {
            //  The speed we'll travel at
            currentSpeed = 300;
        }
        else {
            if (currentSpeed > 0) {
                currentSpeed -= 4;
            }
        }

        if (currentSpeed > 0) {
            game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
        }

        land.tilePosition.x = -game.camera.x;
        land.tilePosition.y = -game.camera.y;

        //  Position all the parts and align rotations
        shadow.x = tank.x;
        shadow.y = tank.y;
        shadow.rotation = tank.rotation;

        turret.x = tank.x;
        turret.y = tank.y;

        turret.rotation = game.physics.arcade.angleToPointer(turret);

        if (game.input.activePointer.isDown) {
            //  Boom!
            fire();
        }
    }

    function bulletHitPlayer (tank, bullet) {
        bullet.kill();
    }

    function bulletHitEnemy (tank, bullet) {
        bullet.kill();
        var destroyed = enemies[tank.name].damage();

        if (destroyed) {
            var explosionAnimation = explosions.getFirstExists(false);
            explosionAnimation.reset(tank.x, tank.y);
            explosionAnimation.play('kaboom', 30, false, true);
        }
    }

    function fire () {
        if (game.time.now > nextFire && bullets.countDead() > 0) {
            nextFire = game.time.now + fireRate;
            var bullet = bullets.getFirstExists(false);
            bullet.reset(turret.x, turret.y);
            bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
        }
    }


    function render () {
        // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
        game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);
    }
};*/