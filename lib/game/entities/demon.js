ig.module('game.entities.demon')

.requires(
    'impact.entity'
)

.defines(function () {
    EntityDemon = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/monsters-32x32.png', 32, 32),
        size: { x: 32, y: 32 },
        friction: { x: 10, y: 10 },
        maxVel: { x: 35, y: 35 },
        collides: ig.Entity.COLLIDES.ACTIVE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        stats: { hp: 20, attack: 6, ac: 16, armor: 1 },
        health: 8,
        npc: 'Demon',
        pic: new ig.Image('media/skeleton_warrior.png'),
       

        init: function (x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 0.5, [36,37,36,38,36]);
            this.addAnim('down', 0.3, [36,37,38]);
            this.addAnim('up', 0.3, [42,43,44]);
            this.addAnim('left', 0.3, [45,46,47]);
            this.addAnim('right', 0.3, [39, 40, 41]);
        },

        update: function () {
            this.currentAnum = this.anims.idel;
            this.parent();
        },


        //check: function (other) {
        //    if (other.name == 'hero') {
        //        other.contactWith(this);
        //    }

        //}

       





    });
});

