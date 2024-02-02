// Constants
const stepsPerFrame = 10;  // The number of timesteps that will occur each frame to ensure accuracy
const intervals = 5;
const timeScale = 100.0; // Adjust this to your preference, 100.0 means real-time, > 100.0 means faster, < 100.0 means slower

// Initial conditions and parameters
let g = 9.81;  // Acceleration due to gravity
let h = 0.02;  // The timestep value is a trade-off between accuracy and compute-speed
let m1 = 5;   // Mass of the first pendulum bob
let m2 = 5;   // Mass of the second pendulum bob
let l1 = 100; // Length of the first pendulum rod
let l2 = 100; // Length of the second pendulum rod
let th1 = 90 * (Math.PI / 180); // Initial angle of the first pendulum (converted to radians)
let th2 = 30 * (Math.PI / 180); // Initial angle of the second pendulum (converted to radians)
let om1 = 0;  // Initial angular velocity of the first pendulum
let om2 = 0;  // Initial angular velocity of the second pendulum

// Initialises inputs
var gravSlider = document.getElementById('gravSlider');
var m1Slider = document.getElementById('m1Slider');
var m2Slider = document.getElementById('m2Slider');
var l1Slider = document.getElementById('l1Slider');
var l2Slider = document.getElementById('l2Slider');
var hSlider = document.getElementById('hSlider');
var gravAmount = document.getElementById('gravAmount');
var m1Amount = document.getElementById('m1Amount');
var m2Amount = document.getElementById('m2Amount');
var l1Amount = document.getElementById('l1Amount');
var l2Amount = document.getElementById('l2Amount');
var hAmount = document.getElementById('hAmount');
var pauseCheck = document.getElementById('pauseCheck');
var resetButton = document.getElementById('resetButton');
var yGraphSelect = document.getElementById('yGraphSelect');
var xGraphSelect = document.getElementById('xGraphSelect');

// Canvas setup for pendulum
let canvas = document.querySelector('#canvasPendulum');
let ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
let x0 = width / 2;  // Horizontal starting point
let y0 = height / 5; // Vertical starting point
let x1 = x0 + l1 * Math.sin(th1);
let y1 = y0 + l1 * Math.cos(th1);
let x2 = x1 + l2 * Math.sin(th2);
let y2 = y1 + l2 * Math.cos(th2);

// Canvas setup for graph
let canvasGraph = document.querySelector('#canvasGraph');
let ctxGraph = canvasGraph.getContext('2d');
const widthGraph = canvasGraph.width;
const heightGraph = canvasGraph.height;

// Graph histories and scales
let graphHistoryTh1 = [];
let graphHistoryTh2 = [];
let graphHistoryOm1 = [];
let graphHistoryOm2 = [];
let graphHistoryTime = [];
const maxGraphPoints = 500;  // Number of points to store and display on the graph
const xSpacing = widthGraph / maxGraphPoints;
const yScale = heightGraph / (2 * Math.PI); // Pixels per radian
const xScale = widthGraph / (2*Math.PI)
yGraph = yGraphSelect.value;
xGraph = xGraphSelect.value;

function restartVariables(){
    th1 = 90 * (Math.PI / 180);
    graphHistoryTh1 = [];
    th2 = 30 * (Math.PI / 180);
    graphHistoryTh2 = [];
    om1 = 0;
    graphHistoryOm1 = [];
    om2 = 0;
    graphHistoryOm2 = [];
}

function resetVariables(){
    g = 9.81;
    gravSlider.value = 9.81;
    gravAmount.value = 9.81;
    h = 0.02;
    hSlider.value = 0.02;
    hAmount.value = 0.02;
    m1 = 5;
    m1Slider.value = 5;
    m1Amount.value = 5;
    m2 = 5;
    m2Slider.value = 5;
    m2Amount.value = 5;
    l1 = 100;
    l1Slider.value = 100;
    l1Amount.value = 100;
    l2 = 100;
    l2Slider.value = 100;
    l2Amount.value = 100;
    th1 = 90 * (Math.PI / 180);
    graphHistoryTh1 = [];
    th2 = 30 * (Math.PI / 180);
    graphHistoryTh2 = [];
    om1 = 0;
    graphHistoryOm1 = [];
    om2 = 0;
    graphHistoryOm2 = [];
}

function normalizeAngle(angle) {
    // Normalize an angle to the range [-π, π]
    angle = angle % (2 * Math.PI);
    if (angle > Math.PI) {
        angle -= 2 * Math.PI;
    } else if (angle < -Math.PI) {
        angle += 2 * Math.PI;
    }
    return angle;
}

function differential(th1, th2, om1, om2) {
    let delta = th2 - th1;  // Difference in angles
    let den1 = (m1 + m2) * l1 - m2 * l1 * Math.cos(delta) * Math.cos(delta);
    let den2 = (l2 / l1) * den1;

    // Computing the derivatives
    let dotom1 = ((m2 * l2 * om2 * om2 * Math.sin(delta) * Math.cos(delta)
        + m2 * g * Math.sin(th2) * Math.cos(delta)
        + m2 * l2 * om2 * om2 * Math.sin(delta)
        - (m1 + m2) * g * Math.sin(th1))
        / den1);

    let dotom2 = ((-l1 / l2) * om1 * om1 * Math.sin(delta) * Math.cos(delta)
        + (m1 + m2) * g * Math.sin(th1) * Math.cos(delta)
        - (m1 + m2) * l1 * om1 * om1 * Math.sin(delta)
        - (m1 + m2) * g * Math.sin(th2))
        / den2;

    return [om1, om2, dotom1, dotom2];
}

function rk4Integration(h) {
    let [k1_th1, k1_th2, k1_om1, k1_om2] = differential(th1, th2, om1, om2);
    let [k2_th1, k2_th2, k2_om1, k2_om2] = differential(
        th1 + 0.5 * h * k1_th1,
        th2 + 0.5 * h * k1_th2,
        om1 + 0.5 * h * k1_om1,
        om2 + 0.5 * h * k1_om2
    );
    let [k3_th1, k3_th2, k3_om1, k3_om2] = differential(
        th1 + 0.5 * h * k2_th1,
        th2 + 0.5 * h * k2_th2,
        om1 + 0.5 * h * k2_om1,
        om2 + 0.5 * h * k2_om2
    );
    let [k4_th1, k4_th2, k4_om1, k4_om2] = differential(
        th1 + h * k3_th1,
        th2 + h * k3_th2,
        om1 + h * k3_om1,
        om2 + h * k3_om2
    );

    th1 += (h / 6) * (k1_th1 + 2 * k2_th1 + 2 * k3_th1 + k4_th1);
    th2 += (h / 6) * (k1_th2 + 2 * k2_th2 + 2 * k3_th2 + k4_th2);
    om1 += (h / 6) * (k1_om1 + 2 * k2_om1 + 2 * k3_om1 + k4_om1);
    om2 += (h / 6) * (k1_om2 + 2 * k2_om2 + 2 * k3_om2 + k4_om2);
}

function drawGraph(xGraph, yGraph) {
    ctxGraph.clearRect(0, 0, widthGraph, heightGraph);

    ctxGraph.font = "16px Arial";
    ctxGraph.textAlign = "right";
    ctxGraph.fillText("\u03C0", widthGraph/2-10, 20);
    ctxGraph.fillText("-\u03C0", widthGraph/2-10, heightGraph - 10);
    ctxGraph.beginPath();

    // Tick marks for +- pi on y
    ctxGraph.moveTo(widthGraph / 2 - 5, 15);
    ctxGraph.lineTo(widthGraph / 2, 15);
    ctxGraph.moveTo(widthGraph / 2 - 5, heightGraph - 15);
    ctxGraph.lineTo(widthGraph / 2, heightGraph - 15);
    ctxGraph.stroke();


    if (xGraph != 'graphHistoryTime'){
        ctxGraph.textAlign = "center";
        ctxGraph.fillText("\u03C0", 15, heightGraph/2 + 20);
        ctxGraph.fillText("-\u03C0", widthGraph - 15, heightGraph/2 + 20);
        ctxGraph.beginPath();
    
        // Tick marks for +- pi on y
        ctxGraph.moveTo(widthGraph -12, heightGraph/2 + 5);
        ctxGraph.lineTo(widthGraph -12, heightGraph/2);
        ctxGraph.moveTo( 15, heightGraph/2 + 5);
        ctxGraph.lineTo( 15, heightGraph/2);
        ctxGraph.stroke();

        const pixelPerDataPoint = widthGraph / graphHistoryTh1.length;
        const elapsedTime = graphHistoryTh1.length * h * stepsPerFrame;
        // Loop through graph history and plot
        for (let i = 1; i < eval(xGraph).length; i++) {
            ctxGraph.beginPath();
            let prevY = normalizeAngle(eval(yGraph)[i-1]);
            let currY = normalizeAngle(eval(yGraph)[i]);
            let prevX = normalizeAngle(eval(xGraph)[i-1]);
            let currX = normalizeAngle(eval(xGraph)[i]);
            ctxGraph.moveTo(widthGraph/2 - prevX*xScale, heightGraph / 2 - prevY * yScale);
            ctxGraph.lineTo(widthGraph/2 - currX*xScale, heightGraph / 2 - currY * yScale);
            if ((Math.abs(prevY - currY) > Math.PI) || (Math.abs(prevX - currX) > Math.PI)){
                ctxGraph.strokeStyle = "#00000000"; //Invisible if angle greater than 2PI
            }else{
                ctxGraph.strokeStyle = "#FF0000";  // Red for angle th1
            };
            
            ctxGraph.stroke();
        }
    }else{
        // X-axis labels
        ctxGraph.textAlign = "center";
        const elapsedTimePerPoint = h * stepsPerFrame;
        const timePerInterval = maxGraphPoints * elapsedTimePerPoint / intervals;
        const currentElapsedTime = eval(xGraph).length * elapsedTimePerPoint;

        for (let i = 0; i <= intervals; i++) {
            let xPos = i * (widthGraph / intervals);
            let timePos = eval(xGraph)[Math.floor((i*maxGraphPoints)/intervals)]
            if (timePos == undefined){
                timePos = 100
            }
            let timeLabel = timePos.toFixed(2) + 's';  // Adjusted to start from the earliest data point
            ctxGraph.fillText(timeLabel, xPos, heightGraph/2 + 30);

            // Tick marks for x-axis labels
            ctxGraph.beginPath();
            ctxGraph.moveTo(xPos, heightGraph/2);
            ctxGraph.lineTo(xPos, heightGraph/2 + 10);
            ctxGraph.stroke();
        }
        const pixelPerDataPoint = widthGraph / graphHistoryTh1.length;
        const elapsedTime = graphHistoryTh1.length * h * stepsPerFrame;
        // Loop through graph history and plot
        for (let i = 1; i < graphHistoryTh1.length; i++) {
            ctxGraph.beginPath();
            let prevR = normalizeAngle(graphHistoryTh1[i-1]);
            let currR = normalizeAngle(graphHistoryTh1[i]);
            ctxGraph.moveTo((i - 1) * pixelPerDataPoint, heightGraph / 2 - prevR * yScale);
            ctxGraph.lineTo(i * pixelPerDataPoint, heightGraph / 2 - currR * yScale);
            if (Math.abs(prevR - currR) > Math.PI){
                ctxGraph.strokeStyle = "#00000000" //Invisible if angle greater than 2PI
            }else{
                ctxGraph.strokeStyle = "#FF0000";  // Red for angle th1
            }
            
            ctxGraph.stroke();
    
            ctxGraph.beginPath();
            let prevB = normalizeAngle(graphHistoryTh2[i-1]);
            let currB = normalizeAngle(graphHistoryTh2[i]);
            ctxGraph.moveTo((i - 1) * pixelPerDataPoint, heightGraph / 2 - prevB * yScale);
            ctxGraph.lineTo(i * pixelPerDataPoint, heightGraph / 2 - currB * yScale);
            if (Math.abs(prevB - currB) > Math.PI){
                ctxGraph.strokeStyle = "#00000000" //Invisible if angle greater than 2PI
            }else{
                ctxGraph.strokeStyle = "#0000FF";  // Blue for angle th2
            }
            ctxGraph.stroke();
        }

    }

    // Draw axes
    ctxGraph.beginPath();
    ctxGraph.moveTo(0, heightGraph / 2);
    ctxGraph.lineTo(widthGraph, heightGraph / 2);
    ctxGraph.moveTo(widthGraph / 2, 0);
    ctxGraph.lineTo(widthGraph / 2, heightGraph);
    ctxGraph.strokeStyle = "#000000";
    ctxGraph.stroke();

    // Drawing the graph key/legend
    ctxGraph.fillStyle = "#FF0000";
    ctxGraph.fillRect(10, 10, 20, 20);
    ctxGraph.fillStyle = "#000000";
    ctxGraph.fillText("th1", 45, 25);

    ctxGraph.fillStyle = "#0000FF";
    ctxGraph.fillRect(10, 40, 20, 20);
    ctxGraph.fillStyle = "#000000";
    ctxGraph.fillText("th2", 45, 55);

}

let lastTime = 0; // Store the time of the last frame
let totalTimeElapsed = 0; // Initialize a time variable

function draw(currentTime = 0) {
    // updates dynamic variables
    g = gravSlider.value;
    m1 = m1Slider.value;
    m2 = m2Slider.value;
    l1 = l1Slider.value;
    l2 = l2Slider.value;
    h = hSlider.value;
    yGraph = yGraphSelect.value;
    xGraph = xGraphSelect.value;

    drawGraph(xGraph, yGraph);

    // Calculate the time difference (delta time) since the last frame
    let deltaTime = (currentTime - lastTime) / 1000;  // Convert milliseconds to seconds
    lastTime = currentTime;

    if (pauseCheck.checked == false){
        // Clear the canvas
        ctx.clearRect(0, 0, width, height);

        // Calculate how many steps need to be taken for the current frame based on delta time
        let stepsForThisFrame = Math.round(stepsPerFrame * deltaTime * timeScale);

        for (let i = 0; i < stepsForThisFrame; i++) {
            rk4Integration(h);
        }

        x1 = x0 + l1 * Math.sin(th1);
        y1 = y0 + l1 * Math.cos(th1);
        x2 = x1 + l2 * Math.sin(th2);
        y2 = y1 + l2 * Math.cos(th2);

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#000";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x1, y1, 10, 0, 2 * Math.PI);
        ctx.arc(x2, y2, 10, 0, 2 * Math.PI);
        ctx.fillStyle = "#000";
        ctx.fill();

        graphHistoryTh1.push(normalizeAngle(th1));
        graphHistoryTh2.push(normalizeAngle(th2));
        graphHistoryOm1.push(normalizeAngle(om1));
        graphHistoryOm2.push(normalizeAngle(om2));
        graphHistoryTime.push(totalTimeElapsed);

        // Limit the history to maxGraphPoints
        while (graphHistoryTh1.length > maxGraphPoints) {
            graphHistoryTh1.shift();
            graphHistoryTh2.shift();
            graphHistoryOm1.shift();
            graphHistoryOm2.shift();
            graphHistoryTime.shift();
        }

        // Update time
        totalTimeElapsed += h * stepsForThisFrame;
    } 
    requestAnimationFrame(draw);
}

draw();