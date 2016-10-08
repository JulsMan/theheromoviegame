ig.module('game.entities.ogre')

.requires(
    'impact.entity'
)

.defines(function () {
    EntityOgre = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/monsters-32x32.png', 32, 32),
        size: { x: 32, y: 32 },
        friction: { x: 600, y: 600 },
        maxVel: { x: 35, y: 35 },
        collides: ig.Entity.COLLIDES.ACTIVE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        stats: function () {
            return  { 
                health:75, 
                hp:75, 
                attack: 6, 
                ac:10, 
                armor:3 
            };
        },
        health: 25,
        npc: 'Ogre',
        name: 'Ogre',
        pic: new ig.Image('media/skeleton_warrior.png'),
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
                       var sfx = new ig.Sound('media/sound/monstergrunt2.*');
                       sfx.volume = 0.9;
                       sfx.play();
                   }
               },
               die: function () {
                   var sfx = new ig.Sound('media/sound/thunder.*');
                   sfx.volume = 0.9;
                   sfx.play();
               },
               miss: function () {
                   var sfx = new ig.Sound('media/sound/miss4.*');
                   sfx.volume = 0.9;
                   sfx.play();
               },
               block: function () {
                   var sfx = new ig.Sound('media/sound/sword1.*');
                   sfx.volume = 0.9;
                   sfx.play();
               },
               special: function () {
                   var sfx = new ig.Sound('media/sound/Dark_Laugh.*');
                   sfx.volume = 0.9;
                   sfx.play();
               }
           },
        special: function (player) {
            // ogre's special ability is to re-generate health 1/10 chance to regen 
            // 1-10 health
            var roll = Math.floor(Math.random() * (10 - 1)) + 1;
            var regen = Math.floor(Math.random() * (10 - 1)) + 1;



            if (CombatClass._enemyHealth < 10) {
                if (roll <= 5) {
                    CombatClass._enemyHealth += regen;
                    if (CombatClass._enemyHealth > player.talkingWith.stats().hp) {
                        CombatClass._enemyHealth = player.talkingWith.stats().hp;
                    }

                    return "The ogre regenerates (" + regen + ") health";
                }
            }
            else
            {
                if (roll == 5 || roll == 6) {
                    CombatClass._enemyHealth += regen;
                    if (CombatClass._enemyHealth > player.talkingWith.stats().hp) {
                        CombatClass._enemyHealth = player.talkingWith.stats().hp;
                    }

                    return "The ogre regenerates (" + regen + ") health";
                }
            }


            // in this case the ogre did not heal himself, 
            // but if he is below 20 hp he might go bezerk
           
            if (CombatClass._enemyHealth < 30 || CombatClass._playerHealth < 15) {
                var bonus = CombatClass.roll(20);
                if (bonus >= player.stats().ac) {
                    // the ogre goes bezerk
                    var bez = CombatClass.roll(12, 6);
                    var foo = 'The ogre goes bezerk taking 2 damage and dealing ' + bez
                    CombatClass.damageNPC(2, '');
                    CombatClass.damageHero(bez, foo);
                }
            }


            return null;
        },
        drop: function () {
            // where the mob was standing should be some reward...
            var coins = Math.floor(Math.random() * (40 - 8) + 2);
            ig.game.spawnEntity(EntityCoin, this.pos.x, this.pos.y, { value: coins });

            var sfx = new ig.Sound('media/sound/coin_jingle.*');
            sfx.volume = 0.9;
            sfx.play();
        },

        init: function (x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 0.5, [24, 25, 26]);
            this.addAnim('down', 0.3, [24, 25, 26]);
            this.addAnim('up', 0.3, [30, 31, 32]);
            this.addAnim('left', 0.3, [33, 34, 35]);
            this.addAnim('right', 0.3, [27, 28, 29]);
        },

        update: function () {
            this.currentAnum = this.anims.idel;
            this.parent();
        },


        check: function (other) {
            if (other.name == 'hero') {
                other.fight(this, '');
            }
        }







    });
});