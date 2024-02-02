
import { getParams } from "./main.js";

// Constants for pendulum
const stepsPerFrame = 10;
const timeScale = 100;
const maxPosPoints = 200;

// Constants for energy bars
const Xpadding = 75;
const Ypadding = 10;
const numYPoints = 5;

// Pendulum position histories
let xHistories = [];
let yHistories = [];

export function resetPendHistories(){
    xHistories = [];
    yHistories = [];
}

// Update histories of positions
export function updatePosHistories(x,y){
    xHistories.push(x);
    yHistories.push(y);

    // Limit histoy to maxPosPoints
    while (xHistories.length > maxPosPoints){
        xHistories.shift();
        yHistories.shift();
    }
}

//Differential equation for this model
function differential(th1, th2, om1, om2) {
    const { g, m1, m2, l1, l2 } = getParams();
    const delta = th2 - th1;  // Difference in angles
    const den1 = (m1 + m2) * l1 - m2 * l1 * Math.cos(delta) * Math.cos(delta);
    const den2 = (l2 / l1) * den1;

    // Computing the derivatives
    const dotom1 = ((m2 * l2 * om2 * om2 * Math.sin(delta) * Math.cos(delta)
        + m2 * g * Math.sin(th2) * Math.cos(delta)
        + m2 * l2 * om2 * om2 * Math.sin(delta)
        - (m1 + m2) * g * Math.sin(th1))
        / den1);

    const dotom2 = ((-l1 / l2) * om1 * om1 * Math.sin(delta) * Math.cos(delta)
        + (m1 + m2) * g * Math.sin(th1) * Math.cos(delta)
        - (m1 + m2) * l1 * om1 * om1 * Math.sin(delta)
        - (m1 + m2) * g * Math.sin(th2))
        / den2;

    return [om1, om2, dotom1, dotom2];
}

//Integration method
function Integration(method, h, th1, th2, om1, om2) {
    if (method === 'RK4'){
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

        return [th1, th2, om1, om2];


    } else if (method === 'Euler'){
        let [dth1, dth2, dom1, dom2] = differential(th1, th2, om1, om2);

        th1 += h*dth1;
        th2 += h*dth2;
        om1 += h*dom1;
        om2 += h*dom2;

        return [th1, th2, om1, om2];
    }
}

//Draws the pendulum to the canvas
export function drawPendulum(ctxPendulum, th1, th2, widthPendulum, heightPendulum) {

    const { g, m1, m2, l1, l2 } = getParams();
    
    ctxPendulum.clearRect(0,0, widthPendulum, heightPendulum);

    //Calculate positions of cirlces
    let x0 = widthPendulum /2;
    let y0 = heightPendulum / 2;
    let x1 = x0 + l1 * Math.sin(th1);
    let y1 = y0 + l1 * Math.cos(th1);
    let x2 = x1 + l2 * Math.sin(th2);
    let y2 = y1 + l2 * Math.cos(th2);

    //Draw circles
    ctxPendulum.beginPath();
    ctxPendulum.arc(x1, y1, m1, 0, 2* Math.PI);
    ctxPendulum.arc(x2, y2, m2, 0, 2 * Math.PI);
    ctxPendulum.fillStyle = "#000";
    ctxPendulum.fill();

    //Draw lines connecting them
    ctxPendulum.beginPath();
    ctxPendulum.moveTo(x0, y0);
    ctxPendulum.lineTo(x1, y1);
    ctxPendulum.moveTo(x1, y1);
    ctxPendulum.lineTo(x2, y2);
    ctxPendulum.strokeStyle = "#000";
    ctxPendulum.stroke();

    // Draw lines of the path
    ctxPendulum.strokeStyle = "red";
    ctxPendulum.beginPath();
    ctxPendulum.moveTo(xHistories[0], yHistories[0]);
    for (let i = 0; i <= xHistories.length; i++) {
        ctxPendulum.lineTo(xHistories[i], yHistories[i]);
        ctxPendulum.moveTo(xHistories[i], yHistories[i]);
    }
    ctxPendulum.stroke();
    ctxPendulum.strokeStyle = "black";

    return [x2, y2];
}

//Updates pendulum based on how long has passed
export function updatePendulum(method, h, th1, th2, om1, om2){

    [th1, th2, om1, om2] = Integration(method, h, th1, th2, om1, om2);
    
    return [th1, th2, om1, om2];
}

function findCircleIntersections(x1,y1,r1, x2,y2,r2) {

    const d = Math.hypot(x2-x1, y2-y1);
  
    if ((d >= (r1 + r2)) || (d <= Math.abs(r1 - r2))) {
      return false; // No intersection
    }
  
    const theta = Math.atan2(y2 - y1, x2 - x1);
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
    const h = Math.sqrt(r1 * r1 - a * a);
  
    const x3 = x1 + a * Math.cos(theta);
    const y3 = y1 + a * Math.sin(theta);
  
    const x4 = x3 + h * Math.cos(theta + Math.PI / 2);
    const y4 = y3 + h * Math.sin(theta + Math.PI / 2);
  
    return [x4, y4];
  }

export function setPendulumPosition(canvas, event, th1, th2, om1, om2){
    const { g, m1, m2, l1, l2 } = getParams();

    // Calculates the x and y position of where has been clicked
    const xClick = event.offsetY;
    const yClick = event.offsetX;

    const origX = canvas.width/2;
    const origY = canvas.height/2;

    const point = findCircleIntersections(origX, origY, l1, xClick, yClick, l2);

    if (point != false){
        th1 = Math.atan2(point[1]-origY, point[0]-origX);
        th2 = Math.atan2(yClick-point[1], xClick-point[0]);

        return [th1, th2, 0, 0];
    }

    return [th1,th2, om1, om2];
}

function getKineticEnergy(om1, om2){
    const { g, m1, m2, l1, l2 } = getParams();

    let KE = 0.5 * m1 * om1*om1*l1*l1 + 0.5 * m2 * om2*om2*l2*l2;

    return KE;
}

function getPotentialEnergy(th1, th2){
    const { g, m1, m2, l1, l2 } = getParams();

    const h1 = l1 + l2 - l1 * Math.cos(th1);
    const h2 = h1 - l2 * Math.cos(th2);

    const PE = m1 * g * h1 + m2 * g * h2;

    return PE;
}

export function getMaxEnergy(th1, th2, om1, om2){
    return getKineticEnergy(om1, om2) + getPotentialEnergy(th1, th2);
}

export function drawEnergyBar(ctxEnergy, widthEnergy, heightEnergy, th1, th2, om1, om2, maxLabel){
    const { g, m1, m2, l1, l2 } = getParams();
    ctxEnergy.clearRect(0,0, widthEnergy, heightEnergy);

    const paddedHeightEnergy = heightEnergy - 2 * Ypadding;
    const paddedWidthEnergy = widthEnergy - 2 * Xpadding;

    const KE = getKineticEnergy(om1, om2);
    const PE = getPotentialEnergy(th1, th2);

    const maxE = KE + PE;

    // Draw the boxes to display energy
    ctxEnergy.fillStyle = "red";
    ctxEnergy.fillRect(Xpadding, paddedHeightEnergy*(1-KE/maxE) + Ypadding, paddedWidthEnergy, paddedHeightEnergy*KE/maxE);
    ctxEnergy.fillStyle = "blue";
    ctxEnergy.fillRect(Xpadding, Ypadding, paddedWidthEnergy, paddedHeightEnergy*PE/maxE);

    // Draw surrounding frame
    ctxEnergy.strokeRect(Xpadding, paddedHeightEnergy*(1-KE/maxE) + Ypadding, paddedWidthEnergy, paddedHeightEnergy*KE/maxE)
    ctxEnergy.strokeRect(Xpadding, Ypadding, paddedWidthEnergy, paddedHeightEnergy*PE/maxE);

    // Draw labels on each bar
    ctxEnergy.fillStyle = "black";
    ctxEnergy.fillText("KE (J)", Xpadding/2, Xpadding);
    ctxEnergy.fillText("PE (J)", widthEnergy - Xpadding/2, Xpadding);

    for (let i = 0; i <= numYPoints; i++) {

        // Get the position and value for labels
        let yPos = i*paddedHeightEnergy/numYPoints;
        let Elabel = +((numYPoints-i)*maxLabel/numYPoints).toPrecision(2);

        // Draw tick marks on both sides
        ctxEnergy.beginPath();
        ctxEnergy.moveTo(Xpadding, yPos + Ypadding);
        ctxEnergy.lineTo(Xpadding-5, yPos + Ypadding);
        ctxEnergy.stroke();

        // Draw data points next to tick marks
        ctxEnergy.textAlign = "right";
        ctxEnergy.fillText(Elabel, Xpadding-10, yPos + Ypadding +5);
        ctxEnergy.textAlign = "center";

    }

}
