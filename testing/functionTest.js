//Clamp angles between pi and -pi
function normaliseAngle(angle){
    angle = angle % (2 * Math.PI);
    if (angle > Math.PI) {
        angle -= 2 * Math.PI;
    } else if (angle < -Math.PI) {
        angle += 2 * Math.PI;
    }
    return angle;
}

function getParams(){
    return {g:9.81, m1:5, m2:5, l1:100, l2:100}
}

function getKineticEnergy(om1, om2){
    const { g, m1, m2, l1, l2 } = getParams();

    let KE = 0.5 * m1 * om1*om1*l1*l1 + 0.5 * m2 * om2*om2*l2*l2;

    return KE;
}

console.log(getKineticEnergy(Math.PI, Math.PI))

function getPotentialEnergy(th1, th2){
    const { g, m1, m2, l1, l2 } = getParams();

    const h1 = l1 + l2 - l1 * Math.cos(th1);
    const h2 = h1 - l2 * Math.cos(th2);

    const PE = m1 * g * h1 + m2 * g * h2;

    return PE;
}

function findCircleIntersections(x1,y1,r1, x2,y2,r2) {

    const d = Math.hypot(x2-x1, y2-y1);
  
    if ((d > (r1 + r2)) || (d < Math.abs(r1 - r2))) {
        return false; // No intersection
    }

    const theta = Math.atan2(y2 - y1, x2 - x1);
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
    const h = Math.sqrt(r1 * r1 - a * a);
  
    const x3 = x1 + a * Math.cos(theta);
    const y3 = y1 + a * Math.sin(theta);
  
    const x4 = x3 + h * Math.cos(theta + Math.PI / 2);
    const y4 = y3 + h * Math.sin(theta + Math.PI / 2);
  
    // Arbitrarily returns to positive value and doesn't calculate other intersection
    // As it is not needed
    return [x4, y4];
  }

console.log(findCircleIntersections(0,0,1,2,0,2))