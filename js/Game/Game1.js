/**
 * Created by Nate on 12/6/2014.
 */

var game;

var gameWidth = 600;
var kodingWidth = 400; // ;)
var totalWidth = gameWidth + kodingWidth;
var totalHeight = 600;

var GAME_SPEED = 1;
var PLAYER_SPEED = 4;

///The main game class
Game1 = function() {
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
            this.player.vel_y = -1;
        }
        else if(this.controlManager.IsArrowKeyDown_Pressed()) {
            this.player.vel_y = 1;
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

    this.Update = function(deltaTime) {
		
		// How much you'll move
		var deltaX = this.vel_x * PLAYER_SPEED * deltaTime;
		var deltaY = this.vel_y * PLAYER_SPEED * deltaTime;
	
		// Distance from an edge
		var distX = Math.min(gameWidth - this.sprite.body.x, this.sprite.body.x);
		var distY = Math.min(totalHeight - this.sprite.body.y, this.sprite.body.y);
		
        this.sprite.body.x += Math.min(deltaX, distX);
        this.sprite.body.y += Math.min(deltaY, distY);

		if (this.sprite.body.x < 0)
			this.sprite.body.x = 0;
		if (this.sprite.body.y < 0)
			this.sprite.body.y = 0;

        this.vel_x = 0;
        this.vel_y = 0;
    };
};


ControlManager = function() {
    this.IsArrowKeyUp_Pressed = function() {
        return this.isKeyPressed(Phaser.Keyboard.UP);
    };
    this.IsArrowKeyDown_Pressed = function() {
        return this.isKeyPressed(Phaser.Keyboard.DOWN);
    };
    this.IsArrowKeyLeft_Pressed = function() {
        return this.isKeyPressed(Phaser.Keyboard.LEFT);
    };
    this.IsArrowKeyRight_Pressed = function() {
        return this.isKeyPressed(Phaser.Keyboard.RIGHT);
    };

    this.isKeyPressed = function(key) {
        return (game.input.keyboard.isDown(key));
    }
};