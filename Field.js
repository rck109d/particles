/* jshint undef: true, unused: true */
/* global*/
;(function() {
    "use strict";
    function Field(point, mass) {
        this.position = point;
        this.setMass(mass);
    }
    Field.prototype.setMass = function(mass) {
        this.mass = mass || 100;
        this.drawColor = mass < 0 ? "#f00" : "#0f0";
    };
    this.Field = Field;
}.call(this));
