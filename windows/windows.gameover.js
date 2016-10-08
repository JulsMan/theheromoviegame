window.GameOverClass = {
    init: function(){
        var player = ig.game.getEntitiesByType(EntityPlayer)[0];
        var sfx = new ig.Sound('media/sound/thunder.*');
        sfx.play();
    },
    reload: function () {
        var player = ig.game.getEntitiesByType(EntityPlayer)[0];
        ig.game.playerController.loadLevel();
    }
};