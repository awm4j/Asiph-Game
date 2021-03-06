/**
 * Created by Nate on 12/06/2014.
 * Enhanced by AwM4J 12/07/2014
 * Blessed by Sippy 12/07/2014
 */
var TILE_SIZE = 60;
var COMAND_BLOCK_TIME = 7.43;


var gameWidth = 600;
var kodingWidth = 400; // ;)

var topSec = 80;
var botSec = 520;

var totalWidth = gameWidth + kodingWidth;
var totalHeight = topSec + botSec;


//The main game class
Game1 = function() {
    this.game = new Phaser.Game(totalWidth, totalHeight, Phaser.AUTO, 'phaser-game', {preload: Preload, create: Create, update: Update, render: Render });
	this.player;
	this.cursors;
    this.controlManager;
    this.isGamePaused = false;
    this.vGamePad;
	this.graphics;
	this.graphicsGroup;
	this.previousCommand = 0;
	
	var currentBlocks = [];
	
	var that = this;
	
    //Called before the game is started
    //Use to load the game assets
    function Preload() {
		// Backgrounds
        this.game.load.image('background','assets/backgroundGrid.png');//rockFlooring.png');
        this.game.load.image('background2','assets/light_sand.png');
        this.game.load.image('background3','assets/greenSquare.png');
		

		this.game.load.atlasJSONHash('playerAnimation', 'assets/mainPlayer.png', 'assets/mainPlayer.json');
		this.game.load.atlasJSONHash('enemy1Animation', 'assets/enemy1.png', 'assets/enemy1.json');

		this.game.load.image('lavaTile','assets/lavaFloor.png');
		
		this.game.load.spritesheet('btnOk', 'assets/btnOk.png', 200, 50)
        
		// Code Blocks
        this.game.load.image('up','assets/blocks/up.png');
        this.game.load.image('down','assets/blocks/down.png');
        this.game.load.image('left','assets/blocks/left.png');
        this.game.load.image('right','assets/blocks/right.png');
        this.game.load.image('sword','assets/blocks/sword.png');
        //this.game.load.image('bow','assets/blocks/bow.png');
        
		this.game.load.image('loop','assets/blocks/loop.png');
        this.game.load.image('loopOpen','assets/blocks/loopOpen.png');
        this.game.load.image('loopClose','assets/blocks/loopClose.png');
		
		// Play/Stop Button
        this.game.load.spritesheet('play','assets/play.png', 48, 48);
		this.game.load.spritesheet('trash', 'assets/trash.png', 48, 48);

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
		
		// Create a new group
		this.walls = this.game.add.group();

		// Add Arcade physics to the whole group
		this.walls.enableBody = true;



		
		this.lavaTile = [];
		for(var i=0; i<8;++i)
		{
			// Create the lavaTiles wall
			var lava = this.game.add.sprite(60+(i*60), 0, 'lavaTile', 0, this.walls);
			// Add Arcade physics
			this.game.physics.arcade.enable(lava); 
			// Set a property to make sure it won't move 
			lava.body.immovable = true;
			
			this.lavaTile.push(lava);
		}
		for(var i=0; i<5;++i)
		{
			// Create the lavaTiles wall
			var lava = this.game.add.sprite(60, 60+(i*60), 'lavaTile', 0, this.walls); 
			// Add Arcade physics
			this.game.physics.arcade.enable(lava); 
			// Set a property to make sure it won't move 
			lava.body.immovable = true;
			
			//lavaTile=lava;
			this.lavaTile.push(lava);
		}
		
		
		// Set all the walls to be immovable
		this.walls.setAll('body.immovable', true);

		
		this.game.world.setBounds(0, 0, gameWidth, totalHeight);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
        cursors = this.game.input.keyboard.createCursorKeys();

		
		
		this.player = new Player(this);
		this.enemy = new Enemy(this);
		
		this.play = this.game.add.button(totalWidth - 70, totalHeight - 70, 'play', playStop, this);
		this.trash = this.game.add.button(totalWidth - 123, totalHeight - 70, 'trash', clearCommands, this, 0, 0, 1);

	    //game.camera.deadzone = new Phaser.Rectangle(100, 100, 600, 400)


		// Programming blocks
		var blockNames = ['up', 'down', 'left', 'right', 'sword', 'loop'];
		for (var i = 0; i < blockNames.length; ++i) {
			var blockName = blockNames[i];
			var item = this.game.add.sprite(gameWidth + 8 + 56 * (i % 7), 14 + 62 * Math.trunc(i / 7), blockName);
			item.inputEnabled = true;
			item.input.enableDrag(true);
			item.x0 = item.x;
			item.y0 = item.y;
			item.original = true;
			item.events.onDragStop.add(fixLocation);
		}
		
        this.popup = new PopupWindow(this, 50, 50, 500, 400);

		//This will add virtual keys on the game board
        //this.vGamePad = new VGamePad(this);
        this.controlManager = new ControlManager(this);


        //Creating and adding commands to the console
        this.console = new Console(this);		
    }
	
	function playStop (button, pointer, isOver) {
		// Stop
		if (button.frame == 1) {
			button.frame = 0;
			this.player.ResetPosition();
			this.console.callback = null;
			this.console.StopCommands();
		}
		// Play
		else {
			button.frame = 1;
			this.player.ResetPosition();
			
			if (currentBlocks.length > 0) {
				this.console.ClearCommands();
				// Go through the blocks and add them to console
				for (var i = 0; i < currentBlocks.length; ++i) {
					var command = blockToCommand(currentBlocks[i]);
					if (command == 'loopOpen') {
						var endIndex = currentBlocks.indexOf(currentBlocks[i].partner);
						executeLoop(i, endIndex, this.console, 0);
						i = endIndex;
					}
					else {
			        	this.console.AddCommand(command + ':1');
					}	
		    	}
            	this.console.StartCommands(function() {
					button.frame = 0;
				});
			}
			else {
				button.frame = 0;
			}
		}
	}

	function clearCommands() {
		for(var i = 0; i < currentBlocks.length; ++i) {
			if (currentBlocks[i].text)
				currentBlocks[i].text.destroy();
			currentBlocks[i].destroy();
		}
		currentBlocks.length = 0;
		updateCurrentBlocks();
	}

	function executeLoop(startIndex, endIndex, console, innerNum) {
	
		var endItem = currentBlocks[endIndex];
		// Number of loops
		for (var i = 0; i < endItem.loops; ++i) {
			// Go through each loop
			for (var j = 1; j < endIndex - startIndex; ++j) {
				var command = blockToCommand(currentBlocks[startIndex + j]);
				if (command == 'loopOpen') {
					var innerEndIndex = currentBlocks.indexOf(currentBlocks[j].partner);
					executeLoop(j, innerEndIndex, console, innerNum+1);
					j = innerEndIndex;
				}
				else {
					console.AddCommand(command + ':1');
				}
			}
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
			
			var closeLoop;
			if (item.key == 'loop') {
				item.destroy();
				item = that.game.add.sprite(item.x, item.y, 'loopOpen');
				item.inputEnabled = true;
				item.input.enableDrag(true);
				item.original = false;
				item.events.onDragStop.add(fixLocation);
				item.events.onInputDown.add(function() {
					if (item.loops > 0)
						item.loops -= 1;
					closeLoop.loops = item.loops;
				});
				
				closeLoop = that.game.add.sprite(item.x, item.y, 'loopClose');
				closeLoop.inputEnabled = true;
				closeLoop.input.enableDrag(true);
				closeLoop.original = false;
				closeLoop.events.onDragStop.add(fixLocation);
				closeLoop.events.onInputDown.add(function() {
					if (closeLoop.loops < 99)
						closeLoop.loops += 1;
					item.loops = closeLoop.loops;
				});
				
			    var text = "0";
			    var style = { font: "18px Arial", fill: "#ffffff", align: "center" };
			    var t0 = that.game.add.text(0, 0, text, style);
			    var t1 = that.game.add.text(0, 0, text, style);
				
				item.partner = closeLoop;
				item.text = t0;
				item.loops = 0;
				closeLoop.partner = item;
				closeLoop.text = t1;
				closeLoop.loops = 0;
			}
			
			currentBlocks.push(item);
			var oldIndex = currentBlocks.indexOf(item);
			var newIndex = getBlockIndex(item);
			currentBlocks.move(oldIndex, newIndex);
			
			if (closeLoop) {
				currentBlocks.push(closeLoop);
				currentBlocks.move(currentBlocks.length - 1, newIndex + 1);
			}
		}
		// Moved a fresh block outside the bottom coding area
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
			
			if (item.partner) {
				var j = currentBlocks.indexOf(item.partner);
				if (j != -1) {
					currentBlocks.splice(j, 1);
				}
				item.text.destroy();
				item.partner.text.destroy();
				item.partner.destroy();
			}
			
			item.destroy();
		}
		// Moved an old block around in the coding area
		else {
			var oldIndex = currentBlocks.indexOf(item);
			var newIndex = getBlockIndex(item);
			
			// It's a loop
			if (item.partner) {
				// Make sure you're not moving a loop on the other side of an existing loop
				var crossLoop = false;
				for (var i = 1; i <= Math.abs(newIndex - oldIndex); ++i) {
					var sign = Math.sign(newIndex - oldIndex);
					var index = Math.trunc(i * sign + oldIndex);
					var key = currentBlocks[index].key;
					if (key == 'loopClose' || key == 'loopOpen') {
						crossLoop = true;
					}
				}
				
				if (item.key == 'loopClose' && currentBlocks.indexOf(item.partner) < newIndex && !crossLoop) {
					currentBlocks.move(oldIndex, newIndex);
				}
				else if (item.key == 'loopOpen' && currentBlocks.indexOf(item.partner) > newIndex && !crossLoop) {
					currentBlocks.move(oldIndex, newIndex);
				}
			}
			else {
				currentBlocks.move(oldIndex, newIndex);
			}
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
			
			if (item.text) {
				item.text.text = item.loops;
				switch (item.key) {
					case 'loopClose':
						item.text.x = item.x + 8;
						item.text.y = item.y + 24;
						item.text
						break;
					case 'loopOpen':
						item.text.x = item.x + 24;
						item.text.y = item.y + 8;
						break;
					default:
						break;
				}
			}
		}		
	}

    ///Called every frame for updating
    function Update() {

        if(!this.isGamePaused) {
            /*if (this.controlManager.IsArrowKeyUp_Pressed()) {
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
            }*/

            this.console.Update(1);
        }
        this.player.Update();

		if(this.game.physics.arcade.collide(this.player.sprite, this.enemy.sprite))
		{
			this.console.StopCommands();
			this.enemy.isAlive = false;
			this.popup.Show("CONGRATS!\r\nYou beat the level");
		}
    }

	this.ranFirstCommand = false;
    ///Called every frame for drawing
	this.blockOffset = 0;
    function Render() {
        this.popup.Render();

		if(this.console.isRunningCommands)
		{
			var index = this.console.currentCommandIndex;
			var block = currentBlocks[index];
			if(!this.ranFirstCommand)
			{
				this.graphics = this.game.add.graphics(0,0);
				this.graphics.lineStyle(3, 0x00FFFF, 1);

				this.ranFirstCommand = true;
				this.previousCommand = -1;
				this.blockOffset = 0;
				this.graphics.drawRect(block.x, block.y, block.width, block.height);
			}
			if (this.previousCommand < index && index < currentBlocks.length)
			{
				//block = currentBlocks[index - this.blockOffset];
				//this.graphics.clear();
				if(currentBlocks[index].key.indexOf("loopOpen") >= 0) {
					++this.blockOffset;
				}

				if((index + this.blockOffset) <= currentBlocks.length - 1) {
					//block = currentBlocks[index + this.blockOffset];
					this.graphics.drawRect(block.position.x, block.position.y, block.width, block.height);
				}

				this.previousCommand = index;
			}
		}
    }
	
	function blockToCommand(item) {
		var command = '';
		switch (item.key) {
			case 'up':
				command = 'MoveUp';
				break;
			case 'down':
				command = 'MoveDown';
				break;
			case 'left':
				command = 'MoveLeft';
				break;
			case 'right':
				command = 'MoveRight';
				break;
			case 'bow':
				break;
			case 'sword':
				command = 'SwordAttack';
				break;
			case 'loopOpen':
				command = 'loopOpen';
				break;
			case 'loopClose':
				command = 'loopClose';
				break;
			default:
				break;
		}
		return command;
	}

	function isWinConditionReached()
	{
		if((typeof this.enemy != 'undefined') && !this.enemy.isAlive)
		{
			return true;
		}
		return false;
	}
};



//this = this.game.add.sprite(12,12,'playerAnimation');


var Player = function(game1) {
    this.game = game1;
    this.sprite = game1.game.add.sprite(12,12,'playerAnimation');
    this.sprite.angle = 0;
    this.sprite.rotation = 0;
    this.sprite.anchor.setTo(0.5, 0.5);
	
	this.sprite.animations.add( 'walk_left',  Phaser.Animation.generateFrameNames('walkLeft.' , 1 ,  8, ''), 10, true);
	this.sprite.animations.add( 'walk_right',  Phaser.Animation.generateFrameNames('walkRight.' , 1 ,  8, ''), 10, true);
	this.sprite.animations.add( 'walk_up',  Phaser.Animation.generateFrameNames('walkUp.' , 1 ,  8, ''), 10, true);
	this.sprite.animations.add( 'walk_down',  Phaser.Animation.generateFrameNames('walkDown.' , 1 ,  8, ''), 10, true);
	this.sprite.animations.add( 'die',  Phaser.Animation.generateFrameNames('die.' , 0 ,  8, ''), 10, true);
	this.sprite.animations.add( 'attack_left',  Phaser.Animation.generateFrameNames('attackLeft.' , 0 ,  8, ''), 10, true);
	this.sprite.animations.add( 'attack_right', Phaser.Animation.generateFrameNames('attackRight.' , 0 ,  8, ''), 10, true);
	this.sprite.animations.add( 'attack_up',  Phaser.Animation.generateFrameNames('attackUp.' , 0 ,  8, ''), 10, true);
	this.sprite.animations.add( 'attack_down', Phaser.Animation.generateFrameNames('attackDown.' , 0 ,  8, ''), 10, true);
	this.sprite.animations.add( 'left_idle', Phaser.Animation.generateFrameNames('walkLeft.' , 0 , 0, ''), 10, true);
	this.sprite.animations.add( 'right_idle', Phaser.Animation.generateFrameNames('walkRight.' , 0 ,  0, ''), 10, true);
	this.sprite.animations.add( 'up_idle', Phaser.Animation.generateFrameNames('walkUp.' , 0 ,  0, ''), 10, true);
	this.sprite.animations.add( 'down_idle', Phaser.Animation.generateFrameNames('walkDown.' , 0 ,  0, ''), 10, true);

	this.sprite.animations.play('down_idle', true);
	
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
	
	this.game.physics.arcade.collide(this.player, this.game.walls);

	for(var i = 0; i < this.game.lavaTile.length; ++i)
	{
		if(this.game.physics.arcade.collide(this.sprite, this.game.lavaTile[i]))
		{
			this.game.console.StopCommands();
			this.game.popup.Show("TRY AGAIN\r\nDeath by lava");
		}
	}
};

Player.prototype.MoveUp = function(){
    this.yDir -= 1;
	this.sprite.animations.play('walk_up', true);
	
	this.ResetStatus();
	this.up = true;
};
Player.prototype.MoveDown = function(){
    this.yDir += 1;
	this.sprite.animations.play('walk_down', true);
	
	this.ResetStatus();
	this.down = true;
};
Player.prototype.MoveLeft = function(){
    this.xDir -= 1;
	this.sprite.animations.play('walk_left', true);
	
	this.ResetStatus();
	this.left = true;
};
Player.prototype.MoveRight = function(){
    this.xDir += 1;
	this.sprite.animations.play('walk_right', true);
	
	this.ResetStatus();
	this.right = true;
};
Player.prototype.ResetPosition = function () {
	this.sprite.position.x = 30;
	this.sprite.position.y = 0;
	
	this.sprite.animations.play('down_idle', true);
};
Player.prototype.ResetStatus = function (){
	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;
	this.attacking = false
}
Player.prototype.Attack = function () {
	this.attacking = true;
	if (this.right)
		this.sprite.animations.play('attack_right', true);
	else if (this.left)
		this.sprite.animations.play('attack_left', true);
	else if (this.up)
		this.sprite.animations.play('attack_up', true);
	else
		this.sprite.animations.play('attack_down', true);		
};


Enemy = function(game1, x_start, y_start)
{
	this.game = game1;
	this.x_pos = x_start;
	this.y_pos = y_start;
	this.isAlive = true;
	
	this.sprite = game1.game.add.sprite(200,200,'enemy1Animation');
	
	this.sprite.animations.add( 'walk_left',  Phaser.Animation.generateFrameNames('walkLeft.' , 1 ,  8, ''), 10, true);
	this.sprite.animations.add( 'walk_right',  Phaser.Animation.generateFrameNames('walkRight.' , 1 ,  8, ''), 10, true);
	this.sprite.animations.add( 'walk_up',  Phaser.Animation.generateFrameNames('walkUp.' , 1 ,  8, ''), 10, true);
	this.sprite.animations.add( 'walk_down',  Phaser.Animation.generateFrameNames('walkDown.' , 1 ,  8, ''), 10, true);
	this.sprite.animations.add( 'die',  Phaser.Animation.generateFrameNames('die.' , 0 ,  8, ''), 10, true);
	this.sprite.animations.add( 'attack_left',  Phaser.Animation.generateFrameNames('attackLeft.' , 0 ,  8, ''), 10, true);
	this.sprite.animations.add( 'attack_right', Phaser.Animation.generateFrameNames('attackRight.' , 0 ,  8, ''), 10, true);
	this.sprite.animations.add( 'attack_up',  Phaser.Animation.generateFrameNames('attackUp.' , 0 ,  8, ''), 10, true);
	this.sprite.animations.add( 'attack_down', Phaser.Animation.generateFrameNames('attackDown.' , 0 ,  8, ''), 10, true);
	this.sprite.animations.add( 'left_idle', Phaser.Animation.generateFrameNames('walkLeft.' , 0 , 0, ''), 10, true);
	this.sprite.animations.add( 'right_idle', Phaser.Animation.generateFrameNames('walkRight.' , 0 ,  0, ''), 10, true);
	this.sprite.animations.add( 'up_idle', Phaser.Animation.generateFrameNames('walkUp.' , 0 ,  0, ''), 10, true);
	this.sprite.animations.add( 'down_idle', Phaser.Animation.generateFrameNames('walkDown.' , 0 ,  0, ''), 10, true);

	this.sprite.animations.play('down_idle', true);

	this.game.physics.arcade.enable(this.sprite);

	this.Update = function(elapsedTime) {

	}

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
		this.game.ranFirstCommand = false;
		if(!(typeof this.game.graphics === 'undefined')) {
			this.game.graphics.clear();
		}
		if (this.callback) {
			this.callback();
		}
    };

    this.Update = function(elapsedTime)
    {
		if(this.isRunningCommands && this.commandsToRun.length <= 0)
		{
			this.StopCommands();
		}
        else if(this.isRunningCommands) {
            var currentCommand = this.commandsToRun[this.currentCommandIndex];

            var c = currentCommand.split(":");

            var command = c[0];
            var duration = parseInt(c[1]) * 5;

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
			case "SwordAttack":
				this.game.player.Attack();
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