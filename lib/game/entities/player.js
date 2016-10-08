ig.module('game.entities.player')

.requires(
  'impact.entity', 
  'plugins.dialog',
  'plugins.chatbubble',
  'plugins.combat'
)

.defines(function () {
   
    EntityPlayer = ig.Entity.extend({

        /* ImpactJS Properties */
        animSheet: new ig.AnimationSheet('media/sprites_hero.png', 24, 32),
        maxVel: {x:50, y:50 },
        size: { x: 24, y: 30 }, // changed y from 32 to 30 so sprite fits in small passages
        levelLoadPosition: null,
        offset: { x: 0, y: 2 },
        name: 'hero',
        friction:{x:600, y:600},
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        speed: 100,
        direction: 0,

        /* ImpactJS Functions */
        init: function (x, y, settings) {

            this.parent(x, y, settings);

            this.addAnim('idleleft', 1, [10]);
            this.addAnim('idleright', 1, [4]);
            this.addAnim('idleup', 1, [1]);
            this.addAnim('idledown', 1, [7]);
            this.addAnim('left', 0.3, [9, 10, 11, 10]);
            this.addAnim('right', 0.3, [3, 4, 5, 4]);
            this.addAnim('up', 0.3, [0, 1, 2, 1]);
            this.addAnim('down', 0.3, [6, 7, 8, 7]);

            try {
                // try catch this for WELTMIESTER
                var startxy = this.levelStartPosition();        // loads and removes it from stack
                if (startxy != undefined && startxy != null) {
                    this.pos.x = startxy.x;
                    this.pos.y = startxy.y;
                }
            } catch (Ex) { }



            // every 30 seconds gain 1 pt health if needed.
            setInterval(this.__healthReGen, 30000);

            try {
                /* PLACE ANY STARTING INVENTORY, INCLUDING SPELLS HERE*/
                // weltmeister is giving an error here
                // apply any starting spells...
                //this.spellbook(new spells['LesserHeal']);
                //this.spellbook(new spells['ChainLightning']);
            }
            catch (ex) { }


        },
        update: function () {

            if (this.pause == true && ig.input.state('action')) {
                // pause is true and keyboard is action .. then remove the pause and continue
                this.pause = false;
                if (this.talking != null)
                    this.talking.kill();
            }
            else if (this.pause == true) {
                this.parent();
                return;
            }

            if (ig.input.state('inventory')) {
                onInventoryShow();
                $("#inventoryWindow").dialog("open");
            }

            if (ig.input.state('left') || ig.input.state('right') || ig.input.state('up') || ig.input.state('down')) {
                // is walking...
                this.walkCount++;

                // make walking sound...
                if (this.walkCount % 30 == 0) {
                    var steppingOn = ig.game.backgroundMaps[0].getTile(this.pos.x, this.pos.y);
                    this.__walkSFX(steppingOn);
                    this.walkCount++;
                }

                // clear dialog if its not important dialog...
                if (this.talking != null) {
                    this.talking.kill();
                    this.talking = null;
                }

                // if player is in a cave, move a layer of darkness
                // adjust the size of the layer if the player is carying a torch
                if (ig.game.currentLevel == 'demoncave1') {
                    this.drawDarkness(1.5);
                }

            }

            if (ig.input.state('left')) {
                this.vel.x = -this.speed;
                this.currentAnim = this.anims.left;
                this.direction = 1;

            }
            else if (ig.input.state('right')) {
                this.vel.x = +this.speed;
                this.currentAnim = this.anims.right;
                this.direction = 3;


            }
            else if (ig.input.state('up')) {
                this.vel.y = -this.speed;
                this.currentAnim = this.anims.up;
                this.direction = 2;

            }
            else if (ig.input.state('down')) {
                this.vel.y = +this.speed;
                this.currentAnim = this.anims.down;
                this.direction = 4;
            }
            else if (ig.input.state('action')) {
                if (this.talking != null) {
                    // kill any dialog...
                    this.talking.kill();
                    this.talking = null;
                }
            }
            else {

                switch (this.direction) {
                    case 1:
                        this.currentAnim = this.anims.idleleft;
                        break;
                    case 2:
                        this.currentAnim = this.anims.idleup;
                        break;
                    case 3:
                        this.currentAnim = this.anims.idleright;
                        break;
                    default:
                        this.currentAnim = this.anims.idledown;
                        break;
                }
            }



            this.parent();
        },

        /* Game Properties */
        talking: null,
        talkingWith: null,
        pause: false,
        walkCount: 1,
        mapLevel: null,

        /* Game Functions */
        inventory: function ( item )
        {
            if (item == undefined)
                return ig.game.playerController.inventory;

            if (item.type == 'spell') {
                // no dups for spells
                this.spellbook(item);
            }
            else if (item.type == 'quest') {
                this.questlog(item);
            }
            else if (item.type == 'key') {
                this.keychain(item);
            }
            else {
                ig.game.playerController.inventory.push(item);
            }

            
            return ig.game.playerController.inventory;
        },
       
        misc: function(){
            return this.inventory().filter(__isMisc);
            function __isMisc(ii) {
                return ii.type != 'quest' && ii.type != 'key' && ii.type != 'spell';
            }
        },
        spellbook: function( item ){

            // spells can only be added once to the book
            if (item != undefined && item.type == 'spell' && this.inventory().containsItem(item) == false) {
                this.inventory().push(item);
            }
            return this.inventory().filter(__isSpell);
            function __isSpell(ii) {
                return ii.type == 'spell';
            }
        },
        questlog: function( item ){
            // quests can only be added once!
            if (item != undefined && item.type == 'quest' && this.inventory().containsItem(item) == false) {
                this.inventory().push(item);
            }
            return this.inventory().filter(__isQuest);
            function __isQuest(ii) {
                return ii.type == 'quest';
            }
        },
        keychain: function(item ){
            if (item != undefined && item.type == 'key' && this.inventory().containsItem(item) == false) {
                this.inventory().push(item);
            }

            return this.inventory().filter(__isQuest);
            function __isQuest(ii) {
                return ii.type == 'key';
            }
        },
        equiped: function ()
        {
            return ig.game.playerController.equiped;
        },
        stats: function()
        {
            return ig.game.playerController.stats;
        },
        addCoins: function (coins, bubble)
        {
            ig.game.playerController.stats.coins += coins;
            if (bubble == false) {
                var bubbleName = this.name + 'Bubble';
                var prefix = coins == 1 ? ' coin' : ' coins';
                var parameters = {
                    text: 'You got ' + coins + prefix,
                    tracks: this.name, margin: 0, lifeSpan: 5, shape: 'square', name: bubbleName, color: [255, 128, 64]
                };
                ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);
            }
            var sfx = new ig.Sound('media/sound/coin_jingle.*');
            sfx.volume = 0.9;
            sfx.play();
        },
        subtractCoins: function (coins, bubble) {
            ig.game.playerController.stats.coins -= coins;

            if (bubble == false) {
                var bubbleName = this.name + 'Bubble';
                var prefix = coins == 1 ? ' coin left' : ' coins left';
                var parameters = {
                    text: 'You got have ' + ig.game.playerController.stats.coins + prefix,
                    tracks: this.name, margin: 0, lifeSpan: 5, shape: 'square', name: bubbleName, color: [255, 128, 64]
                };
                ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);
            }
            var sfx = new ig.Sound('media/sound/coin_jingle.*');
            sfx.volume = 0.9;
            sfx.play();
        },
        removeInv: function (item) {

            var count = ig.game.playerController.inventory.length;
            for (var ii=0;ii< ig.game.playerController.inventory.length; ii++){
                var itm = ig.game.playerController.inventory[ii]; 
                if (itm == item || itm.name == item.name){
                    ig.game.playerController.inventory.splice(ii,1);
                }
            }

            if (count > ig.game.playerController.inventory.length) {
                var bubbleName = this.name + 'Bubble';
                var prefix = coins == 1 ? ' coin' : ' coins';
                var parameters = {
                    text: item.name + ' removed from inventory',
                    tracks: this.name, margin: 0, lifeSpan: 5, shape: 'square', name: bubbleName, color: [255, 128, 64]
                };
                ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);
                var sfx = new ig.Sound('media/sound/coin_jingle.*');
                sfx.volume = 0.9;
                sfx.play();
            }
        },
        damage:function( hp ){
            var health = this.stats().health;
            health -= hp;

            if (health <= 0) {
                // YOU ARE DEAD!!!
                return false;
            }
            else
            {
                // SHOW DAMAGE
                var bubbleName = this.name + 'Bubble';
                var parameters = {
                    text: hp + ' damage!',
                    tracks: this.name, margin: 0, lifeSpan: 1, shape: 'square', name: bubbleName, color: [255, 128, 64]
                };
                ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);
                var sfx = new ig.Sound('media/sound/punch1.*');
                sfx.play();
                return true;
            }
        },
        heal: function (hp){
            var health = this.stats().health;
            var maxhealth = this.stats().maxhealth;
            health += hp;
            if (health > maxhealth)
                health = maxhealth;

           
            var bubbleName = this.name + 'Bubble';
            var parameters = {
                text: hp + ' healed!',
                tracks: this.name, margin: 0, lifeSpan: 1, shape: 'square', name: bubbleName, color: [255, 128, 64]
            };
            ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);
            var sfx = new ig.Sound('media/sound/heal.*');
            sfx.play();
            
        },
        save: function()
        {
            ig.game.savePlayer();
        },
        load: function () {
            ig.game.loadPlayer();
        },
        fight: function ( enemy, text ) {
            this.talking = ig.game.spawnEntity(EntityCombat, 0, 0, enemy);
            this.talkingWith = enemy;
            this.pause = true;
        },
        combatFinished: function (player) {
            // check if im alive
            $("#combatWindow").dialog("close");
            
            // decide who needs to be dead

            var player = ig.game.getEntitiesByType('EntityPlayer')[0];
            player.talkingWith.kill();
            player.talking.kill();

            if (player.talking.currentTrack != null && player.talking.currentTrack != undefined) {
               
            var trackName = undefined;
            switch (player.talking.currentTrack) {
                case 0:
                    {
                        trackName = 'throneroom';
                        break;
                    }
                case 1:
                    {
                        trackName = 'town';
                        break;
                    }
                case 2:
                    {
                        trackName = 'southrond';
                        break;
                    }
                case 3:
                    {
                        trackName = 'smathel';
                        break;
                    }
                case 4:
                    {
                        trackName = 'fight';
                        break;
                    }
                default:
                    {
                        trackName = '';
                        break;
                    }
            }
                ig.music.volume = 0.3;
                ig.music.loop = true;
                ig.music.play(trackName);
                

            }
            else {
                ig.music.stop();
            }
            player.pause = false;

            // remmeber to take player out of interaction...
            player.talking = null;


            
        },
        contactWith: function (npc) {
            // we can't talk interact while another interaction is taking place!
            if (this.talking == null) {
                // trying something new here ... making named npc's talkable
                if (npc.name != undefined) {
                    $('#dialogWindow').dialog('open');
                }
                else
                {

                }


                return;


                // check if this NPC has a quest for me or if I am currently on a quest for this NPC
                var qq = this.questClass.checkRegisteredQuests(this, npc);
                if (qq != null)
                {
                    var iStatusOrCase = this.questClass.checkQuestStatus(this, qq);
                    switch (iStatusOrCase) {
                        case -1:
                            {
                                // active quest being worked on...
                                var txt = qq.chatDuringQuest(this, npc);
                                this.talking = ig.game.spawnEntity(EntityDialog, 0, 0, { text: txt });
                                this.pause = true;
                                break;
                            }
                        case 0:
                            {

                                // default to chitchat
                                if (npc.chitchat != null && npc.chitchat != undefined) {
                                    var talk = npc.chitchat[Math.floor(Math.random() * npc.chitchat.length)];
                                    this.talking = ig.game.spawnEntity(EntityDialog, 0, 0, { text: talk });
                                }
                                break;
                            }
                        default:
                            {
                                var sfx = new ig.Sound('media/sound/action1.*');
                                sfx.volume = 0.9;
                                sfx.play();
                                // i have a quest for you...
                                var txt = iStatusOrCase.awardText(this, npc);
                                this.talking = ig.game.spawnEntity(EntityDialog, 0, 0, { text: txt });
                                this.pause = true;
                                break;

                            }
                    }
                }

                // check for basic interactions ... does this person have anything to sell to me or can we get in a fight?
                else if (false) {

                }
                else {

                    if (npc.name == "dungeon_guard") {
                        // guard on second level of castle
                        if (npc.chitchat2 != null && npc.chitchat2 != undefined) {
                            var talk = npc.chitchat2[Math.floor(Math.random() * npc.chitchat2.length)];
                            this.talking = ig.game.spawnEntity(EntityDialog, 0, 0, { text: talk });
                            this.pause = true;

                        }
                    } else if ((npc.name == "helpful") && (EntityPlayer.inventory().contains('demonhead'))) {
                        // not sure if correct way to implement 
                        // hero has completed mud demon quest
                         this.questClass.completed = true;
                    } else {
                        // if not repeat something from the chitchat
                        if (npc.chitchat != null && npc.chitchat != undefined) {
                            var talk = npc.chitchat[Math.floor(Math.random() * npc.chitchat.length)];
                            this.talking = ig.game.spawnEntity(EntityDialog, 0, 0, { text: talk });
                            this.pause = true;

                        }
                    }
                }
            }
        },
        levelStartPosition: function (x, y) {
            var xy = ig.game.playerController.startPosition;

            if (x != undefined && y != undefined) {
                ig.game.playerController.startPosition = { 'x': x, 'y': y };
            }
            else {
                ig.game.playerController.startPosition = undefined;
            }
            
                return xy;
        },

        /* Private Members*/
        __walkSFX: function (tile){
            
            var sfx = undefined;
                switch(tile)
                {
                    case 24:    // STONE
                        sfx = new ig.Sound('media/sound/stepstone.*');
                        sfx.volume = 0.5;
                        break;
                    case 36:    // WATER
                        sfx = new ig.Sound('media/sound/stepwater.*');
                        sfx.volume = 0.7;
                        break;
                    default:    // DIRT
                        sfx = new ig.Sound('media/sound/stepdirt.*');
                        sfx.volume = 0.2;
                        break;
            }

                console.log("Tile:" + tile + " Player:{X:" + this.pos.x + " Y:" + this.pos.y + "}");
                sfx.play();
            },
        __healthReGen: function () {
            try
            {
                if (this.stats().health < this.stats().maxhealth) {
                    this.stats().health++;
                }

                if (this.stats().mana < this.stats().mana_max) {
                    this.stats().mana++;
                }
            }
            catch (Ex) { }
        },
        
        drawDarkness: function (x) {

            // if player is in a cave, move a layer of darkness
            // area of map that is visible
            var theIncrement = 32 * x;

            // demoncave1 map array
            var data = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 43, 43, 80, 44, 79, 44, 78, 77, 79, 77, 79, 78, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 43, 85, 87, 88, 7, 7, 8, 9, 9, 9, 8, 9, 78, 79, 78, 78, 78, 79, 79, 78, 0, 0, 78, 78, 78, 76, 0, 0, 0], [0, 43, 44, 43, 78, 44, 78, 77, 8, 76, 78, 76, 9, 8, 9, 9, 9, 8, 9, 9, 79, 0, 0, 76, 9, 8, 76, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 77, 8, 9, 76, 78, 78, 78, 78, 78, 78, 76, 8, 9, 78, 77, 76, 78, 9, 9, 77, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 77, 9, 8, 76, 9, 8, 7, 8, 9, 9, 78, 9, 9, 9, 9, 9, 9, 8, 9, 76, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 78, 9, 79, 76, 9, 76, 79, 79, 78, 79, 78, 7, 79, 78, 78, 79, 78, 9, 9, 76, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 77, 8, 76, 9, 9, 76, 8, 9, 8, 9, 9, 9, 9, 9, 9, 8, 76, 9, 9, 77, 0, 0, 0], [0, 78, 77, 77, 77, 77, 78, 77, 9, 80, 9, 76, 76, 9, 8, 76, 76, 76, 9, 77, 77, 77, 9, 79, 77, 9, 77, 0, 0, 0], [0, 80, 8, 9, 8, 9, 8, 9, 9, 7, 9, 9, 9, 8, 9, 78, 7, 9, 9, 9, 9, 77, 9, 9, 77, 7, 77, 0, 0, 0], [0, 78, 8, 76, 9, 8, 76, 76, 8, 9, 8, 78, 79, 79, 79, 78, 9, 9, 79, 9, 7, 9, 8, 9, 9, 9, 77, 0, 0, 0], [0, 77, 8, 77, 76, 77, 76, 9, 9, 8, 9, 7, 9, 8, 9, 9, 9, 8, 77, 9, 9, 9, 9, 76, 76, 76, 76, 0, 0, 0], [0, 78, 9, 76, 8, 9, 9, 9, 9, 8, 9, 78, 77, 77, 77, 77, 77, 80, 79, 76, 42, 79, 0, 77, 0, 0, 0, 0, 0, 0], [0, 77, 8, 76, 8, 77, 76, 76, 79, 78, 78, 79, 7, 9, 9, 9, 8, 9, 42, 8, 8, 9, 9, 42, 77, 0, 0, 0, 0, 0], [0, 76, 9, 76, 9, 76, 0, 0, 0, 0, 0, 76, 76, 9, 8, 9, 8, 9, 79, 9, 9, 9, 8, 9, 42, 0, 0, 0, 0, 0], [0, 78, 8, 76, 8, 76, 0, 0, 0, 0, 0, 0, 77, 9, 9, 9, 9, 9, 79, 42, 43, 43, 42, 43, 76, 0, 0, 0, 0, 0], [0, 78, 9, 9, 9, 76, 0, 0, 0, 0, 0, 0, 76, 76, 76, 77, 77, 77, 77, 76, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 78, 76, 78, 76, 76, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 76, 77, 79, 78, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 78, 9, 9, 42, 0], [0, 0, 0, 0, 0, 77, 76, 76, 78, 76, 76, 76, 76, 77, 76, 77, 0, 0, 0, 76, 76, 78, 76, 77, 76, 76, 8, 9, 77, 0], [0, 76, 76, 76, 76, 77, 9, 8, 9, 9, 76, 9, 9, 7, 8, 77, 0, 0, 0, 77, 9, 9, 8, 7, 9, 9, 9, 8, 78, 0], [0, 77, 9, 9, 8, 9, 7, 76, 8, 9, 76, 9, 79, 8, 9, 76, 0, 0, 0, 77, 8, 76, 77, 76, 76, 77, 7, 9, 77, 0], [0, 76, 9, 9, 9, 9, 9, 76, 8, 9, 78, 7, 76, 9, 8, 76, 0, 0, 0, 76, 9, 78, 0, 0, 0, 78, 78, 79, 77, 0], [0, 77, 8, 9, 9, 78, 79, 78, 9, 9, 80, 9, 76, 78, 76, 77, 0, 0, 0, 77, 8, 78, 0, 76, 76, 42, 76, 76, 0, 0], [0, 78, 9, 77, 76, 76, 9, 78, 78, 78, 79, 9, 9, 8, 9, 76, 0, 0, 0, 78, 7, 78, 79, 77, 9, 9, 9, 76, 0, 0], [0, 76, 9, 9, 8, 9, 9, 9, 7, 9, 8, 9, 8, 9, 77, 80, 0, 0, 0, 77, 9, 9, 76, 9, 76, 80, 8, 77, 0, 0], [0, 76, 9, 77, 78, 76, 78, 76, 78, 78, 78, 9, 9, 9, 77, 0, 0, 0, 0, 76, 78, 9, 8, 9, 9, 8, 9, 77, 0, 0], [0, 77, 77, 79, 0, 0, 0, 0, 0, 0, 78, 76, 79, 79, 79, 0, 0, 0, 0, 0, 78, 79, 76, 76, 76, 79, 76, 43, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];

            // demoncave1 stairs array
            var stairs = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];

            // save entities to array
            var chest = ig.game.getEntitiesByType('EntityChest');
            var door = ig.game.getEntitiesByType('EntityDoor');
            var coin = ig.game.getEntitiesByType('EntityCoin');
            var demon = ig.game.getEntitiesByType('EntityDemon');
            var skeleton = ig.game.getEntitiesByType('EntitySkeleton');
            var entity = [chest, door, coin, demon, skeleton];

            // loop through map array and redraw
            // more efficient way to do this?
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].length; j++) {
                    // if near player, draw map, otherwise draw darkness
                    // j specifies column, i specifies row
                    if ((j*32 < this.pos.x - theIncrement) || (j*32 > this.pos.x + theIncrement)){
                        // darkness
                        ig.game.backgroundMaps[0].setTile(j * 32, i * 32, 16);
                        ig.game.backgroundMaps[1].setTile(j * 32, i * 32, 16);  // stairs
                    } else if ((i*32 < this.pos.y - theIncrement) || (i*32 > this.pos.y + theIncrement)){
                        // darkness
                        ig.game.backgroundMaps[0].setTile(j * 32, i * 32, 16);
                        ig.game.backgroundMaps[1].setTile(j * 32, i * 32, 16);  // stairs
                    } else {
                        // map
                        ig.game.backgroundMaps[0].setTile(j * 32, i * 32, data[i][j]);
                        ig.game.backgroundMaps[1].setTile(j * 32, i * 32, stairs[i][j]);
                    }

                    // loop through entities
                    for (var y = 0; y < entity.length; y++) {
                        for (var x = 0; x < entity[y].length; x++) {
                            if ((entity[y][x].pos.x < this.pos.x - theIncrement) || (entity[y][x].pos.x > this.pos.x + theIncrement)) {
                                // hide entity
                                ig.game.backgroundMaps[2].setTile(entity[y][x].pos.x, entity[y][x].pos.y, 16);
                            } else if ((entity[y][x].pos.y < this.pos.y - theIncrement) || (entity[y][x].pos.y > this.pos.y + theIncrement)) {
                                // hide entity
                                ig.game.backgroundMaps[2].setTile(entity[y][x].pos.x, entity[y][x].pos.y, 16);
                            } else {
                                // entity is in view
                                // remove tile
                                ig.game.backgroundMaps[2].setTile(entity[y][x].pos.x, entity[y][x].pos.y, 0);
                            }
                        }
                    }

                }
            }


        },       

       

        
       
    });
});