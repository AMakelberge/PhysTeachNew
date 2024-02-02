

let l1=1, l2=1, m1=0.5, m2=0.5, g=9.81;
let theta1 = 0.5, theta2=3.141592, dtheta1 = 0.4, dtheta2=0.1;

function f1(theta1, theta2, dtheta1, dtheta2){
    return(-(l2/l1)*(m2/(m1+m2))*(dtheta2**2*Math.sin(theta1-theta2)) -(g/l1)*Math.sin(theta1));
}
function f2(theta1, theta2, dtheta1, dtheta2){
    return((l1/l2)*(dtheta1**2)*Math.sin(theta1-theta2) - (g/l2)*Math.sin(theta2));
}
function alpha1(theta1, theta2){
    return((l2/l1)*(m2/(m1+m2))*Math.cos(theta1-theta2))
}
function alpha2(theta1, theta2){
    return((l1/l2)*Math.cos(theta1-theta2))
}
function g1(theta1, theta2, dtheta1, dtheta2){
    return((f1(theta1, theta2, dtheta1, dtheta2) - alpha1(theta1, theta2)*f2(theta1, theta2, dtheta1, dtheta2))/(1 - alpha1(theta1, theta2)*alpha2(theta1, theta2)))
}
function g2(theta1, theta2, dtheta1, dtheta2){
    return((f2(theta1, theta2, dtheta1, dtheta2) - alpha1(theta1, theta2)*f1(theta1, theta2, dtheta1, dtheta2))/(1 - alpha1(theta1, theta2)*alpha2(theta1, theta2)))
}
function rungeKutta(x0, y0, func, h)
{
    let k1, k2, k3, k4;
 
    let y = y0;  

    k1 = h * func(x0, theta2, y, dtheta2);
    k2 = h * func(x0 + 0.5 * h,theta2, y + 0.5 * k1, dtheta2);
    k3 = h * func(x0 + 0.5 * h,theta2, y + 0.5 * k2, dtheta2);
    k4 = h * func(x0 + h,theta2, y + k3, dtheta2);


    y = y + (1 / 6) * (k1 + 2 * k2 +
                        2 * k3 + k4);;

    return y;
}




let x0 = 0, y = 1, h = 0.2;
 
console.log("g1: " + rungeKutta(theta1, dtheta1,g1, h));
console.log("g1: " + rungeKutta(theta1, dtheta1,g2, h));