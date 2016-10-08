ig.module('game.entities.demonhead')

.requires(
    'impact.entity'
)

.defines(function () {
    EntityDemonhead = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/demon_head.png', 16, 16),
        size: { x: 16, y: 16 },
        friction: { x: 600, y: 600 },
        checkAgainst: ig.Entity.TYPE.A,
        type: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.ACTIVE,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.4, [0, 1, 2, 3]);
        },

        update: function () {
            this.currentAnum = this.anims.idel;
            this.parent();
        },

        check: function (other) {
            if (other.name == 'hero') {
                // add demon head to inventory
                other.inventory().push(new items['demonhead']);

                this.kill();
            }
        }
    });
});