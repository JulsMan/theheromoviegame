ig.module('plugins.ai')
.defines(function () {
    ig.ai = ig.Class.extend({

        init: function (entity) {
            ig.ai.ACTION = { Rest: 0, MoveLeft: 1, MoveRight: 2, MoveUp: 3, MoveDown: 4, Attack: 5, Block: 6 };
            this.entity = entity;
        },
    });
});

