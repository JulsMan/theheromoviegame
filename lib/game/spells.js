spells = 
    {
        'ChainLightning': function () {
            this.id = 'ChainLightning',
            this.type = 'spell',
            this.name = 'ChainLightning',
            this.description = 'Bolts of lightning that strike for up to 6-12 damage the first round then additional damage for the next 3 rounds';
            this.icon = "./media/icons/thunder.png";
            this.sfx = "media/thunder.*";
            this.duration = 4;
            this.stackable = false;
            this.mana = 8;
            this.fx = function (player, CombatClass) {
                switch (this.duration) {
                    case 4:
                        var roll = CombatClass.roll(20);
                        if (roll < 11) {
                            // spell fizzles
                            CombatClass.damageNPC(0, 'Chainlightning fizzels!');
                            CombatClass.removeFx('ChainLightning');
                            return;
                        }

                        var dmg = CombatClass.roll(12, 6);
                        CombatClass.damageNPC(dmg, 'Chainlightning strikes your foe for ' + dmg, 'spell');

                        var sfx = new ig.Sound('media/sound/thunder.*');
                        sfx.volume = 0.9;
                        sfx.play();

                       
                        break;
                    case 3:
                        var dmg = CombatClass.roll(6, 3);
                        CombatClass.damageNPC(dmg, 'Chainlightning continues to damage your foe for ' + dmg, 'spell');

                        var sfx = new ig.Sound('media/sound/thunder.*');
                        sfx.volume = 0.9;
                        sfx.play();
                        break;

                        CombatClass.damageNPC(3, 'Chainlightning damages your foe a last time for 3', 'spell');

                        var sfx = new ig.Sound('media/sound/thunder.*');
                        sfx.volume = 0.9;
                        sfx.play();
                        break;
                    default:
                        var dmg = CombatClass.roll(4, 2);
                        CombatClass.damageNPC(dmg, 'Chainlightning continues to damage your foe for ' + dmg, 'spell');

                        var sfx = new ig.Sound('media/sound/thunder.*');
                        sfx.volume = 0.9;
                        sfx.play();
                        break;
                }
            }
        },

        'LesserHeal': function () {
            this.id = 'LesserHeal',
            this.type = 'spell',
            this.name = 'LesserHeal',
            this.description = 'Costing just 4 mana with a 90% chance to heal yourself for 4-7hp.';
            this.icon = "./media/icons/heal.png";
            this.sfx = "media/thunder.*";
            this.duration = 1;
            this.stackable = false;
            this.mana = 4;
            this.fx = function (player, CombatClass) {
                var roll = CombatClass.roll(20);

                var regen = CombatClass.roll(7,4);
                if (roll <= 2) {
                    CombatClass.log("Your healing spell fizzles!");
                }
                else if (roll == 20) {
                    CombatClass.healHero(regen * 2, "The light of the heavens favors you today!", 'spell');
                    var sfx = new ig.Sound('media/sound/heal.*');
                    sfx.play();
                }
                else {
                    CombatClass.healHero(regen, "You are healed for " + regen, 'spell');
                    var sfx = new ig.Sound('media/sound/heal.*');
                    sfx.play();
                }

            }
        }
    };