
window.CombatClass = {
    callback: null,
    _playerHealth: null,
    _playerMana: null,
    _enemyHealth: null,
    _turnCount: 0,
    _combatFx: [],     // an array of spells and enchants from the hero
    _manageFx: function(){
        for (var i = 0; i < CombatClass._combatFx.length; i++) {
            var fxx = CombatClass._combatFx[i];
            if (fxx != undefined || fxx != null) {
                if (fxx.duration != undefined) {
                    fxx.duration--;

                    if (fxx.duration <= 0)
                        CombatClass._combatFx.splice(i,1);
                }
            }
        }
    },
    _activateButtons: function (b) {
        if (b) {

            CombatClass._setSpellButtons();

            // on timer interval ... update the buttons based on wait...
            $("input[type=button]").removeAttr("disabled");
            $("#buttonSpells").removeAttr("disabled");
            $("input[type=button]").effect("highlight");
            //$("#buttonSpells").select2("val","Spell Book");
        }
        else {
            $("input[type=button]").attr("disabled", "disabled");
            $("#buttonSpells").attr("disabled","disabled");

        }
    },
    
    _healthPercent: function (hp, health) {
        return Math.floor((health * 100) / hp);
    },
    
    _spellTurn: function(){
        var player = ig.game.getEntitiesByType(EntityPlayer)[0];

        // this is a change of turn ... spell make effects here
        for (var i = 0; i < CombatClass._combatFx.length; i++) {
            var spell = CombatClass._combatFx[i];
            if (spell != undefined && spell != null) {
                spell.fx(player, CombatClass);
                // manage the Queque
                CombatClass._manageFx();
                setTimeout(CombatClass._enemyAttack, 2500);
                return;
            }
        }

        CombatClass._manageFx();
        CombatClass._enemyTurn();
    },
    _enemyTurn: function () {
       
        var player = ig.game.getEntitiesByType(EntityPlayer)[0];
        // the NPC specials also proc here
       
        if (player.talkingWith.special != undefined) {
            // this mob has a combat special abilty ... do it
            var txt = player.talkingWith.special(player, this);
            if (txt != null && typeof (txt) == 'string') {
                if (player.talkingWith.SFX.special != null) {
                    player.talkingWith.SFX.special();
                }

                CombatClass.log(txt);
                CombatClass.updateProgressBars(player);
                setTimeout(CombatClass._enemyAttack, 2500);
                return;
            }
        }

        CombatClass._enemyAttack();

       

    },
    _gameOver: function () {
        CombatClass.windowUnload();
        $("#gameoverWindow").dialog("open");
        //var player = ig.game.getEntitiesByType('EntityPlayer')[0];
        window.GameOver.init();
    },
    _combatOver: function () {
        CombatClass.windowUnload();
    },
    _enemyAttack: function () {

        //CombatClass._activateButtons(true);
        var player = ig.game.getEntitiesByType(EntityPlayer)[0];
        var roll = CombatClass.roll(20);
        if (roll >= player.stats().ac) {
            var dmg = CombatClass.roll(player.talkingWith.stats().attack);
            CombatClass.damageHero(dmg);
            
        }
        else {
            CombatClass.log(player.talkingWith.name + ' attacks but misses!');
            var sfx = new ig.Sound('media/sound/miss4.*');
            sfx.play();
        }

        setTimeout(CombatClass._activateButtons(true), 1000);
        
        
        CombatClass.updateProgressBars();
        //set next turn
        CombatClass._turnCount++;

    },
    _setSpellButtons: function (spells) {
        var player = ig.game.getEntitiesByType(EntityPlayer)[0];
        var spellbook = player.spellbook(undefined);

        // set the buttons...
        var $el = $("#buttonSpells");
        $el.empty(); // remove old options
        $el.append($("<option value='' disabled>Spell Book</option>"));
        $.each(spellbook, function (key, value) {
            if (value.mana > CombatClass._playerMana) {
                $el.append($("<option></option>")
                    .attr("value", value.name)
                    .attr("disabled", "disabled")
                    .text(value.name + ' (' + value.mana + ')')
                    );
            }
            else if (CombatClass._combatFx.contains(value)) {
                $el.append($("<option></option>")
                   .attr("value", value.name)
                   .attr("disabled", "disabled")
                   .text(value.name + ' (' + value.mana + ')')
                   );
            }
            else {
                $el.append($("<option></option>")
                    .attr("value", value.name)
                    .text(value.name + ' (' + value.mana + ')')
                    );
            }

        });

        //$("#buttonSpells option[value='']").attr('selected', true)
        $("#buttonSpells").select2("val", "");
    },
    removeFx: function (fx) {


        for (var i = 0; i < CombatClass._combatFx.length; i++) {
            if (CombatClass._combatFx[i].name == fx) {
                CombatClass._combatFx.splice(i, 1);
            }
        }
    },
    addFx: function (fx) {
        for (var i = 0; i < CombatClass._combatFx.length; i++) {
            if (CombatClass._combatFx[i] != undefined && CombatClass._combatFx[i].name == fx.name) {
                if (CombatClass._combatFx[i].stackable == undefined || CombatClass._combatFx[i].stackable == false) {
                    return;
                }
            }
        }

        CombatClass._combatFx.push(fx);
    },
    setCallback: function ( callback ){
        this.callback = callback;
    },
    healHero: function (regen, msg, type) {
        var player = ig.game.getEntitiesByType(EntityPlayer)[0];
        CombatClass._playerHealth += regen;

        if (msg == undefined) {
            // log the event!
            CombatClass.log(player.talkingWith.name + ' attacks ' + dmg + ' damage');

        } else {
            CombatClass.log(String.format(msg, regen, player.talkingWith.name));
        }

        $("#img_hero").effect("highlight");
      
        CombatClass.updateProgressBars(player);
    },
    damageHero: function (dmg, msg, type) {
        var player = ig.game.getEntitiesByType(EntityPlayer)[0];
        CombatClass._playerHealth -= dmg;

        if (CombatClass._playerHealth <= 0) {
            // you died!!
            CombatClass.log(player.talkingWith.name + ' attacks ' + dmg + ' damage. You died');
            setTimeout(CombatClass._gameOver, 1500);
            return;
        }

        if (msg == undefined) {
            // log the event!
            CombatClass.log(player.talkingWith.name + ' attacks ' + dmg + ' damage');
            
        } else {
            CombatClass.log(String.format(msg, dmg, player.talkingWith.name));
        }
        
        $("#img_hero").effect("bounce", { times: 3 }, "slow");
        var sfx = new ig.Sound('media/sound/punch1.*');
        sfx.play();
        CombatClass.updateProgressBars(player);
    },
    damageNPC: function (dmg, msg, type) {
        var player = ig.game.getEntitiesByType(EntityPlayer)[0];
        CombatClass._enemyHealth -= dmg;

        if (CombatClass._enemyHealth <= 0) {

            CombatClass._enemyHealth = 0;
            player.talkingWith.SFX.die();
            player.talkingWith.drop();
            setTimeout(CombatClass._combatOver, 1500);
            return;
        }


        // fight continues do the dmg routine...   
        if (msg == undefined) {
            // the fight continues...
            CombatClass.log('You hit the ' + player.talkingWith.name + ' for ' + dmg + ' damage!');
            
        } 
        else {
            CombatClass.log(String.format(msg, dmg, player.talkingWith.name));
        }


        $("#img_npc").effect("bounce", { times: 3 }, "slow");
        CombatClass.updateProgressBars(player);
 
        player.talkingWith.SFX.hit();

        
    },
   
    roll: function (dice, min) {
        if (min == undefined) min = 1;
        return Math.floor(Math.random() * (dice - 1) + min);
    },
    updateProgressBars: function(player){
        // progress bars
        var player = ig.game.getEntitiesByType(EntityPlayer)[0];

        $("#progressbar-hero").progressbar("option", "max", player.stats().hp);
        $("#progressbar-npc").progressbar("option", "max", player.talkingWith.stats().hp);
        $("#progressbar-hero").progressbar("option", "value", CombatClass._playerHealth);
        $("#progressbar-npc").progressbar("option", "value", CombatClass._enemyHealth);

        // set mana
        $("#hero-mana-count").val(CombatClass._playerMana);
    },
    log: function (msg) {
        $("#combat-log").attr("value", msg);
    },
    onButtonKill: function(){
        CombatClass._enemyHealth = 0;
        player.talkingWith.drop();
        CombatClass.windowUnload();
    },
    heroTurn: function (spell) {
        CombatClass._activateButtons(false);
        var player = ig.game.getEntitiesByType(EntityPlayer)[0];

        if (spell == undefined) {
            
            
            var roll = CombatClass.roll(20);

            if (roll >= player.talkingWith.stats().ac) {
                // hit!
                var dmg = CombatClass.roll(player.stats().attack);
                if (roll == 20) {
                    dmg = dmg * 2;
                }
                // do the hit
                CombatClass.damageNPC(dmg);
            }
            else {

                // miss
                if (roll < 8) {
                    // miss
                    CombatClass.log('You miss the ' + player.talkingWith.name);
                    player.talkingWith.SFX.miss();
                }
                else {
                    // block
                    player.talkingWith.SFX.block();
                }
            }
        }
        else {
            for (var casting in window.spells) {
                if (casting == spell) {

                    // play effect
                    var sfx = new ig.Sound('media/sound/chime2.*');
                    //sfx.volume = 0.9;
                    sfx.play();

                    var invoke = new window.spells[casting];
                    // subtract the mana from the player mana...
                    CombatClass._playerMana -= invoke.mana;

                    // the spell will add itself if needed!
                    CombatClass.addFx(invoke);
                }
            }
        }

       
        // award 1 mana point at the end of enemy turn turn, gain 1 mana point each turn
        CombatClass._playerMana += 1;
        if (CombatClass._playerMana > player.stats().mana) {
            CombatClass._playerMana = player.stats().mana;
        }

        setTimeout(CombatClass._spellTurn, 2000);
    },
   

    windowLoad: function (player) {
        $("#img_npc").attr("src", './windows/img.php?img=' + player.talkingWith.name);
        
        // hero stats
        $("#stat-hero-hp").attr("value", 'HP: ' + player.stats().hp);
        $("#stat-hero-ac").attr("value", 'AC: ' + player.stats().ac);
        $("#stat-hero-attack").attr("value", 'ATK: ' + player.stats().attack);
        $("#stat-hero-defense").attr("value", 'DEF: ' + player.stats().armor);

        // npc stats
        $("#stat-npc-hp").attr("value", 'HP: ' + player.talkingWith.stats().hp);
        $("#stat-npc-ac").attr("value", 'AC: ' + player.talkingWith.stats().ac);
        $("#stat-npc-attack").attr("value", 'ATK: ' + player.talkingWith.stats().attack);
        $("#stat-npc-defense").attr("value", 'DEF: ' + player.talkingWith.stats().armor);
       

       

        CombatClass._playerHealth = player.stats().health;
        CombatClass._playerMana = player.stats().mana;
        CombatClass._enemyHealth = player.talkingWith.stats().hp;

        CombatClass._turnCount = 0;
        CombatClass._combatFx = new Array();
       
      
        CombatClass.updateProgressBars(player);

        // unload the spell buttons then reset them each combat...
        $('#buttonSpells').html('')
        CombatClass._setSpellButtons();

        if (CombatClass.roll(2) == 1) {
            CombatClass._activateButtons(true);
            // hero gets attacked first...
            CombatClass._enemyAttack();
        }
        else {
            CombatClass._activateButtons(true);
        }

    },
    windowUnload: function() {
       
        // save off the hero's health ... if he is not dead!

        if (CombatClass._playerHealth > 0) {
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
            player.stats().health = CombatClass._playerHealth;
        }

        if (this.callback != null) {
            this.callback('Death to those who oppose the hero!');
        }

        window.close();
    }

};