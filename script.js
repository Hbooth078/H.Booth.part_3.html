// --------------------------
// Canvas Setup
// --------------------------
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --------------------------
// Mouse Tracking
// --------------------------
const mouse = {
    x: undefined,
    y: undefined,
    radius: 80 // distance for interaction
};

window.addEventListener("mousemove", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// --------------------------
// Window Resize Handling
// --------------------------
window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init(); // rebuild particles so they fill new screen
});

// --------------------------
// Particle Class
// --------------------------
class Particle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.baseRadius = radius; // original size
        this.radius = radius;
        this.color = color;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.speedX *= -1;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.speedY *= -1;
        }

        // Interaction with mouse
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            // grow smoothly
            if (this.radius < this.baseRadius * 3) {
                this.radius += 1;
            }
        } else {
            // shrink smoothly
            if (this.radius > this.baseRadius) {
                this.radius -= 0.5;
            }
        }

        this.draw();
    }
}

// --------------------------
// Create Particles
// --------------------------
let particlesArray = [];

function init() {
    particlesArray = [];
    const numberOfParticles = 200;

    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 4 + 1;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y, size, "white"));
    }
}

init();

// --------------------------
// Animation Loop
// --------------------------
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach(particle => particle.update());

    requestAnimationFrame(animate);
}

animate();
