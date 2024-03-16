
function differential(x,y,z,w){
    return [x,y,z,w]
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

function solution(t, A=1){
    return A*Math.exp(t);
}

const h = 0.01;
const finalVal = 10;
const steps = finalVal/h;
let x=1, y=1, z=1, w=1;
let a=1, b=1, c=1, d=1;
let solutionX = 0;
let dataEuler = [];
let dataSolution = [];
let dataRK4 = [];

for (let t = 0; t <= steps; t++){
    let time = t*h;

    dataSolution.push({x:solutionX, time:time});
    solutionX = solution(time);

    dataRK4.push({x:a, time:time});
    [a, b, c, d] = Integration('RK4', h, a, b, c, d);

    dataEuler.push({x:x, time:time});
    [x, y, z, w] = Integration('Euler', h, x, y, z, w);

}

var ctx = document.getElementById('testCanvas').getContext('2d');
var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: dataRK4.map(data => data.time.toFixed(2)),
        datasets: [{
            label: 'RK4',
            borderColor: 'rgb(255, 99, 132)',
            data: dataRK4.map(data => data.x),
            fill: false,
        }, {
            label: 'Euler',
            borderColor: 'rgb(99, 255, 132)',
            data: dataEuler.map(data => data.x),
            fill: false,
        }, {
            label: 'Solution',
            borderColor: 'rgb(132, 99, 255)',
            data: dataSolution.map(data => data.x),
            fill: false,
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Displacement'
                }
            }
        }
    }
});