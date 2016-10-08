ig.module('game.entities.door')

.requires(
    'impact.entity'
)

.defines(function () {
    EntityDoor = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/door2.png', 32, 32),
        size: { x: 32, y: 32 },
        friction: { x: 600, y: 600 },
        //maxVel: { x: 35, y: 35 },
        collides: ig.Entity.COLLIDES.FIXED,  // do not allow object to be pushed 
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        open: false,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.4, [0]);
            this.addAnim('close', 0.4, [0]);
            this.addAnim('open', 0.5, [1]);

        },

        update: function () {
            this.currentAnum = this.anims.idel;
            this.parent();
        },

        openDoor: function(){
            this.open = true;
            this.collides = ig.Entity.COLLIDES.PASSIVE;
            this.currentAnim = this.anims.open;

            var sfx = new ig.Sound('media/sound/latch.*');
            sfx.volume = 0.9;
            sfx.play();
        },
        closeDoor: function(){
            this.open = false;
            this.collides = ig.Entity.COLLIDES.FIXED;
            this.currentAnim = this.anims.close;

            var sfx = new ig.Sound('media/sound/latch.*');
            sfx.volume = 0.9;
            sfx.play();
        },
        check: function (other) {
            if (other.name == 'hero') {
                //other.contactWith(this);

                // if the door is open ... then do nothing .. check that collision is passive
                if (this.open == true) {
                    // check that the door is set to passive collision
                    this.collides = ig.Entity.COLLIDES.PASSIVE;
                    return;
                }

                // if door is closed ... and there is no lock
                if (this.locked == undefined || this.locked == false || this.locked == 'false') {
                    this.openDoor();
                }

                // if door is closed and locked
                if (this.locked == true || this.locked == 'true')
                {
                    // door is locked
                    // check if key in inventory

                    // JULIAN KING 8/11/2014
                    // How about this - keys are just items within the inventory with the 
                    // name of the door.  So if we search the inventory, which is an array
                    // for the name of the door and find it ... we have the key...

                    var keys = other.keychain();

                    if (keys.containsId(this.key)) {
                        // we have a key!
                        var bubbleName = this.name + 'Bubble';
                        var parameters = {
                            text: 'I have a key.',
                            tracks: other.name, margin: 0, lifeSpan: 2, shape: 'square', name: bubbleName, color: [255, 128, 64]
                        };
                        ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);

                        this.openDoor();
                       

                    }
                    else {
                        var bubbleName = this.name + 'Bubble';
                        var parameters = {
                            text: 'Door is locked.  Requires a key.',
                            tracks: other.name, margin: 0, lifeSpan: 2, shape: 'square', name: bubbleName, color: [255, 128, 64]
                        };
                        ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);
                        this.closeDoor();
                    }
                }
               
            }

        },

    });
});