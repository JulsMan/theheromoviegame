ig.module( 
	'game.main' 
)
.requires(
    'impact.game',
    'impact.font',
    'plugins.lawnchair.impact-plugin',
    'game.levels.throneroom',
    'game.levels.southrond',
    'game.levels.castle2',
    'game.levels.demoncave1',
    'game.levels.southrond_town',
    'game.entities.levelchange',
    'game.entities.guard',
    'game.entities.coin',
    'game.entities.demon',
    'impact.sound',
    'plugins.chatbubble',
    'plugins.hud'
    
)
.defines(function(){


   
    

    // THIS IS HERE AND NOT ON THE PLAYER BECAUSE IT IS 
    // GLOBAL AND NEEDS TO LAST THROUGH LEVELS...
 var myHeroGame = ig.Game.extend({
     currentLevel: null,
     font: new ig.Font('media/04b03.font.png'),
     hud: new ig.hud(),
     //introMusic: new ig.Sound(),
     store: new ig.Lawnchair(
         { adaptor: 'dom', table: 'playerController' },
         function () { ig.log('Initialized Lawnchair'); }),
     playerController: {
         startPosition: null,
         stats:
             {
             coins: 0, health: 30, hp: 30, ac: 13,
             health_bonus: 0, kills: 0, attack: 8,
             attack_bonus: 0, defense: 0, defense_bonus: 0, keys: 0,
             mana_max: 10, mana: 10

         },
         questLog: [],
         inventory: [],
         save: function () {
             store.save({ 'playerController': playerController });
         },
         load: function () {
             var pc = store.get('playerController');
             if (pc != null)
             {
                 playerController = pc;
             }
         },
         loadLevel: function (levelName, outx, outy) {

             if (levelName == undefined || levelName == null || levelName == '') {
                 levelName = ig.global[ig.game.currentLevel];
             }
             levelName = levelName.replace(/^(Level)?(\W)(\W)*/, function (m, l, a, b) { a.toUpperCase() + b; });
             levelName = this.ucfirst(levelName);
             ig.game.loadLevelDeferred(ig.global['Level' + levelName]);

             ig.game.currentLevel = levelName;


             
             // outy and outx say where in the next level this person should be placed

             if (outx != undefined && outy != undefined) {
                 var player = ig.game.getEntitiesByType(EntityPlayer)[0];
                 player.levelStartPosition(outx, outy);
             }

             ig.music.stop();

             // change the music
             switch (levelName) {
                 case 'Throneroom':
                     ig.music.play(levelName.toLowerCase());
                     break;
                 case 'Southrond':
                     ig.music.play(levelName.toLowerCase());
                     break;
                 case 'Southrond_town':
                     ig.music.play('town');
                     break;
                 default:
                     break;

             }
         },
         ucfirst: function (str) {

             str += '';
             var f = str.charAt(0).toUpperCase();
             return f + str.substr(1);
         },
     },


    

	init: function () {

	    // INVENTORY/SPELL BUTTON
	    ig.input.bind(ig.KEY.I, 'inventory');

        // MOUSE BUTTONS
	    ig.input.bind(ig.KEY.MOUSE1, 'click');

        /*  KEY BINDING*/
	    // bind keys
	    ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
	    ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
	    ig.input.bind(ig.KEY.UP_ARROW, 'up');
	    ig.input.bind(ig.KEY.DOWN_ARROW, 'down');

        //bind left keys
	    ig.input.bind(ig.KEY.A, 'left');
	    ig.input.bind(ig.KEY.D, 'right');
	    ig.input.bind(ig.KEY.W, 'up');
	    ig.input.bind(ig.KEY.S, 'down');
	    ig.input.bind(ig.KEY.X, 'action');
	    ig.input.bind(ig.KEY.SPACE, 'action');

	    /*  LOAD MUSIC  */
	    ig.music.add('media/music/castle.*', 'throneroom');
	    ig.music.add('media/music/Town.*', 'town');
	    ig.music.add('media/music/Unknown_place.*', 'southrond');
	    ig.music.add('media/music/Middle_age_RPG_Theme_2.*', 'smathel');
	    ig.music.add('media/music/fight.*', 'fight');

	    ig.music.volume = 0.3;
	    ig.music.loop = true;
	    ig.music.play('throneroom');
	    
	 
	   

	    this.loadLevel(ig.global.LevelThroneroom);
	    ig.game.currentLevel = 'Throneroom';
	},

	update: function () {
	    this.parent();

	    var player = this.getEntitiesByType(EntityPlayer)[0];
	    if (player) {
	        this.screen.x = player.pos.x - ig.system.width / 2;
	        this.screen.y = player.pos.y - ig.system.height / 2;
	    }
	},

	draw: function () {
	    this.parent();
	},

});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
 ig.main('#canvas', myHeroGame, 60, 640, 480, 2 );

});
