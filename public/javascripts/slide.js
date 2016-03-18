'use strict';

function Slide(wrap, cont, point) {
    this.winW = document.documentElement.clientWidth;
    this.wrap = document.getElementById(wrap);
    this.cont = document.getElementById(cont);
    this.contLi = this.cont.children;
    this.contLiLength = this.contLi.length;
    this.point = document.getElementById(point).getElementsByTagName('span');
    this.startN = 0;
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.transX = 0;
    this.transY = 0;
    this.lock = {
        moving: false,
        started: false
    };
    this.callback = null;
}

Slide.prototype = {
    init: function() {
        this.resize();

        if (this.contLiLength > 1) {
            this.addHandler(this.wrap, 'touchstart', this.bindFn(this, this.touchStart));
            this.addHandler(this.wrap, 'touchmove', this.bindFn(this, this.touchMove));
            this.addHandler(this.wrap, 'touchend', this.bindFn(this, this.touchEnd));
        }
    },
    resize: function() {
        this.winW = document.documentElement.clientWidth;
        for (var i = 0; i < this.contLiLength; i++) {
            this.contLi[i].style.width = this.winW + 'px';
        }
    },

    addHandler: function(elem, evtype, fn) {
        if (elem.attachEvent) {
            elem.attachEvent('on' + evtype, fn);
        } else if (elem.addEventListener) {
            elem.addEventListener(evtype, fn, false);
        } else {
            elem['on' + evtype] = fn;
        }
    },

    bindFn: function(obj, func) {
        return function() {
            func.apply(obj, arguments);
        };
    },

    touchStart: function(event) {
        // e.preventDefault();
        if (!event.touches.length || this.lock.moving) {
            return;
        } else {
            this.lock.started = true;
        }
        var touch = event.touches[0];
        this.startX = touch.pageX;
        this.startY = touch.pageY;
        this.endX = touch.pageX;
    },

    touchMove: function(event) {
        if (!event.touches.length || this.lock.moving || !this.lock.started) {
            return;
        }
        var touch = event.touches[0];
        this.transX = this.startX - touch.pageX;
        this.transY = this.startY - touch.pageY;
        this.endX = touch.pageX;

        if (Math.abs(this.transY) - Math.abs(this.transX) < 1) {
            event.preventDefault();
            touch = event.touches[0];
            this.transX = this.startX - touch.pageX;
            this.cont.style.webkitTransitionDuration = 0;
            this.cont.style.webkitTransform = 'translate3d(' + (-(this.transX / 2) - this.startN * this.winW) + 'px,0,0)';
        }
    },

    touchEnd: function() {
        if (this.lock.moving || !this.lock.started) {
            return;
        } else {
            this.lock.started = false;
        }

        if (Math.abs(this.startX - this.endX) < 10 || this.winW * this.contLiLength < this.winW) {
            this.play(this.startN);
        } else if (this.transX > 50) {
            this.play(this.startN + 2);
            if (typeof this.callback === 'function') {
                this.callback();
            }
        } else if (this.transX < -50) {
            this.play(this.startN - 2);
            if (typeof this.callback === 'function') {
                this.callback();
            }
        } else {
            this.play(this.startN);
        }
    },

    play: function(n) {
        var _ = this;
        this.lock.moving = true;

        if (n >= this.contLiLength) {
            this.startN = n = this.contLiLength - 1;
        } else if (n < 0) {
            this.startN = n = 0;
        } else {
            this.startN = n;
        }

        this.cont.style.webkitTransitionDuration = '300ms';
        this.cont.style.webkitTransform = 'translate3d(' + (-this.winW) * n + 'px,0,0)';
        setTimeout(function() {
            _.cont.style.webkitTransitionDuration = '0';
            _.lock.moving = false;
        }, 300);
        this.slidePoint();
    },

    slidePoint: function() {
        for (var i = 0; i < this.contLiLength; i++) {
            this.point[i].className = '';
        }
        this.point[this.startN].className = 'current';
    },

    toLeft: function() {
        this.play(--this.startN);
    },

    toRight: function() {
        this.play(++this.startN);
    }
};

var slide1 = new Slide('face_wrap', 'face_ul', 'slide_point');
slide1.init();

window.addEventListener('resize', function() {
    slide1.resize();
}, false);


