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

function getPotentialEnergy(th1, th2){
    const { g, m1, m2, l1, l2 } = getParams();

    const h1 = l1 + l2 - l1 * Math.cos(th1);
    const h2 = h1 - l2 * Math.cos(th2);

    const PE = m1 * g * h1 + m2 * g * h2;

    return PE;
}

console.log(getPotentialEnergy(Math.PI/2, Math.PI/2));