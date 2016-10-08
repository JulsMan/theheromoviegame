quests =
{
    "FIGHT_MUD_DEMON": function () {
        this.id = 'FIGHT_MUD_DEMON',
        this.type = 'quest',
        this.name = 'Fight A Mud Demon',
        this.text = "If you want an audience with the King, I suggest you prove your mettle first.  The king doesn't need another puppy to play with. Go to Southrond and head east.  You'll find some mud to play in!",
        this.description = "Goto Southrond and fight the Mud-Demon, bring back his tooth and the guard will let you see the king.",
        this.questGiver = 'guard.helpful',
        this.questReturn = 'guard.helpful',
        this.awardSound = './media/sound/action2.*',
        this.rewardSound = './media/sound/action2.*',
        this.required = true,
        this.completed = false,
        this.map = 'Southrond'
        this.quest = function (player, npc) {
            if (player.questlog(this) != null)
            {
                var qq = player.questlog(this);
                // i have this quest ... 
                if (qq.completed)
                {
                    // open the doors to the kings throne room

                    // say something
                    var finis = ["I remember when I killed by first mud demon.\nNo one would go near me for a week because of the smell.",
                    "Tougher then you look.  And that's a good thing.", "Did you step in something?  Check your shoes before you see the king!"];
                    return finis[Math.floor(Math.random() * finis.length)];
                }


                // if i have the quest but its not completed, check if i have the mud demon head
                var bag = player.inventory().contains('MudDemon Head');
                if (bag == null){
                    var pending = ["You're britches are the only thing that looks dirty.  Go play in the mud.",
                            "What's that smell?  You smell something?", "Did you go to Southrond?  Did you find a new friend?"];
                    return pending[Math.floor(Math.random() * pending.length)];
                }
                else {
                    // reward the quest!!!!!!!
                    qq.completed = true;
                    player.inventory(new keys['ThroneRoom.Kings.Hall']);

                    // open the doors to the kings throneroom
                    return "Phew!  Now you at least smell like a hero.  The king will see you know but wipe your shoes first.";
                   
                }
               
            }
            else
            {
                // i don't have the quest ... should i get it?
                // there are no pre-reqs ... so yes

            }

           
        },
       
        this.chatBeforeQuest = function (player, npc) {
            return "If the king want's to play he should get a puppy, let the men spend their time being heroes!";
        }
    }

}






