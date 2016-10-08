ig.module('game.entities.levelchange')


.requires('impact.entity', 'impact.sound')


.defines(function () {
    EntityLevelchange = ig.Entity.extend({
        _wmDrawBox: true, 
        _wmBoxColor: 'rbga(0,0,255,0.7)', 
        size: { x: 32, y: 32 },

        level:null,
        checkAgainst: ig.Entity.TYPE.A,
        update: function () { },
        check: function (other) {
            if (other instanceof EntityPlayer) {
                if (this.level) {
                    var player = ig.game.getEntitiesByType(EntityPlayer)[0];
                    
                    var levelName = this.level.replace(/^(Level)?(\W)(\W)*/, function (m, l, a, b) { a.toUpperCase() + b; });


                    if (this.outx != null && this.outy != null) {
                        other.levelStartPosition(this.outx, this.outy);
                    }

                    ig.game.playerController.loadLevel(levelName);
                    ig.game.currentLevel = this.level;
                   
                    }
                }
            },



        ucfirst: function (str) {
          //  discuss at: http://phpjs.org/functions/ucfirst/
          // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
          // bugfixed by: Onno Marsman
          // improved by: Brett Zamir (http://brett-zamir.me)
          //   example 1: ucfirst('kevin van zonneveld');
          //   returns 1: 'Kevin van zonneveld'

          str += '';
            var f = str.charAt(0)
              .toUpperCase();
            return f + str.substr(1);
        },
    });
});