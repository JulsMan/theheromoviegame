ig.module(
  'plugins.dialog'
).requires(
  'impact.entity',
  'impact.font'
).defines(function () {

    EntityDialog = ig.Entity.extend({

        //Shape of the chat bubble: Square, oval or rounded (square with rounded corners)
        shape: 'rounded',
        //Corner radius. Only used when the shape parameter is set to rounded
        radius: 5,
        //Text to be displayed in chat bubble
        text: '',
        //Padding of text
        padding: 10,
        //Font to be used. Either ig.Font instance or name of the font to be used
        font: 'Arial',
        //Font size, only used if not using instance of ig.Font
        fontSize: 24,
        //Font color. [red,green,blue]. Only used if not using instance of ig.Fong
        fontColor: [255, 255, 255],
        //Lifespan of the entity in seconds. 0 means permanent
        lifeSpan: 0,
        //Color of the chat bubble. [red,green,blue]
        color: [192, 192, 192],
        //Border color for the bubble. [red,green,blue] or null. No border is darawn if null
        borderColor: [128,128,128],
        //Border width in pixels
        borderWidth: 10,
        //Opacity - 0.1 - 1
        opacity: '0.5',
        //Name of, or reference to, the entity that the chat bubble tracks. 
        tracks: null,
        //How far is the chat bubble from entity (pixels)
        margin: 20,
        scrolling: {scroll: true, _counter:0, timer: 80, _index:0 },
        wordwrap: function (str, width) {
            /*
                Taken from:
                http://james.padolsey.com/javascript/wordwrap-for-javascript/ 
            */
                //brk = brk || '\n';
                width = width || 75;
                var cut = false;
 
                if (!str) { return str; }
 
                var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
 
            //return str.match( RegExp(regex, 'g') ).join( brk );
            return str.match( RegExp(regex, 'g') );
 
            },

        _context: null,
        _bubbleWidth: 0,
        _bubbleHeight: 0,
        _timeLeft: null,
        __written: 0,
        __writtenCounter: 0,
        collides: ig.Entity.COLLIDES.NONE,

  init: function (x, y, settings) {

            this.parent(x, y, settings);

            this._context = ig.system.context;

            if (!(this.font instanceof ig.Font)) {

                this._context.font = this.fontSize + 'px ' + this.font;

                var metrics = this._context.measureText(this.text);
                this._bubbleWidth = 0; //metrics.width + 2 * this.padding;
                this._bubbleHeight = 0; //this.determineFontHeight() + 2 * this.padding;

            }

            if (!(this.color instanceof Array)) {

                this.color = this.hexToRgb(this.color);

                if (!(this.fontColor instanceof Array)) {
                    this.fontColor = this.hexToRgb(this.fontColor);
                }

            }

            if (this.borderColor) {

                if (!(this.borderColor instanceof Array)) {
                    this.borderColor = this.hexToRgb(this.borderColor);
                }

            }

            if (this.lifeSpan > 0) {
                this._timeLeft = new ig.Timer();
                this._timeLeft.set(this.lifeSpan);
            }

            var sfx = new ig.Sound('media/sound/page-flip-4.*');
            sfx.volume = 0.9;
            sfx.play();


            sfx = new ig.Sound('media/sound/scribble.*');
            sfx.volume = 0.9;
            sfx.play();

        },

        update: function () {

            /*
            For some reason the widthMap array will or might not be populated in init() method. 
            Hence we must get the string width/height in update
            */
            //if ((this.font instanceof ig.Font) && this._bubbleHeight == 0) {

            //    this._bubbleWidth = 1400; //this.font.widthForString(this.text) + 2 * this.padding;
            //    this._bubbleHeight = 240; //this.font.heightForString(this.text) + 2 * this.padding;

            //}

            if (this.lifeSpan > 0) {
                if (this._timeLeft.delta() > 0) {
                    this.kill();
                    if (this.callback) {
                        this.callback();
                    }
                }
            }

            // Note (mtg101): clearly would be more efficient to store the tracked object rather than do all this lookup
            // every update(), but this retains the original API (ie can change name of tracked object at any point)
            // so until performance is an issue I'll leave like this
            var follows = ig.game.getEntityByName('hero');
            /*
            if (typeof this.tracks == 'string') {
                follows = ig.game.getEntityByName(this.tracks);
            } else if (this.tracks instanceof ig.Entity) {
                follows = this.tracks;
            }
            */

            //if (!follows) {
            //    this.kill();
            //} else {
            //    this.pos.x = follows.pos.x;
            //    this.pos.y = follows.pos.y;
            //}

        },

        draw: function () {

            var follows = ig.game.getEntityByName('hero');
           
            // since the dialog is a fixed width areabox, override the width and height
            // we don't do this on the init, because it would overflow to the left of the screen
            this._bubbleWidth = 700;
            this._bubbleHeight = 210;

            if (!follows) {
                this.kill();
                return;
            }

            this._context.save();
            this._context.fillStyle = 'rgba(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ',' + this.opacity + ')';

            if (this.borderColor) {
                this._context.strokeStyle = 'rgba(' + this.borderColor[0] + ',' + this.borderColor[1] + ',' + this.borderColor[2] + ',' + this.opacity + ')';
                this._context.lineWidth = this.borderWidth;
            }

            // change by mtg101 to take account of system scale. Similar hacks should be applied to the other shapes
            //var x = ig.system.scale * (this.pos.x - ig.game.screen.x - (this._bubbleWidth - follows.size.x) / (2 * ig.system.scale));
            //var y = (ig.system.scale * (this.pos.y - ig.game.screen.y - this.margin - this._bubbleHeight / ig.system.scale)) + 500;

            var x = ig.system.scale * 125;
            var y = ig.system.scale * 15;

            if (this.shape == 'square') {

                this._context.fillRect(x, y, this._bubbleWidth, this._bubbleHeight);

                if (this.borderColor) {
                    this._context.strokeRect(x, y, this._bubbleWidth, this._bubbleHeight);
                }

            } else if (this.shape == 'rounded') {

                /*
                Code to draw rectanglkes with rounded corners on HTML5 canvas by "Juan Mendes" from
                http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
                */
                this._context.beginPath();
                this._context.moveTo(x + this.radius, y);
                this._context.lineTo(x + this._bubbleWidth - this.radius, y);
                this._context.quadraticCurveTo(x + this._bubbleWidth, y, x + this._bubbleWidth, y + this.radius);
                this._context.lineTo(x + this._bubbleWidth, y + this._bubbleHeight - this.radius);
                this._context.quadraticCurveTo(x + this._bubbleWidth, y + this._bubbleHeight, x + this._bubbleWidth - this.radius, y + this._bubbleHeight);
                this._context.lineTo(x + this.radius, y + this._bubbleHeight);
                this._context.quadraticCurveTo(x, y + this._bubbleHeight, x, y + this._bubbleHeight - this.radius);
                this._context.lineTo(x, y + this.radius);
                this._context.quadraticCurveTo(x, y, x + this.radius, y);
                this._context.closePath();

                this._context.fill();

                if (this.borderColor) {
                    this._context.stroke();
                }

            } else if (this.shape == 'oval') {

                /*
                Code to draw ovals on HTML5 canvas by "Steve Tranby" from
                http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
                */

                var kappa = .5522848;
                ox = (this._bubbleWidth / 2) * kappa, // control point offset horizontal
        oy = (this._bubbleHeight / 2) * kappa, // control point offset vertical
        xe = x + this._bubbleWidth,           // x-end
        ye = y + this._bubbleHeight,           // y-end
        xm = x + this._bubbleWidth / 2,       // x-middle
        ym = y + this._bubbleHeight / 2;       // y-middle

                this._context.beginPath();
                this._context.moveTo(x, ym);
                this._context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
                this._context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
                this._context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                this._context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
                this._context.closePath();

                this._context.fill();

                if (this.borderColor) {
                    this._context.stroke();
                }

            }

            if (!(this.font instanceof ig.Font)) {

                this._context.textAlign = 'left';
                this._context.fillStyle = 'rgb(' + this.fontColor[0] + ',' + this.fontColor[1] + ',' + this.fontColor[2] + ')';

                var textHeight = this.determineFontHeight();
                

                var lines = this.wordwrap(this.text.substring(0, this.__written));
                var xx = x + this.padding;
                var yy = y; //+ (textHeight - 2) + this.padding - textHeight / 4;
                
                if (this.__writtenCounter % 2 == 0  && this.text.length >= this.__written) {
                   
                    for (var i = 0; i < lines.length; i++) {
                        this._context.fillText(lines[i], xx, yy + ((i+1) * textHeight));
                    }
                    this.__written++;
                }
                else {
                    for (var i = 0; i < lines.length; i++) {
                        // write the text...
                        this._context.fillText(lines[i], xx, yy + ((i + 1) * textHeight));
                    }
                }
                this.__writtenCounter++;
                this._context.restore();
              
            } else {

                var textHeight = this.determineFontHeight();
                this._context.restore();
                this.font.draw(this.text, x + this.padding, y + textHeight - this.padding - textHeight / 4);

            }
        },

        hexToRgb: function (hex) {
            var parseHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return [parseInt(parseHex[1], 16), parseInt(parseHex[2], 16), parseInt(parseHex[3], 16)];
        },

        /* Method to calculate the height of text on canvas by "ellisbben" from
        http://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
        */

        determineFontHeight: function () {
            var body = document.getElementsByTagName("body")[0];
            var dummy = document.createElement("div");
            var dummyText = document.createTextNode(this.text);
            dummy.appendChild(dummyText);
            dummy.setAttribute("style", 'font-family:' + this.font + ';font-size:' + this.fontSize + 'px');
            body.appendChild(dummy);
            var result = dummy.offsetHeight;
            body.removeChild(dummy);
            return result;
        }

    });

});