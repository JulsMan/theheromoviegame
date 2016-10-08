ig.module('game.entities.stairs')

.requires(
    'impact.entity'
)

.defines(function () {
    EntityStairs = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/stairs1.png', 32, 32),
        size: { x: 32, y: 32 },
        friction: { x: 600, y: 600 },
        //maxVel: { x: 35, y: 35 },
        collides: ig.Entity.COLLIDES.NEVER,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,

        // entity might not be necessary
        // needs to be behind player
        // added a stairs layer that might work

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);

        },

        update: function () {
            this.currentAnum = this.anims.idel;
            this.parent();
        },

        check: function (other) {
            if (other.name == 'hero') {
                if (this.outx != null && this.outy != null) {
                    other.levelStartPosition(this.outx, this.outy);
                }
            }
        },


    });
});