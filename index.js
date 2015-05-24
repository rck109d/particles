var maxParticles = 20000;
var particleSize = 1;
var emissionRate = 20;
var objectSize = 3; // drawSize of emitter/field

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;


function addNewParticles() {
  // if we're at our max, stop emitting.
  if (particles.length > maxParticles) return;

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

  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    var pos = particle.position;

    // If we're out of bounds, drop this particle and move on to the next
    if (pos.x < 0 || pos.x > boundsX || pos.y < 0 || pos.y > boundsY) continue;

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
  for (var i = 0; i < particles.length; i++) {
    var position = particles[i].position;
    ctx.fillRect(position.x, position.y, particleSize, particleSize);
  }
}

function drawCircle(object) {
  ctx.fillStyle = object.drawColor;
  ctx.beginPath();
  ctx.arc(object.position.x, object.position.y, objectSize, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}
 
var particles = []; 

var midX = canvas.width / 2;
var midY = canvas.height / 2; 

// Add one emitter located at `{ x : 100, y : 230}` from the origin (top left)
// that emits at a velocity of `2` shooting out from the right (angle `0`)
var emitters = [new Emitter(new Vector(midX - 150, midY), Vector.fromAngle(6, 2), Math.PI)];

// Add one field located at `{ x : 400, y : 230}` (to the right of our emitter)
// that repels with a force of `140`
var fields = [
  new Field(new Vector(midX - 300, midY + 20), 900), 
  new Field(new Vector(midX - 200, midY + 10), -50),
];

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
  drawParticles();
  fields.forEach(drawCircle);
  emitters.forEach(drawCircle);
}

function queue() {
  window.requestAnimationFrame(loop);
}

loop();
