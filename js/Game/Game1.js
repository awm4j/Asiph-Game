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

var hEwU;
var hEwD;
var hEwL;
var hEwR; 
var hEaU;
var hEaD;
var hEaL;
var hEaR; 
var hEDIE;

//The main game class
Game1 = function() {
    this.game = new Phaser.Game(totalWidth, totalHeight, Phaser.AUTO, 'phaser-game', {preload: Preload, create: Create, update: Update, render: Render });
	this.player;
	this.cursors;
    this.controlManager;
    this.isGamePaused = false;
    this.vGamePad;
	
	var currentBlocks = [];
	
	var that = this;
	
    //Called before the game is started
    //Use to load the game assets
    function Preload() {
		// Backgrounds
        this.game.load.image('background','assets/backgroundGrid.png');//rockFlooring.png');
        this.game.load.image('background2','assets/light_sand.png');
        this.game.load.image('background3','assets/greenSquare.png');
		
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
        
		this.game.load.atlasJSONHash('humanEnemyWalkUpAnim', 'assets/humanEnemy/wU.png', 'assets/humanEnemy/wU.json');
        this.game.load.atlasJSONHash('humanEnemyWalkDownAnim', 'assets/humanEnemy/wD.png', 'assets/humanEnemy/wD.json');
        this.game.load.atlasJSONHash('humanEnemyWalkLeftAnim', 'assets/humanEnemy/wL.png', 'assets/humanEnemy/wL.json');
        this.game.load.atlasJSONHash('humanEnemyWalkRightAnim', 'assets/humanEnemy/wR.png', 'assets/humanEnemy/wR.json');
        this.game.load.atlasJSONHash('humanEnemyAttackUpAnim', 'assets/humanEnemy/aU.png', 'assets/humanEnemy/aU.json');
        this.game.load.atlasJSONHash('humanEnemyAttackDownAnim', 'assets/humanEnemy/aD.png', 'assets/humanEnemy/aD.json');
        this.game.load.atlasJSONHash('humanEnemyAttackLeftAnim', 'assets/humanEnemy/aL.png', 'assets/humanEnemy/aL.json');
        this.game.load.atlasJSONHash('humanEnemyAttackRightAnim', 'assets/humanEnemy/aR.png', 'assets/humanEnemy/aR.json');
        this.game.load.atlasJSONHash('humanEnemyDie', 'assets/humanEnemy/die.png', 'assets/humanEnemy/die.json');
        
		
		this.game.load.spritesheet('btnOk', 'assets/btnOk.png', 200, 50)
        
		// Code Blocks
        this.game.load.image('block0','assets/blocks/up.png');
        this.game.load.image('block1','assets/blocks/down.png');
        this.game.load.image('block2','assets/blocks/left.png');
        this.game.load.image('block3','assets/blocks/right.png');
        this.game.load.image('block4','assets/blocks/sword.png');
        this.game.load.image('block5','assets/blocks/bow.png');
		
        this.game.load.spritesheet('play','assets/play.png', 48, 48);

        this.game.load.spritesheet('btnArrowUp', 'assets/GamePad/keyArrowUp.png', 50, 50);
        this.game.load.spritesheet('btnArrowDown', 'assets/GamePad/keyArrowDown.png', 50, 50);
        this.game.load.spritesheet('btnArrowLeft', 'assets/GamePad/keyArrowLeft.png', 50, 50);
        this.game.load.spritesheet('btnArrowRight', 'assets/GamePad/keyArrowRight.png', 50, 50);

        this.game.load.spritesheet('btnKeyW', 'assets/GamePad/keyW.png', 50, 50);
        this.game.load.spritesheet('btnKeyA', 'assets/GamePad/keyA.png', 50, 50);
        this.game.load.spritesheet('btnKeyS', 'assets/GamePad/keyS.png', 50, 50);
        this.game.load.spritesheet('btnKeyD', 'assets/GamePad/keyD.png', 50, 50);
    } 

    ///Use to instantiate objects before the game starts
    function Create() {
		// Backgrounds
		this.game.add.tileSprite(0, 0, gameWidth, totalHeight, 'background');
        this.game.add.tileSprite(gameWidth, 0, kodingWidth, topSec, 'background3');
        this.game.add.tileSprite(gameWidth, topSec, kodingWidth, botSec, 'background2');
		
		this.game.world.setBounds(0, 0, gameWidth, totalHeight);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.player = new Player(this);
		
        cursors = this.game.input.keyboard.createCursorKeys();

		this.play = this.game.add.button(totalWidth - 70, totalHeight - 70, 'play', playStop, this);

	    //game.camera.deadzone = new Phaser.Rectangle(100, 100, 600, 400)

		// Programming blocks
		for (var i = 0; i < 7; ++i) {
			for (var j = 0; j < 3; ++j) {
				var blockName = 'block' + i % 6;
				var item = this.game.add.sprite(gameWidth + 8 + 56 * i, 14 + 62 * j, blockName);
				item.inputEnabled = true;
				item.input.enableDrag(true);
				item.x0 = item.x;
				item.y0 = item.y;
				item.original = true;
				item.events.onDragStop.add(fixLocation);
			}
		}

        mCwU = this.game.add.sprite(50, 60, 'mainCharWalkUpAnim');
        mCwD = this.game.add.sprite(50, 110, 'mainCharWalkDownAnim');
        mCwL  = this.game.add.sprite(50, 170, 'mainCharWalkLeftAnim');
        mCwR = this.game.add.sprite(50, 230, 'mainCharWalkRightAnim');
        mCaU  = this.game.add.sprite(50, 300, 'mainCharAttackUpAnim');
        mCaD  = this.game.add.sprite(50, 350, 'mainCharAttackDownAnim');
        mCaL   = this.game.add.sprite(50, 400, 'mainCharAttackLeftAnim');
        mCaR  = this.game.add.sprite(50, 450, 'mainCharAttackRightAnim');
        mCDIE = this.game.add.sprite(50, 0, 'mainCharDie');

		hEwU = this.game.add.sprite(150, 60, 'humanEnemyWalkUpAnim');
		hEwD = this.game.add.sprite(150, 110, 'humanEnemyWalkDownAnim');
		hEwL  = this.game.add.sprite(150, 170, 'humanEnemyWalkLeftAnim');
		hEwR = this.game.add.sprite(150, 230, 'humanEnemyWalkRightAnim');
		hEaU  = this.game.add.sprite(150, 300, 'humanEnemyAttackUpAnim');
		hEaD  = this.game.add.sprite(150, 350, 'humanEnemyAttackDownAnim');
		hEaL   = this.game.add.sprite(150, 400, 'humanEnemyAttackLeftAnim'); 
		hEaR  = this.game.add.sprite(150, 450, 'humanEnemyAttackRightAnim');
		hEDIE = this.game.add.sprite(150, 0, 'humanEnemyDie');
		
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
		
		hEwU.animations.add('run');
		hEwD.animations.add('run');
		hEwL.animations.add('run');
		hEwR.animations.add('run');
		hEaU.animations.add('run');
		hEaD.animations.add('run');
		hEaL.animations.add('run'); 
		hEaR.animations.add('run');
		hEDIE.animations.add('run'); 
		//  And this starts the animation playing by using its key ("run")
		//  15 is the frame rate (15fps)
		//  true means it will loop when it finishes
		mCwU.animations.play('run', 5, true);
		mCwD.animations.play('run', 5, true);
		mCwL.animations.play('run', 5, true);
		mCwR.animations.play('run', 5, true);
		mCaU.animations.play('run', 5, true);
		mCaD.animations.play('run', 5, true);
		mCaL.animations.play('run', 5, true);
		mCaR.animations.play('run', 5, true);
		mCDIE.animations.play('run', 5, true);
		
		hEwU.animations.play('run', 5, true);
		hEwD.animations.play('run', 5, true);
		hEwL.animations.play('run', 5, true);
		hEwR.animations.play('run', 5, true);
		hEaU.animations.play('run', 5, true);
		hEaD.animations.play('run', 5, true);
		hEaL.animations.play('run', 5, true);
		hEaR.animations.play('run', 5, true);
		hEDIE.animations.play('run', 5, true);
		
        this.popup = new PopupWindow(this, 50, 50, 500, 400);

        this.vGamePad = new VGamePad(this);
        this.controlManager = new ControlManager(this);


        //Creating and adding commands to the console
        this.console = new Console(this);
    }
	
	function playStop (button, pointer, isOver) {
		// Stop
		if (button.frame == 1) {
			button.frame = 0;
			this.console.callback = null;
			this.console.StopCommands();
		}
		// Play
		else {
			button.frame = 1;
						
			this.console.ClearCommands();
			// Go through the blocks and add them to console
			for (var i = 0; i < currentBlocks.length; ++i) {
				var command = blockToCommand(currentBlocks[i]) + ':5';
		        this.console.AddCommand(command);
			}
            this.console.StartCommands(function() {
				button.frame = 0;
			});
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
            }
            if (this.controlManager.IsArrowKeyDown_Pressed()) {
                this.player.MoveDown();
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
	
	function blockToCommand(item) {
		var command = '';
		switch (item.key) {
			case 'block0':
				command = 'MoveUp';
				break;
			case 'block1':
				command = 'MoveDown';
				break;
			case 'block2':
				command = 'MoveLeft';
				break;
			case 'block3':
				command = 'MoveRight';
				break;
			case 'block4':
				break;
			case 'block5':
				break;
			default:
				break;
		}
		return command;
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


ControlManager = function(game1) {
    this.game = game1;

    ///Arrow Keys
    this.IsArrowKeyUp_Pressed = function() {
        return (this.isKeyPressed(Phaser.Keyboard.UP) || isBtnArrowUp_Pressed);
    };
    this.IsArrowKeyDown_Pressed = function() {
        return (this.isKeyPressed(Phaser.Keyboard.DOWN) || isBtnArrowDown_Pressed);
    };
    this.IsArrowKeyLeft_Pressed = function() {
        return (this.isKeyPressed(Phaser.Keyboard.LEFT) || isBtnArrowLeft_Pressed);
    };
    this.IsArrowKeyRight_Pressed = function() {
        return (this.isKeyPressed(Phaser.Keyboard.RIGHT) || isBtnArrowRight_Pressed);
    };

    //Keys WASD
    this.IsBtnKeyW_Pressed = function() {
        return (this.isKeyPressed(Phaser.Keyboard.W) || isBtnKeyW_Pressed);
    };
    this.IsBtnKeyA_Pressed = function() {
        return (this.isKeyPressed(Phaser.Keyboard.A) || isBtnKeyA_Pressed);
    };
    this.IsBtnKeyS_Pressed = function() {
        return (this.isKeyPressed(Phaser.Keyboard.S) || isBtnKeyS_Pressed);
    };
    this.IsBtnKeyD_Pressed = function() {
        return (this.isKeyPressed(Phaser.Keyboard.D) || isBtnKeyD_Pressed);
    };

    this.isKeyPressed = function(key) {
        return (this.game.game.input.keyboard.isDown(key));
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
	this.callback = null;

    this.AddCommand = function(command)
    {
        this.commandsToRun.push(command);
    };

    this.ClearCommands = function()
    {
        this.commandsToRun.length = 0;
    };

	// The callback is executed when the commands are finished running
    this.StartCommands = function(callback)
    {
        this.isRunningCommands = true;
        this.currentCommandIndex = 0;
		this.callback = callback;
    };

    this.StopCommands = function()
    {
		this.timer = 0;
        this.isRunningCommands = false;
		if (this.callback) {
			this.callback();
		}
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
        switch (command)
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



var isBtnArrowUp_Pressed = false;
var isBtnArrowDown_Pressed = false;
var isBtnArrowLeft_Pressed = false;
var isBtnArrowRight_Pressed = false;

var isBtnKeyW_Pressed = false;
var isBtnKeyA_Pressed = false;
var isBtnKeyS_Pressed = false;
var isBtnKeyD_Pressed = false;
VGamePad = function(game1)
{
    this.game = game1;

    this.onBtnArrowUp_Pressed = function() {
        isBtnArrowUp_Pressed = true;
    };
    this.onBtnArrowUp_Released = function(){
        isBtnArrowUp_Pressed = false;
    };

    this.onBtnArrowDown_Pressed = function() {
        isBtnArrowDown_Pressed = true;
    };
    this.onBtnArrowDown_Released = function(){
        isBtnArrowDown_Pressed = false;
    };

    this.onBtnArrowLeft_Pressed = function() {
        isBtnArrowLeft_Pressed = true;
    };
    this.onBtnArrowLeft_Released = function(){
        isBtnArrowLeft_Pressed = false;
    };

    this.onBtnArrowRight_Pressed = function() {
        isBtnArrowRight_Pressed = true;
    };
    this.onBtnArrowRight_Released = function(){
        isBtnArrowRight_Pressed = false;
    };

    this.btnArrowUp = this.game.add.button(gameWidth - 110, totalHeight - 110, 'btnArrowUp', null, this, 0, 0, 1);
    this.btnArrowUp.fixedToCamera = true;
    this.btnArrowUp.events.onInputDown.add(this.onBtnArrowUp_Pressed);
    this.btnArrowUp.events.onInputUp.add(this.onBtnArrowUp_Released);

    this.btnArrowDown = this.game.add.button(gameWidth - 110, totalHeight - 55, 'btnArrowDown', null, this, 0, 0, 1);
    this.btnArrowDown.fixedToCamera = true;
    this.btnArrowDown.events.onInputDown.add(this.onBtnArrowDown_Pressed);
    this.btnArrowDown.events.onInputUp.add(this.onBtnArrowDown_Released);

    this.btnArrowLeft = this.game.add.button(gameWidth - 165, totalHeight - 55, 'btnArrowLeft', null, this, 0, 0, 1);
    this.btnArrowLeft.fixedToCamera = true;
    this.btnArrowLeft.events.onInputDown.add(this.onBtnArrowLeft_Pressed);
    this.btnArrowLeft.events.onInputUp.add(this.onBtnArrowLeft_Released);

    this.btnArrowRight = this.game.add.button(gameWidth - 55, totalHeight - 55, 'btnArrowRight', null, this, 0, 0, 1);
    this.btnArrowRight.fixedToCamera = true;
    this.btnArrowRight.events.onInputDown.add(this.onBtnArrowRight_Pressed);
    this.btnArrowRight.events.onInputUp.add(this.onBtnArrowRight_Released);

    this.groupArrows = this.game.game.add.group();
    this.groupArrows.add(this.btnArrowUp);
    this.groupArrows.add(this.btnArrowDown);
    this.groupArrows.add(this.btnArrowLeft);
    this.groupArrows.add(this.btnArrowRight);



    this.onBtnKeyW_Pressed = function() {
        isBtnKeyW_Pressed = true;
    };
    this.onBtnKeyW_Released = function(){
        isBtnKeyW_Pressed = false;
    };

    this.onBtnKeyA_Pressed = function() {
        isBtnKeyA_Pressed = true;
    };
    this.onBtnKeyA_Released = function(){
        isBtnKeyA_Pressed = false;
    };

    this.onBtnKeyS_Pressed = function() {
        isBtnKeyS_Pressed = true;
    };
    this.onBtnKeyS_Released = function(){
        isBtnKeyS_Pressed = false;
    };

    this.onBtnKeyD_Pressed = function() {
        isBtnKeyD_Pressed = true;
    };
    this.onBtnKeyD_Released = function(){
        isBtnKeyD_Pressed = false;
    };

    this.btnKeyW = this.game.add.button(60, totalHeight - 110, 'btnKeyW', null, this, 0, 0, 1);
    this.btnKeyW.fixedToCamera = true;
    this.btnKeyW.events.onInputDown.add(this.onBtnKeyW_Pressed);
    this.btnKeyW.events.onInputUp.add(this.onBtnKeyW_Released);

    this.btnKeyA = this.game.add.button(5, totalHeight - 55, 'btnKeyA', null, this, 0, 0, 1);
    this.btnKeyA.fixedToCamera = true;
    this.btnKeyA.events.onInputDown.add(this.onBtnKeyA_Pressed);
    this.btnKeyA.events.onInputUp.add(this.onBtnKeyA_Released);

    this.btnKeyS = this.game.add.button(60, totalHeight - 55, 'btnKeyS', null, this, 0, 0, 1);
    this.btnKeyS.fixedToCamera = true;
    this.btnKeyS.events.onInputDown.add(this.onBtnKeyS_Pressed);
    this.btnKeyS.events.onInputUp.add(this.onBtnKeyS_Released);

    this.btnKeyD = this.game.add.button(115, totalHeight - 55, 'btnKeyD', null, this, 0, 0, 1);
    this.btnKeyD.fixedToCamera = true;
    this.btnKeyD.events.onInputDown.add(this.onBtnKeyD_Pressed);
    this.btnKeyD.events.onInputUp.add(this.onBtnKeyD_Released);

    this.groupWASD = this.game.game.add.group();
    this.groupWASD.add(this.btnKeyW);
    this.groupWASD.add(this.btnKeyA);
    this.groupWASD.add(this.btnKeyS);
    this.groupWASD.add(this.btnKeyD);
};