/* jshint undef: true, unused: true */
/* global Vec, Field, Emitter, _ */
;(function() {
    "use strict";
    var maxParticles = 15000;
    var particleSize = 1;
    var emissionRate = 1;
    var objectSize = 3; // drawSize of emitter/field

    var particles = [];
    var emitters = [];
    var fields = [];

    var placing = null;
    var lastPlacement = null;
    var mouseX = 0;
    var mouseY = 0;

    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');

    function initWorld() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var midX = canvas.width / 2;
        var midY = canvas.height / 2;
    }
    initWorld();

    function addNewParticles() {
        // if we're at our max, stop emitting.
        if (particles.length > maxParticles) {
            return;
        }
        // for each emitter
        for (var i = 0; i < emitters.length; i++) {
            // emit [emissionRate] particles and store them in our particles array
            for (var j = 0; j < emissionRate; j++) {
                particles.push(emitters[i].emitParticle());
            }
        }
    }

    function plotParticles(boundsX, boundsY) {
        // a new array to hold particles within our bounds
        var currentParticles = [];
        var particlesLength = particles.length;
        for (var i = 0; i < particlesLength; i++) {
         var particle = particles[i];
         var pos = particle.position;
         // If we're out of bounds, drop this particle and move on to the next
         if (pos.x < 0 || pos.x > boundsX || pos.y < 0 || pos.y > boundsY){
             continue;
         }
         // Update velocities and accelerations to account for the fields
         particle.submitToFields(fields);
         // Move our particles
         particle.move();
         // Add this particle to the list of current particles
         currentParticles.push(particle);
        }
        // Update our global particles reference
        particles = currentParticles;
    }

    function drawParticles() {
        ctx.fillStyle = 'rgb(0,0,255)';
        var particlesLength = particles.length;
        for (var i = 0; i < particlesLength; i++) {
         var position = particles[i].position;
         ctx.fillRect(position.x, position.y, particleSize, particleSize);
        }
    }



    function loop() {
        clear();
        update();
        draw();
        queue();
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function update() {
        addNewParticles();
        plotParticles(canvas.width, canvas.height);
    }

    function draw() {
        function drawCircle(object) {
            ctx.fillStyle = object.drawColor;
            ctx.beginPath();
            ctx.arc(object.position.x, object.position.y, objectSize, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        drawParticles();
        fields.forEach(drawCircle);
        emitters.forEach(drawCircle);
    }

    function queue() {
        window.requestAnimationFrame(loop);
    }

    loop();

    canvas.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        var mousePos = new Vec(mouseX, mouseY);
        if(placing > 0) {
            var toPlace = false;
            if(lastPlacement === null) {
                toPlace = true;
            } else {
                var q = mousePos.quadranceTo(lastPlacement);
                if(q > 100) {
                    toPlace = true;
                }
            }
            if(toPlace) {
                var mass = (placing === 1) ? 10 : -10;
                fields.push(new Field(new Vec(mouseX, mouseY), mass));
                lastPlacement = mousePos;
            }
        }
    });

    canvas.addEventListener('click', function(e) {
        var which = e.which;
        if(which === 1) {
            var x = e.clientX;
            var y = e.clientY;
            //fields.push(new Field(new Vec(x, y), 250));
            var newEmitter = new Emitter(new Vec(x, y), Vec.fromAngle(6, 1));
            emitters.push(newEmitter);
        } else if (e.which === 2) {
            particles = [];
        }
    });

    window.addEventListener('resize', function() {
        initWorld();
    });

    window.addEventListener('keydown', function(e) {
        var which = e.which;
        switch(which) {
            case 109: // numpad -
            case 189: // -
                placing = 2;
                return;
            case 107: // numpad +
            case 187: // + (=)
                placing = 1;
                return;
        }
    });

    window.addEventListener('keyup', function(e) {
        var which = e.which;
        console.log(which);
        switch(which) {
            case 32: //space
                emitters = [];
                return;
            case 90: // z
                fields = [];
                return;
            case 109: // numpad -
            case 189: // -
            case 107: // numpad +
            case 187: // + (=)
                placing = 0;
                return;
        }
    });
})();
