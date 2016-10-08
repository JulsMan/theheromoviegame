/// <reference path="player.js" />
ig.module('game.entities.skeleton')

.requires(
    'impact.entity'
)

.defines(function () {
    EntitySkeleton = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/monsters-32x32.png', 32, 32),
        size: { x: 32, y: 32 },
        friction: { x: 600, y: 600 },
        maxVel: { x: 35, y: 35 },
        collides: ig.Entity.COLLIDES.ACTIVE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        stats: function () {
            return {
                health: 15,
                hp: 15,
                attack: 6,
                ac: 13,
                armor: 2
            };
        },
        SFX:
            {
                hit: function () {
                    var r = Math.floor(Math.random() * (2 - 1) + 2);
                    if (r == 1) {
                        var sfx = new ig.Sound('media/sound/monstergrunt1.*');
                        sfx.volume = 0.9;
                        sfx.play();
                    }
                    else {
                        var sfx = new ig.Sound('media/sound/monstergrunt1.*');
                        sfx.volume = 0.9;
                        sfx.play();
                    }
                },
                die: function () {
                    var sfx = new ig.Sound('media/sound/thunder.*');
                    sfx.volume = 0.9;
                    sfx.play();
                },
                miss: function(){
                    var sfx = new ig.Sound('media/sound/miss4.*');
                    sfx.volume = 0.9;
                    sfx.play();
                },
                block: function () {
                    var sfx = new ig.Sound('media/sound/sword1.*');
                    sfx.volume = 0.9;
                    sfx.play();
                }
            },
        health: 15,
        name: 'Skeleton',
        pic: new ig.Image('media/skeleton_warrior.png'),
        


        init: function (x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 0.5, [12, 13, 12, 14]);
            this.addAnim('down', 0.3, [12, 13, 14]);
            this.addAnim('up', 0.3, [18, 19, 20]);
            this.addAnim('left', 0.3, [21, 22, 23]);
            this.addAnim('right', 0.3, [15, 16, 17]);
        },

        update: function () {
            this.currentAnum = this.anims.idel;
            this.parent();
        },


        check: function (other) {
            if (other.name == 'hero') {
                other.fight(this, '');
            }

        }, 
        
        special: function( player, combatClass  ){
            // skeletons have no special abilities
            return null;
        },

        drop: function () {
            // where the mob was standing should be some reward...
            var coins = Math.floor(Math.random() * (12 - 2) + 2);
            ig.game.spawnEntity(EntityCoin, this.pos.x, this.pos.y, { value: coins });

            var sfx = new ig.Sound('media/sound/coin_jingle.*');
            sfx.volume = 0.9;
            sfx.play();
        }







    });
});

