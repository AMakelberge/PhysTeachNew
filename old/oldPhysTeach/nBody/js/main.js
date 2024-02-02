// Define Planet class
class Planet {
    constructor(x, y, mass, velocity, radius, colour) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.velocity = velocity;
        this.radius = radius;
        this.colour = colour;
        this.maxPathSize = 200;
        this.path = [];
    }

    // Sets the position of the planet
    setPosition(x,y) {
        this.x = x;
        this.y = y;
    }

    // Updates this point on the path
    pushPath(x,y){
        this.path.push([x,y]);
        // Removes the first value if the list is too long so only some of the value get shown
        while (this.path.length > this.maxPathSize) {
            this.path.shift();
        }
    }

    // Returns the path
    getPath(){
        return this.path;
    }
}

// Converst values from an astronomical size to the size that fits on a screen
function physicsToScreenPosition(x, y) {
    let screenX = x/1e10;
    let screenY = y/1e10;
    if (screenX == undefined){
        screenX = 0;
    }
    if (screenY == undefined){
        screenY = 0;
    }
    return {screenX, screenY}
}

// Initialize array of planets
const planets = [
    new Planet(250e10, 400e10, 5.97219e24, { x:0, y: 1e10}, 10, "blue"),
    new Planet(500e10, 400e10, 1.989e26, { x:0, y: 0}, 10, "yellow")
];

// Set up canvas to control the html
const canvas = document.getElementById("nbodyCanvas");
const ctx = canvas.getContext("2d");

// Calculates forces between two planets based on newton
function calculateForces(planet1, planet2){
    const G = 6.67430e6;
    const dx = planet2.x - planet1.x;
    const dy = planet2.y - planet1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Stops divide by zero error
    const epsilon = 1e8;
    const force = (G * planet1.mass * planet2.mass) / (distance * distance + epsilon);

    // Split force into x and y components
    const angle = Math.atan2(dy, dx);
    const forceX = force * Math.cos(angle);
    const forceY = force * Math.sin(angle);

    return { forceX, forceY };
}

// Updates the positions of all the planets
function updatePlanets() {
    for (const planet1 of planets) {
        let forceX = 0;
        let forceY = 0;

        for (const planet2 of planets) {
            if (planet1 !== planet2) {
                const {forceX: fx, forceY: fy} = calculateForces(planet1, planet2);
                forceX += fx;
                forceY += fy;
            }
        }

        // Calculate acceleration
        const accelerationX = forceX / planet1.mass;
        const accelerationY = forceY / planet1.mass;

        // Update velocity with acceleration
        planet1.velocity.x += accelerationX;
        planet1.velocity.y += accelerationY;

        // Update position with velocity
        planet1.x += planet1.velocity.x;
        planet1.y += planet1.velocity.y;

    }
}

// Draw the planets
function drawPlanets() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    //ctx.fillStyle = "black";
    //ctx.fillRect(0,0, canvas.width, canvas.height);
    for (const planet of planets) {
        ctx.beginPath()
        const {screenX, screenY} = physicsToScreenPosition(planet.x, planet.y);
        ctx.arc(screenX, screenY, planet.radius, 0, 2*Math.PI);
        ctx.fillStyle = planet.colour;
        ctx.fill();
        planet.pushPath(screenX, screenY);
    }
}

// Draws the path of the planet onto the screen
function drawPaths(){
    for (planet of planets){
        path = planet.getPath();
        ctx.strokeStyle = "black";
        ctx.moveTo(path[0][0], path[0][1]);
        console.log(path)
        for (const coords of path){
            ctx.beginPath();
            ctx.lineTo(coords[0], coords[1]);
            ctx.moveTo(coords[0], coords[1]);
            ctx.stroke();
        }
    }
}

// Update the simulation
function run() {
    updatePlanets();

    drawPlanets();

    drawPaths();

    requestAnimationFrame(run);
}

run();