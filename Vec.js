/* jshint undef: true, unused: true */
/* global*/
;(function() {
    "use strict";
    function Vec(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    Vec.fromAngle = function (angle, magnitude) {
        return new Vec(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
    };
    Vec.prototype = {
        getAngle: function() {
            return Math.atan2(this.y,this.x);
        },
        sub: function (other) {
            this.x -= other.x;
            this.y -= other.y;
            return this;
        },
        subGet: function (other) {
            return new Vec(
                this.x - other.x,
                this.y - other.y
            );
        },
        add: function (other) {
            this.x += other.x;
            this.y += other.y;
            return this;
        },
        addGet: function (other) {
            return new Vec(
                this.x + other.x,
                this.y + other.y
            );
        },
        mul: function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        },
        mulGet: function (scalar) {
            return new Vec(
                this.x * scalar,
                this.y * scalar
            );
        },
        div: function (scalar) {
            this.x /= scalar;
            this.y /= scalar;
            return this;
        },
        divGet: function (scalar) {
            return new Vec(
                this.x / scalar,
                this.y / scalar
            );
        },
        normalizedGet: function () {
            var x = this.x, y = this.y;
            var length = Math.sqrt(x * x + y * y);
            return new Vec(x / length, y / length);
        },
        normalize: function () {
            var x = this.x, y = this.y;
            var length = Math.sqrt(x * x + y * y);
            this.x = x / length;
            this.y = y / length;
            return this;
        },
        length: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        getMagnitude: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        quadranceTo: function (other) {
            var x = this.x - other.x;
            var y = this.y - other.y;
            return x * x + y * y;
        },
        copy: function () {
            return new Vec(this.x, this.y);
        },
        setVec: function(vec) {
            this.x = vec.x;
            this.y = vec.y;
            return this;
        }
    };
    this.Vec = Vec;
}.call(this));
