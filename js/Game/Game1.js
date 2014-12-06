/**
 * Created by Nate on 12/6/2014.
 */


///The main game class
Game1 = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: Preload, create: Create, update: Update, render: Render });

    var land;
    var logo;


    ///Called before the game is started
    ///Use to load the game assets
    function Preload() {
        game.load.image('logo', 'phaser.png');
    }

    ///Use to instantiate objects before the game starts
    function Create() {
        logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);

        //  Resize our game world to be a 2000 x 2000 square
        game.world.setBounds(-1000, -1000, 2000, 2000);

        land.fixedToCamera = true;

        
    }

    ///Called every frame for updating
    function Update() {

    }

    ///Called every frame for drawing
    function Render() {

    }

}