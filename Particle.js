/* jshint undef: true, unused: true */
/* global Vec, Vector */
;(function() {
    "use strict";
    function Particle(position, velocity, acceleration) {
        this.position = position || new Vec(0, 0);
        this.velocity = velocity || new Vec(0, 0);
        this.acceleration = acceleration || new Vec(0, 0);
    }
    Particle.prototype.accelerationAtPoint = function(point, fields) {
        var accelX = 0;
        var accelY = 0;
        // for each passed field
        var fieldsLength = fields.length;
        for (var i = 0; i < fieldsLength; i++) {
            var field = fields[i];
            // find the distance between the particle and the field
            var vectorX = field.position.x - point.x;
            var vectorY = field.position.y - point.y;
            // calculate the force via MAGIC and HIGH SCHOOL SCIENCE!
            var force = field.mass / Math.pow(vectorX*vectorX+vectorY*vectorY,1.5);
            // add to the total acceleration the force adjusted by distance
            accelX += vectorX * force;
            accelY += vectorY * force;
        }
        return new Vec(accelX, accelY);
    };
    Particle.prototype.submitToFields = function (fields) {
        var acceleration = this.accelerationAtPoint(this.position, fields);
        this.acceleration.setVec(acceleration);
    };
    Particle.prototype.move = function () {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
    };
    this.Particle = Particle;
}.call(this));
