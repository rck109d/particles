var maxParticles = 15000;
var particleSize = 1;
var emissionRate = 15000;
var objectSize = 3; // drawSize of emitter/field

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
  
  var particlesLength = particles.length;
  for (var i = 0; i < particlesLength; i++) {
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
  var particlesLength = particles.length;
  for (var i = 0; i < particlesLength; i++) {
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

var emitters = [
  new Emitter(new Vector(midX + 50, midY), Vector.fromAngle(6, 2))
];

var fields = [
  new Field(new Vector(midX + 100, midY + 200), 700),
  new Field(new Vector(midX - 100, midY + 20), 250),
  new Field(new Vector(midX + 0, midY + 20), -20)
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
