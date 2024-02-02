
const g = 9.81; //

let m1 = 5;
let m2 = 5;
let l1 = 100;
let l2 = 100;
let th1 = 180 * (Math.PI / 180);
let th2 = 90 * (Math.PI / 180);
let om1 = 0;
let om2 = 0; 

let iterationsPerFrame = 10;
let h = 0.02;

let canvas = document.querySelector('#pendulumCanvas');
let ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
let x0 = width / 2;
let y0 = height / 5;

function differential(th1, th2, om1, om2) {
    let delta = th2 - th1;
    let den1 = (m1 + m2) * l1 - m2 * l1 * Math.cos(delta) * Math.cos(delta);
    let den2 = (l2 / l1) * den1;

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

    th1 += h / 6 * (k1_th1 + 2 * k2_th1 + 2 * k3_th1 + k4_th1);
    th2 += h / 6 * (k1_th2 + 2 * k2_th2 + 2 * k3_th2 + k4_th2);
    om1 += h / 6 * (k1_om1 + 2 * k2_om1 + 2 * k3_om1 + k4_om1);
    om2 += h / 6 * (k1_om2 + 2 * k2_om2 + 2 * k3_om2 + k4_om2);
}

function draw() {
    for (let i = 0; i < iterationsPerFrame; i++) {
        rk4Integration(h);  // The value of 0.02 was chosen for `h` after experimentation to give the most accurate results.
    }

    let x1 = x0 + l1 * Math.sin(th1);
    let y1 = y0 + l1 * Math.cos(th1);
    let x2 = x1 + l2 * Math.sin(th2);
    let y2 = y1 + l2 * Math.cos(th2);

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    requestAnimationFrame(draw);
}

draw();
