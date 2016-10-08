ig.module('game.entities.torch')

.requires(
    'impact.entity'
)

.defines(function () {
    EntityTorch = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/torch.png', 32, 32),
        size: { x: 32, y: 32 },
        friction: { x: 600, y: 600 },
        //maxVel: { x: 35, y: 35 },
        collides: ig.Entity.COLLIDES.ACTIVE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.4, [1, 2, 3, 4]);

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