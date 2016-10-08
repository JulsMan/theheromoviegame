ig.module('plugins.combat')
.requires
(
    'plugins.chatbubble',
    'plugins.button'
)
.defines(function () {
    EntityCombat = ig.Entity.extend({
        size: { x: 80, y: 40 },
        text: 'Fight!',
        combatant: null,
        img: null,
        currentTrack: null,
        combatWindow: null,

        init: function (x, y, combatant) {
            var player = ig.game.getEntitiesByType('EntityPlayer')[0];
            this.combatant = combatant;

            if (this.img == null) {
                this.img = this.combatant.pic;
            }

            this.currentTrack = ig.music.currentIndex;

            ig.music.volume = 0.4;
            ig.music.loop = true;
            ig.music.play('fight');


            // add the available spells to the select list


            // runonce
            setTimeout(this.combatWindow, 333);
            setTimeout(this.updateCombatWindow, 1500);
          
        },

        draw: function () {
            this.parent();
            // draw hud if there is a player
            if (ig.game.getEntitiesByType('EntityPlayer').length != 0) {
                this.number();
                this.pic();
            }
        },

        number: function () {
            var context = ig.system.context;
            var player = ig.game.getEntitiesByType('EntityPlayer')[0];
            // draw a transparant black rectangle
            //var context = this.canvas.getContext('2d');
            context.fillStyle = "rgb(0,0,0)";
            context.setAlpha(0.5); //set transparency
            context.fillRect((ig.system.width* ig.system.scale) - 150, 15, 145, 150);
            //draw text on top of the rectangle
            context.fillStyle = "rgb(255,255,255)";
            context.font = "18px Arial";
            context.fillText(this.combatant.name,
                (ig.system.width * ig.system.scale) - 150 + 10, 34);

            context.fillText('HP:' + this.combatant.health + '/' + this.combatant.stats.maxhealth,
               (ig.system.width * ig.system.scale) - 150 + 10, 58);

            //font used is the default canvas font
            context.setAlpha(1);
            return null;
        },


        bar: function(){
            //if(!this.context) return null;
            var context = ig.system.context;
            //var player = ig.game.getEntitiesByType('EntityPlayer')[0];
            // draw a transparant black rectangle
            var h = 100 * Math.min(this.combatant.health / this.combatant.stats.hp);
            //var context = this.canvas.getContext('2d');
           
            //either draw a blue or red rectangle on top of the black one 
            var color = h < this.combatant.stats.maxhealth/3 ? "rgb(255,0,0)" : "rgb(255,128,64)";
            context.fillStyle = color;
            context.setAlpha(0.8);
            context.fillRect((ig.system.width * ig.system.scale) - 150 + 10, 50, h, 10);
            context.setAlpha(1);
            return null;
        },


        pic: function () {
           
            if (this.combatant.pic == null) return null;
            var img = this.combatant.pic;
            //var context = ig.system.context;
            //context.setAlpha(0.7);
            //var player = ig.game.getEntitiesByType('EntityPlayer')[0];
            var x = (ig.system.width / 2) - 150 + 10;
            var xx = ig.system.width - 70;
            this.img.draw(xx, 36, 0, 0, 32, 32);
            //this.img.draw((ig.system.width/2) - 150 + 10, 60,0,0,32,32);
            //context.setAlpha(1);
        },

        combatWindow: function () {
            this.combatWindow = $("#combatWindow");
            $("#combatWindow").dialog("open");
            
            var player = ig.game.getEntitiesByType('EntityPlayer')[0];
            window.CombatClass.windowLoad(player);
        },
        
        updateCombatWindow: function () {
            if (this.combatWindow != null) {
                var player = ig.game.getEntitiesByType('EntityPlayer')[0];
                window.CombatClass.setCallback(player.combatFinished)
            }
            else {
                console.log("Unable to get CombatClass of the new Window!")
            }
        },
       
       
    })
});