ig.module('game.entities.guard')

.requires(
    'impact.entity'
)

.defines(function () {
    EntityGuard = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/sprites_guard_black.png', 32, 32),
        maxVel: { x: 35, y: 35 },
        size: { x: 22, y: 32 },
        offset: { x: 4, y: 8 },
        friction: { x: 600, y: 600 },
        flip: false,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.ACTIVE,
        speed: 50,
        stats: { hp: 35, attack: 4, ac: 13, armor: 3 },
        health: 8,
        npc: 'Guard',
        pic: new ig.Image('media/skeleton_warrior.png'),
        chitchat:
        [
            "Careful, there are barking spiders in the castle...",
            "For the Horde!   Grrrrrrr!",
            "So then he says, 'From using Excaliber' ... and we all started laughing ...",
            "Huuummmmmmm eeee dmmm dummmmm",
            "I haven't heard any news of that.",
            "Nothing to see here",
            "Move along peasant",
            "Move along naive",
            "Move along surf",
            "Welcome to the Kings Castle",
            "At the beep the year will be 904 AD ... BEEP!", 
            "I should have been a poop-smith like my father.",
            "Rumors abound!",
            "Careful what you say, the King has little patience these days.",
            "Can't you see I'm busy?",
            "If you give the scullery maid an extra copper she'll let you kiss her",
            "Keep moving stranger",
            "No dilly-dallying!",
            "So I says, 'Have fun storming the castle...'",
            "I do not mean to pry, but you don't by any chance happen to have six fingers on your right hand?",
            "Do you always begin conversations this way?",
            "One of us always lies ... and the other one always tells the truth.",
            "Don't be so Medieval",
            "Artax!  Nooooo..."

        ],
        chat: null,

        // guard on second level of castle has unique dialog
        // also has quest
        // not sure if this is correct way to implement
        // added logic to player.js
        chitchat2:
        [
            "You want to see the dungeons?  Wish I could help you, but the door is locked.",
            "Long ago, the Kings would place prisoners and treasure alike in the dungeons.  Now, they've both been forgotten.",
            "It's said this door is magically locked.  No one can get in without the password, and no one remembers what it was!",
            "The guards must have better hours upstairs...",
            "Why am I guarding a door that no one can enter?"
        ],

        dialog: null,

        init: function (x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 0.8, [3, 4, 3, 5, 15, 16, 3, 4, 25, 26]);
        },

        update: function () {
            if (ig.game.getEntityByName('hero').talking != null && this.chat != null) {
                this.chat.kill();
            }
            else
            {
                this.speak();
            }

            this.parent();
        },
        
        
        check: function (other) {
            if (other.name == 'hero') {
                other.contactWith(this);
            }
        },

        speak: function () {
            // if its my time to speak and the hero is not currently in a conversation...
            if (Math.random() < .003 && (ig.game.getEntityByName('hero').talking == null)) {
            var bubbleName = this.name + 'Bubble';
                if(!ig.game.getEntityByName(bubbleName) && this.dialog == null) {
                  var parameters = {text: this.chitchat[Math.floor(Math.random()*this.chitchat.length)] , 
                    tracks: this.name, margin: 0, lifeSpan: 5, shape: 'square', name: bubbleName, color:[30,70,30]};
                  this.chat = ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);
                }
            }
          
        },

        



    });
});