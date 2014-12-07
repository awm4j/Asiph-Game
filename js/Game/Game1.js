/**
 * Created by Nate on 12/6/2014.
 * Modified by AwM4J 12/6/14.
 */

var game;

var gameWidth = 600;
var kodingWidth = 400; // ;)
var totalWidth = gameWidth + kodingWidth;
var totalHeight = 600;

var GAME_SPEED = 1;
var PLAYER_SPEED = 4;

//The main game class
Game1 = function() {
    game = new Phaser.Game(totalWidth, totalHeight, Phaser.CANVAS, 'phaser-game', {preload: Preload, create: Create, update: Update, render: Render });
	this.player;
	this.cursors;
    this.controlManager;
var bot;
    //Called before the game is started
    //Use to load the game assets
    function Preload() {
		game.load.image('player','assets/player.png');
		game.load.atlasJSONHash('bot', 'assets/mC_wU.png', 'assets/mC_wU.json');
		game.load.image('running','assets/running.png');
        game.load.spritesheet('btnOk', 'assets/btnOk.png', 200, 50)
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

	    //game.camera.deadzone = new Phaser.Rectangle(100, 100, 600, 400)
	    
		var runIcon = game.add.sprite(100, 100, 'running');
		runIcon.inputEnabled = true;
		runIcon.input.enableDrag(true);
		
		
		bot = game.add.sprite(200, 200, 'bot');

		//  Here we add a new animation called 'run'
		//  We haven't specified any frames because it's using every frame in the texture atlas
		bot.animations.add('run');

		//  And this starts the animation playing by using its key ("run")
		//  15 is the frame rate (15fps)
		//  true means it will loop when it finishes
		bot.animations.play('run', 15, true);

        this.popup = new PopupWindow(50, 50, 300, 200);
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
        this.popup.Render();
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


PopupWindow = function(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.style = { font: "26px Arial", fill: "#ff0044", align: "center" };

    //this.button.disabled = true;
    this.isRendering = false;




    this.Show = function(text){
        this.isRendering = true;
        this.text = game.add.text(this.x + 10, this.y + 10, text, this.style);

        this.isRendering = true;
    };

    this.Render = function(){

        if(this.isRendering) {
            game.context.fillStyle = 'rgba(255,0,255,0.8)';
            game.context.fillRect(this.x, this.y, this.width, this.height);
        }
    };

    this.actionOnClick = function(){
        if(this.isRendering)
        {
            this.isRendering = false;
            this.text.destroy();
            this.button.destroy();
            this.button.set("visible", false);
            this.button.set("exists", false);
        }
    };
    this.button = game.add.button((x + width) / 2 - 75, y + height - 52, 'btnOk', this.actionOnClick, this, 0, 0, 1);

};
