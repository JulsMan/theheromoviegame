ig.module('plugins.hud')
.requires()
.defines(function () {
    ig.hud = ig.Class.extend({
        canvas: document.getElementById('canvas'), //get the canvas
        context: canvas.getContext('2d'),
        maxHealth: null,
        img: null,
        init: function () {
            if (this.img == null){
                this.img = new ig.Image('media/hero_bus.png');
            }

            ig.Game.inject({
                draw: function () {
                    this.parent();
                    // draw hud if there is a player
                    if (ig.game.getEntitiesByType('EntityPlayer').length != 0) {
                        if (this.hud) {
                            this.hud.number();
                            this.hud.bar();
                            this.hud.pic();
                        }
                    }
                }
            })
        },

        number: function () {
            if (!this.context) return null;
            var player = ig.game.getEntitiesByType('EntityPlayer')[0];
            // draw a transparant black rectangle
            var context = this.canvas.getContext('2d');
            context.fillStyle = "rgb(0,0,0)";
            context.setAlpha(0.5); //set transparency
            context.fillRect(15, 15, 200, 150);
            //draw text on top of the rectangle
            context.fillStyle = "rgb(255,255,255)";
            context.font = "18px Arial";
            context.fillText('Health: ' + player.stats().health + '   Coins: ' + player.stats().coins, 20, 34);

            //font used is thae default canvas font
            context.setAlpha(1);
            return null;
        },


        bar: function(){
            if(!this.context) return null;
            var player = ig.game.getEntitiesByType('EntityPlayer')[0];
            // draw a transparant black rectangle
            var h = 100 * Math.min(player.stats().health / player.stats().hp, 100);
            var context = this.canvas.getContext('2d');
            //context.fillStyle = "rgb(0,0,0)";
            //context.setAlpha(0.5);
            //context.fillRect(25,85,150,20);
            //either draw a blue or red rectangle on top of the black one 
            var color = h < 10 ? "rgb(128,0,0)" : "rgb(0,255,255)";
            context.fillStyle = color;
            context.setAlpha(0.8);
            context.fillRect(20,50,h,10);
            context.setAlpha(1);
            return null;
        },


        pic: function () {
            if (!this.context) return null;
            if (this.pic == null) return null;

            var player = ig.game.getEntitiesByType('EntityPlayer')[0];
            var context = this.canvas.getContext('2d');
            context.setAlpha(0.7);
            this.img.draw(10, 36, 0,0, 32,32);      // draws but now to scale
            context.setAlpha(1);
        },
    })
});