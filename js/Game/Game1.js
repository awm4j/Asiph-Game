/**
 * Created by Nate on 12/6/2014.
 * Modified by AwM4J 12/6-7/2014.
 */

var gameWidth = 600;
var kodingWidth = 400; // ;)

var topSec = 200;
var botSec = 400;

var totalWidth = gameWidth + kodingWidth;
var totalHeight = topSec + botSec;

var mCwU;
var mCwD;
var mCwL;
var mCwR; 
var mCaU;
var mCaD;
var mCaL;
var mCaR; 
var mCDIE;

//The main game class
Game1 = function() {
    this.game = new Phaser.Game(totalWidth, totalHeight, Phaser.AUTO, 'phaser-game', {preload: Preload, create: Create, update: Update, render: Render });
	this.player;
	this.cursors;
    this.controlManager;
    this.isGamePaused = false;
	
	var currentBlocks = [];
	
	var that = this;
	
    //Called before the game is started
    //Use to load the game assets
    function Preload() {
        this.game.load.image('background','assets/rockFlooring.png');
        this.game.load.image('background2','assets/light_sand.png');
        this.game.load.image('player','assets/player.png');
        this.game.load.atlasJSONHash('mainCharWalkUpAnim', 'assets/mainChar/wU.png', 'assets/mainChar/wU.json');
        this.game.load.atlasJSONHash('mainCharWalkDownAnim', 'assets/mainChar/wD.png', 'assets/mainChar/wD.json');
        this.game.load.atlasJSONHash('mainCharWalkLeftAnim', 'assets/mainChar/wL.png', 'assets/mainChar/wL.json');
        this.game.load.atlasJSONHash('mainCharWalkRightAnim', 'assets/mainChar/wR.png', 'assets/mainChar/wR.json');
        this.game.load.atlasJSONHash('mainCharAttackUpAnim', 'assets/mainChar/aU.png', 'assets/mainChar/aU.json');
        this.game.load.atlasJSONHash('mainCharAttackDownAnim', 'assets/mainChar/aD.png', 'assets/mainChar/aD.json');
        this.game.load.atlasJSONHash('mainCharAttackLeftAnim', 'assets/mainChar/aL.png', 'assets/mainChar/aL.json');
        this.game.load.atlasJSONHash('mainCharAttackRightAnim', 'assets/mainChar/aR.png', 'assets/mainChar/aR.json');
        this.game.load.atlasJSONHash('mainCharDie', 'assets/mainChar/die.png', 'assets/mainChar/die.json');
        this.game.load.spritesheet('btnOk', 'assets/btnOk.png', 200, 50)
        
		// Blocks
        this.game.load.image('block0','assets/blocks/up.png');
        this.game.load.image('block1','assets/blocks/down.png');
        this.game.load.image('block2','assets/blocks/left.png');
        this.game.load.image('block3','assets/blocks/right.png');
		
        this.game.load.spritesheet('play','assets/play.png', 48, 48);
    } 

    ///Use to instantiate objects before the game starts
    function Create() {
        this.controlManager = new ControlManager(this.game);
        this.game.add.tileSprite(0, 0, gameWidth, totalHeight, 'background');
        this.game.add.tileSprite(gameWidth, 0, kodingWidth, topSec, 'background2');
        this.game.world.setBounds(0, 0, gameWidth, totalHeight);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.player = new Player(this);
		
        cursors = this.game.input.keyboard.createCursorKeys();

		this.play = this.game.add.button(totalWidth - 70, totalHeight - 70, 'play', playStop, this);

	    //game.camera.deadzone = new Phaser.Rectangle(100, 100, 600, 400)

		// Programming blocks
		for (var i = 0; i < 7; ++i) {
			for (var j = 0; j < 3; ++j) {
				var blockName = 'block' + i % 4;
				var item = this.game.add.sprite(gameWidth + 8 + 56 * i, 14 + 62 * j, blockName);
				item.inputEnabled = true;
				item.input.enableDrag(true);
				item.x0 = item.x;
				item.y0 = item.y;
				item.original = true;
				item.events.onDragStop.add(fixLocation);
			}
		}

        mCwU = this.game.add.sprite(100, 100, 'mainCharWalkUpAnim');
        mCwD = this.game.add.sprite(100, 150, 'mainCharWalkDownAnim');
        mCwL = this.game.add.sprite(100, 200, 'mainCharWalkLeftAnim');
        mCwR = this.game.add.sprite(100, 250, 'mainCharWalkRightAnim');
        mCaU = this.game.add.sprite(100, 300, 'mainCharAttackUpAnim');
        mCaD = this.game.add.sprite(100, 350, 'mainCharAttackDownAnim');
        mCaL = this.game.add.sprite(100, 400, 'mainCharAttackLeftAnim');
        mCaR = this.game.add.sprite(100, 450, 'mainCharAttackRightAnim');
        mCDIE = this.game.add.sprite(100, 500, 'mainCharDie');

		//  Here we add a new animation called 'run'
		//  We haven't specified any frames because it's using every frame in the texture atlas
		mCwU.animations.add('run');
		mCwD.animations.add('run');
		mCwL.animations.add('run');
		mCwR.animations.add('run');
		mCaU.animations.add('run');
		mCaD.animations.add('run');
		mCaL.animations.add('run');
		mCaR.animations.add('run');
		mCDIE.animations.add('run');
		
		//  And this starts the animation playing by using its key ("run")
		//  15 is the frame rate (15fps)
		//  true means it will loop when it finishes
		mCwU.animations.play('run', 5, true);
		mCwD.animations.play('run', 5, 3);
		mCwL.animations.play('run', 5, true);
		mCwR.animations.play('run', 5, true);
		mCaU.animations.play('run', 5, true);
		mCaD.animations.play('run', 5, true);
		mCaL.animations.play('run', 5, true);
		mCaR.animations.play('run', 5, true);
		mCDIE.animations.play('run', 5, 3);
		
		
        this.popup = new PopupWindow(this, 50, 50, 500, 400);


        //Creating and adding commands to the console
        this.console = new Console(this);
        this.console.AddCommand("MoveUp:5");
        this.console.AddCommand("MoveDown:10");
    }
	
	function playStop (button, pointer, isOver) {
		if (button.frame == 1) {
			button.frame = 0;
		}
		else {
			button.frame = 1;
		}
	}
	
	// Used for the coding blocks
	function fixLocation (item) {
		// Moved a fresh block into the bottom coding area
		if (item.x > gameWidth - item.width && item.y > topSec - item.height && item.original) {			
			var newItem = that.game.add.sprite(item.x0, item.y0, item.key);
			newItem.inputEnabled = true;
			newItem.input.enableDrag(true);
			newItem.x0 = newItem.x;
			newItem.y0 = newItem.y;
			newItem.original = true;			
			newItem.events.onDragStop.add(fixLocation);
			
			item.original = false;
			
			currentBlocks.push(item);
			
			var oldIndex = currentBlocks.indexOf(item);
			var newIndex = getBlockIndex(item);
			
			currentBlocks.move(oldIndex, newIndex);
		}
		// Moved a fresh block somewhere other than the bottom coding area
		else if (item.original) {
			item.x = item.x0;
			item.y = item.y0;
		}
		// Moved an old block out of the bottom coding area
		else if (item.x < gameWidth - item.width || item.y < topSec - item.height){
			// Remove it from the current blocks array
			var i = currentBlocks.indexOf(item);
			if(i != -1) {
				currentBlocks.splice(i, 1);
			}
			item.destroy();
		}
		// Moved an old block inside of the coding area
		else {
			var oldIndex = currentBlocks.indexOf(item);
			var newIndex = getBlockIndex(item);
			
			currentBlocks.move(oldIndex, newIndex);
		}
		
		updateCurrentBlocks();
	}
	
	function getBlockIndex (item) {
		for (var i = 0; i < currentBlocks.length; ++i) {
			var block = currentBlocks[i];
			if (item.x < block.x && item.y < block.y + block.height/2) {
				return i;
			}
		}
		return currentBlocks.length - 1;
	}
	
	// Updates the look of the bottom blocks
	function updateCurrentBlocks() {
		for (var i = 0; i < currentBlocks.length; ++i) {
			var item = currentBlocks[i];
			item.x = gameWidth + 8 + 56 * (i % 7);
			item.y = topSec + 10 + Math.trunc(i / 7) * 60;
		}		
	}

    ///Called every frame for updating
    function Update() {

        if(!this.isGamePaused) {
            if (this.controlManager.IsArrowKeyUp_Pressed()) {
                this.player.MoveUp();
                this.console.StartCommands();
            }
            if (this.controlManager.IsArrowKeyDown_Pressed()) {
                this.player.MoveDown();
                this.console.StopCommands();
            }

            if (this.controlManager.IsArrowKeyLeft_Pressed()) {
                this.player.MoveLeft();
            }
            if (this.controlManager.IsArrowKeyRight_Pressed()) {
                this.player.MoveRight();
            }

            this.console.Update(1);
        }
        this.player.Update();
    }

    ///Called every frame for drawing
    function Render() {
        this.popup.Render();
    }
};


var Player = function(game1) {
    this.game = game1;
    this.sprite = game1.game.add.sprite(game1.game.world.centerX, game1.game.world.centerY, 'player');
    this.sprite.angle = 0;
    this.sprite.rotation = 0;
    this.sprite.anchor.setTo(0.5, 0.5);

    this.yDir = 0;
    this.xDir = 0;
	
	this.game.game.physics.arcade.enableBody(this.sprite);
	this.sprite.body.collideWorldBounds = true;
	
	this.game.game.camera.follow(this.sprite);
};

Player.prototype.Update = function() {
	var SPEED = 100;
	var len = Math.sqrt(this.xDir * this.xDir + this.yDir * this.yDir);
	this.sprite.body.velocity.x = this.xDir / len * SPEED;
	this.sprite.body.velocity.y = this.yDir / len * SPEED;


    this.yDir = 0;
    this.xDir = 0;
};

Player.prototype.MoveUp = function(){
    this.yDir -= 1;
};
Player.prototype.MoveDown = function(){
    this.yDir += 1;
};
Player.prototype.MoveLeft = function(){
    this.xDir -= 1;
};
Player.prototype.MoveRight = function(){
    this.xDir += 1;
};


ControlManager = function(game) {
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


PopupWindow = function(game1, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.style = { font: "18px Arial", fill: "#ffffff", align: "left" };
    this.game = game1;
    this.graphics = this.game.add.graphics(0,0);

    this.isRendering = false;


    this.Show = function(text){
        if(!this.isRendering) {
            this.game.isGamePaused = true;
            this.isRendering = true;
            this.text = this.game.add.text(this.x + 10, this.y + 10, text, this.style);

            this.group = this.game.add.group();
            this.group.add(this.graphics);
            this.group.add(this.button);
            this.group.add(this.text);

            this.isRendering = true;
        }
    };

    this.Render = function(){
        if(this.isRendering) {
            this.graphics.lineStyle(2, 0x0000FF, 1);
            this.graphics.drawRect(x,y,width,height);
            this.graphics.beginFill(0x0000FF, 0.5);
        }
    };

    this.actionOnClick = function(){
        if(this.isRendering)
        {
            this.game.isGamePaused = false;
            this.isRendering = false;
            this.text.destroy();
            //this.button.destroy();
            this.game.world.remove(this.group);
        }
    };
    this.button = this.game.add.button((x + width) / 2 - 75, y + height - 52, 'btnOk', this.actionOnClick, this, 0, 0, 1);
    this.group = this.game.add.group();
    this.group.add(this.button);
    this.game.world.remove(this.group);
};


///Command should look like: '<command>:<duration>' duration can be distance, or time
var COMAND_BLOCK_TIME = 10;
Console = function(game1)
{
    this.game = game1;
    this.isRunningCommands = false;
    this.commandsToRun = new Array();
    this.currentCommandIndex = 0;
    this.timer = 0;

    this.AddCommand = function(command)
    {
        this.commandsToRun.push(command);
    };

    this.ClearCommands = function()
    {
        this.commandsToRun.length = 0;
    }

    this.StartCommands = function()
    {
        this.isRunningCommands = true;
        this.currentCommandIndex = 0;
    };

    this.StopCommands = function()
    {
        this.isRunningCommands = false;
    };

    this.Update = function(elapsedTime)
    {
        if(this.isRunningCommands) {
            var currentCommand = this.commandsToRun[this.currentCommandIndex];

            var c = currentCommand.split(":");

            var command = c[0];
            var duration = parseInt(c[1]);

            this.timer += elapsedTime;

            if(this.timer < duration * COMAND_BLOCK_TIME)
            {
                this.runCommand(command);
            }
            else
            {
                this.timer = 0;
                ++this.currentCommandIndex;
            }

            if(this.currentCommandIndex >= this.commandsToRun.length)
            {
                this.StopCommands();
            }
        }
    };

    this.runCommand = function(command)
    {
        var c = command.split(":");
        switch (c[0])
        {
            case "MoveUp":
                this.game.player.MoveUp();
                break;
            case "MoveDown":
                this.game.player.MoveDown();
                break;
            case "MoveLeft":
                this.game.player.MoveLeft();
                break;
            case "MoveRight":
                this.game.player.MoveRight();
                break;
            default:
                break;
        }
    }
};

// Taken from: http://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};