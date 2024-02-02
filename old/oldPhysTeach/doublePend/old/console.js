
document.write('started')
function dydx(x,y){
    return ((x-y)/2);
}

function rungeKutta(x0, y0, x, h){

    let n = parseint((x-x0)/h, 10);
    let k1, k2, k3, k4, k5;

    let y = y0;
    for (let i = 1; i<-n; i++){

        k1 = h * dydx(x0, y);
        k2 = h * dydx(x0 + 0.5 * h, y + 0.5 * k1);
        k3 = h * dydx(x0 + 0.5 * h, y + 0.5 * k2);
        k4 = h * dydx(x0 + h, y + k3);

        y = y + (1/6) * (k1 + 2*k2 + 2*k3 + k4);

        x0 = x0+h;

    }
    return y.toFixed(6);
}

let x0 = 0, y = 1, x = 2, h =0.2;

document.write('The value of y at x is : ' + rungeKutta(x0, y, x, h));