ig.module('game.entities.coin')

.requires(
    'impact.entity'
)

.defines(function () {
    EntityCoin = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/coins.png', 16, 16),
        size: { x: 16, y: 16 },
        friction: { x: 600, y: 600 },
        checkAgainst: ig.Entity.TYPE.A,
        type: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.ACTIVE,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.4, [0,1,2]);
        },

        update: function () {
            this.currentAnum = this.anims.idel;
            this.parent();
        },

        check: function (other) {
            if (other.name == 'hero') {
                if (this.value == undefined || this.value == NaN) {
                    other.addCoins(1);
                }
                else {
                    other.addCoins(this.value);
                }
                
                this.kill();
            }
        }
    });
});