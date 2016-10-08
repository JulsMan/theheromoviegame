ig.module('game.entities.ghost')

.requires(
    'impact.entity'
)

.defines(function () {
    EntityGhost = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/monsters-32x32.png', 32, 32),
        size: { x: 32, y: 32 },
        friction: { x: 5, y: 5 },
        maxVel: { x: 35, y: 35 },
        collides: ig.Entity.COLLIDES.ACTIVE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        stats: function () {
            return { hp: 8, attack: 6, ac: 16, armor: 0 };
        },
        health: 8,
        npc: 'Ghost',
        pic: new ig.Image('media/skeleton_warrior.png'),


        init: function (x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 0.5, [0, 1, 0, 2]);
            this.addAnim('down', 0.3, [9, 10, 11]);
            this.addAnim('up', 0.3, [6, 7, 8]);
            this.addAnim('left', 0.3, [10, 11, 12]);
            this.addAnim('right', 0.3, [3, 4, 5]);
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

