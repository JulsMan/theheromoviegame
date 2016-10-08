ig.module('game.entities.textballoon'
)
.requires('impact.entity', 'impact.game'
)
.defines(function () {

    //    WordWrap = ig.Class.extend({
    //        text: "",
    //        maxWidth: 200,
    //        cut: false,
    //        init: function (text, maxWidth, cut) {
    //            this.text = text;
    //            this.maxWidth = maxWidth;
    //            this.cut = cut;
    //        },


    //        //        wrap: function () {
    //        //            var regex = '.{1,' + this.maxWidth + '}(\\s|$)' + (this.cut ? '|.{'
    //        //            + this.maxWidth + '}|.+$' : '|\\S+?(\\s|$)');
    //        //            return this.text.match(RegExp(regex, 'g')).join('\n');
    //        //        }

    //        wrap: function (text) {
    //            //            var regex = '.{1,' + this.maxWidth + '}(\\s|$)' + (this.cut ? '|.{'
    //            //            + this.maxWidth + '}|.+$' : '|\\S+?(\\s|$)');
    //            var regex = text.split('|');
    //            return this.text.match(RegExp(regex, 'g')).join('\n');
    //        }
    //    }),

    EntityTextballoon = ig.Entity.extend({

        text: 'Epic Conversation Goes Here!',
        pos: { x: 0, y: 0 }, // a default position
        size: { x: 240, y: 100 }, // the default size
        lifeTime: 200, // show the balloon for 200 frames
        //media used by text balloon
        font: new ig.Font('media/font.png'), // the font sheet
        animSheet: new ig.AnimationSheet('media/gui_dialog.png', 260, 110), // the animation
        wrapper: null, // place holder

        wrap: function (text) {
            //            var regex = '.{1,' + this.maxWidth + '}(\\s|$)' + (this.cut ? '|.{'
            //            + this.maxWidth + '}|.+$' : '|\\S+?(\\s|$)');
            var regex = text.split('|');
            return regex.join('\n');
        },

        init: function (x, y, settings) {
            this.zIndex = 1000; // always show on top
            this.addAnim('idle', 1, [0]); // the default graphic
            this.currentAnim = this.anims.idle;
            this.parent(x, y, settings); // defaults
            this.pos.x = x;
            this.pos.y = y;
            this.text = typeof (settings) == 'string' ? settings : this.text;
            //this.wrapper = new WordWrap(settings, 25, '|'); //we only have one text so use it as a default
        },


        draw: function () {
            this.parent(); // defaults
            //            var x = this.pos.x - ig.game.screen.x + 5; // x coordinate draw position
            //            var y = this.pos.y - ig.game.screen.y + 5; // y coordinate draw position
            // (this.pos.x - 110), (this.pos.y + 60)
//            var player = ig.game.getEntityByName('TheHero');
//            var xx = (player.pos.x - ig.system.width / 2);
//            var yy = (player.pos.y - ig.system.height / 2);
            this.font.draw(this.wrap(this.text), player.pos.x, player.pos.y, ig.Font.ALIGN.LEFT); // put it on the screen


        }
    });
});
