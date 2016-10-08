ig.module('game.entities.chest')

.requires(
    'impact.entity'
)

.defines(function () {
    EntityChest = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/treasure_chest.png', 32, 32),
        size: { x: 32, y: 32 },
        friction: { x: 600, y: 600 },
        //maxVel: { x: 35, y: 35 },
        collides: ig.Entity.COLLIDES.FIXED,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        open: false,
        runonce: function () {
            // THIS IS A GOOD PLACE TO DO SOME CHECKS AFTER EVERYTHING IS INITALIZED...

            // check if the player has already taken the treasure from 
            // this chest, if he has then mark the chest as open.
            //var player = ig.game.getEntitiesByType('EntityPlayer')[0];

            // weltmeister is giving an error at: player != undefined
            try{
                var player = ig.game.getEntitiesByType(EntityPlayer)[0];
                if (player != undefined && player.inventory().contains(this.name)) {
                    this.open = true;
                }
            }
            catch (ex) { }

        },
        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.4, [48]);
            this.addAnim('close', 0.4, [48]);
            this.addAnim('open', 0.5, [60, 72, 84], true); // stop at the last frame

            try {
                setTimeout(this.runonce, 333);
            }
            catch (ex) { }
        },

        update: function () {
            if (this.open == false) {
                this.currentAnum = this.anims.close;
            }
            else {
                this.currentAnum = this.anims.open;
            }
            this.parent();
        },


        check: function (other) {
            if (other.name == 'hero') {
                //other.contactWith(this);

                if (this.locked == undefined || this.locked == false) {
                    //if (open==false) {

                    if (this.open == false) {
                        this.currentAnim = this.anims.open;
                        var sfx = new ig.Sound('media/sound/latch.*');
                        sfx.volume = 0.9;
                        sfx.play();
                    }
                    

                    // 1st time opening it, take what is in the chest 
                    if (this.open == false && other.inventory().contains(this.name) == false) {
                        try {
                            this.reward(other);
                        } catch (err) { }

                    }
                   
                    this.open = true;
                }
                else {
                    // chest is locked
                }
               
            }

        },



        /**
        * Chests can have the following, set individually on the properties
        * of the chest through Weltmeister.
        * 
        * This function performs the reward
        **/

       

        reward: function (other) {

            var showme = 'You found';

            // reward: coins
            if (this.coins != undefined && this.coins != NaN) {
                if (this.item != undefined || this.key != undefined || this.spell != undefined || this.quest != undefined) {
                    // there is something more important then coins to show off
                    other.addCoins(this.coins, false);
                }
                else {
                    other.addCoins(this.coins);
                }
            }

            
            // check for key, spell, quest, and item
            // isaiah is awesome
            if (this.key != undefined) {
                var kk = new keys[this.key];

                if (kk != undefined)
                {
                    showme += ' 1 key';
                    other.keychain(kk);
                }
            }



            if (this.spell != undefined) {
                var ss = new spells[this.spell];
                if (ss != undefined) {
                    showme += ' 1 spell';
                    other.spellbook(ss);
                }
            }


            if (this.quest != undefined) {
                var qq = new quests[this.quest];
                if (qq != undefined) {
                    showme += ' 1 quest';
                    other.questlog(qq);
                }
            }


            if (this.item != undefined) {
                var ii = new items[this.item];
                if (ii != undefined) {
                    showme += ' ' + ii.name;
                    other.inventory(ii);
                }
            }
            


            // reward: trap!
            // this hurts the hero
            if (this.trap != undefined && this.trap != NaN) {
                this.damage(this.trap)
            }

            // spawns a monster or a gaurdian for this chest
            if (this.spawn != undefined) {

            }


            var bubbleName = this.name + 'Bubble';
            var parameters = {
                text: showme,
                tracks: other.name, margin: 0, lifeSpan: 2, shape: 'square', name: bubbleName, color: [255, 128, 64]
            };
            ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);
        },







    });
});