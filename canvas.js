
    function _extend(){
        var obj = _firstArg(arguments),
            prop, proto, i = 0, j = arguments.length;
        for(;i<j;i){
            proto = arguments[i++]; 
            for(prop in proto){
                obj[prop] = proto[prop];
            }
        }
        return obj;
    }

    function _firstArg(args){
        return Array.prototype.splice.call(args, 0, 1)[0]; 
    }

    function Canvas(id){
        this._ = {};
        this._.children = [];
        this.element = document.querySelector(id);
        this.context = this.element.getContext("2d");
    }

    Canvas.prototype = {
        // Native Proxys 
        clear: function(args){
            args || (args = {});
            this.context.clearRect(
                (args.x || 0),
                (args.y || 0),
                (args.w || this.element.clientWidth),
                (args.h || this.element.clientHeight)
            )
        },

        save: function(){
            this.context.save();
        },

        restore: function(){
            this.context.restore();
        },

        scale: function(w,h){
            this.context.scale(w, (h||w) ); 
        },

        rotate: function(a){
            this.context.rotate(a*Math.PI/180);
        },

        translate: function(x,y){
            this.context.translate(x, (y||0) );
        },
        // Library Methods
        
        mathAxis: function(){
            this.translate(0, this.element.clientHeight);
            this.scale(1, -1);
        },

        add: function(obj){
            this._.children.push(obj);
        },

        remove: function(obj){
            this._children.splice(this._.children.indexOf(obj), 1); 
        },

        empty: function(){
            this._.children.length = 0;
        },

        render: function(){
            var ctx = this.context;
            this._.children.forEach(function(obj){
                !!obj.active && obj.render(ctx); 
            });
        }
    
    };

    
    Function.prototype.inherit = function(){
        var parent = _firstArg(arguments);
        Array.prototype.unshift.call(arguments, this.prototype, parent.prototype);
        _extend.apply(null, arguments);
        this.toString = function(){return this.name; };
    };


    function Shape(args){
        this.position = {
            x: args.x,
            y: args.y
        };
        this.display = {
            fill: args.fill,
            line: args.line,
            border: args.border
        };
        this.init.apply(this, arguments);
    }

    Shape.prototype = {
        active: true,
        render: function(ctx){
            console.log(this.constructor+":: render");
            ctx.fillStyle = this.display.fill;
            ctx.strokeStyle = this.display.line;
            ctx.lineWidth = this.display.border;
        }
    };

    function Rect(){ Shape.apply(this, arguments); }

    Rect.inherit(Shape, {

        init: function(args){
            this.width = args.w;
            this.height = args.h;
        },

        render: function(ctx){
            Shape.prototype.render.call(this, ctx);
            var draw = this.display.fill && !this.display.line ? 
                ctx.fillRect : this.display.line ? ctx.rect : ctx.strokeRect;
            draw.call(ctx, this.position.x, this.position.y, this.width, this.height);
            draw == ctx.rect && (ctx.fill(), ctx.stroke());
        }
    
    });

    function Square() { Rect.apply(this, arguments); }

    Square.inherit(Rect, {
        
        init: function(){
            this.width = this.height = (args.w || args.h);
        }

    });

    
    function Arc() { Shape.apply(this, arguments); }
    
    Arc.inherit(Shape, {
        
        init: function(args){
            this.radius = args.r;
            this.rotation = {};
            this.rotation.start = args.s*Math.PI/180;
            this.rotation.end = args.e*Math.PI/180;
            this.rotation.ccw = (args.clockwise === undefined ? false : args.clockwise);
        },

        render: function(ctx){
            Shape.prototype.render.call(this, ctx);
            ctx.beginPath();
            ctx.arc(
                this.position.x, 
                this.position.y, 
                this.radius, 
                this.rotation.start, 
                this.rotation.end,
                this.rotation.ccw
            );
            this.display.fill && ctx.fill();
            this.display.line && ctx.stroke();
        }

    });


    function Circle(){ Arc.apply(this, arguments); }

    Circle.inherit(Arc, {
    
        init: function(args){
            Arc.prototype.init.call(this, args);
            this.rotation.start = 0;
            this.rotation.end = 2*Math.PI;
        }

    
    });

