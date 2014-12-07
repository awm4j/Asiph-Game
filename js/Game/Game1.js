var game;

var gameWidth = 600;
var kodingWidth = 400;
var totalWidth = gameWidth + kodingWidth;
var totalHeight = 600;

var GAME_SPEED = 1;
var PLAYER_SPEED = 4;

///The main game class
Game1 = function() {
    game = new Phaser.Game(totalWidth, totalHeight, Phaser.CANVAS, 'phaser-game', {preload: Preload, create: Create, update: Update, render: Render });

    ///Use to load the game assets
    function Preload() {
		game.load.image('player','assets/player.png');
    }

    ///Use to instantiate objects before the game starts
    function Create() {

        this.controlManager = new ControlManager();

        game.world.setBounds(0, 0, gameWidth, totalHeight);
        this.player = new Player();
	    game.physics.enable(this.player.sprite, Phaser.Physics.ARCADE);
		game.camera.follow(this.player.sprite);

        this.cursors = game.input.keyboard.createCursorKeys();

	    //game.camera.deadzone = new Phaser.Rectangle(100, 100, 600, 400);
    }

    ///Called every frame for updating
    function Update() {
		this.player.vel_x = 0;
		this.player.vel_y = 0;
		
        if(this.controlManager.IsArrowKeyUp_Pressed()) {
            this.player.vel_y += -1;
        }
		if(this.controlManager.IsArrowKeyDown_Pressed()) {
            this.player.vel_y += 1;
        }
        if(this.controlManager.IsArrowKeyLeft_Pressed()) {
            this.player.vel_x += -1;
        }
		if (this.controlManager.IsArrowKeyRight_Pressed()) {
            this.player.vel_x += 1;
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
	
    this.Update = function(deltaTime) {
		// How much you'll move
		var deltaX = this.vel_x * PLAYER_SPEED * deltaTime;
		var deltaY = this.vel_y * PLAYER_SPEED * deltaTime;
	
		// This is where the player will move to
		var newX = deltaX + this.sprite.body.x;
		var newY = deltaY + this.sprite.body.y;
		
		// Gets dimensions of sprite
		var spriteWidth = this.sprite.body.width;
		var spriteHeight = this.sprite.body.height;
	
		// Checks if out of bounds
		if (newX < 0) {
			newX = 0;
		}
		else if (newX > gameWidth - spriteWidth) {
			newX = gameWidth - spriteWidth;
		}
		
		if (newY < 0) {
			newY = 0;
		}
		else if (newY > totalHeight - spriteHeight) {
			newY = totalHeight - spriteHeight;
		}
		
		// Updates Sprite
        this.sprite.body.x = newX;
        this.sprite.body.y = newY;

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