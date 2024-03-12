
// Graph constants
const padding = 5;
const numXTimePoints = 5;
const maxGraphPoints = 200;

//Graph histories
let graphHistoryTh1 = [];
let graphHistoryTh2 = [];
let graphHistoryOm1 = [];
let graphHistoryOm2 = [];
let graphHistoryTime = [];
let drawPoint = false;
let closestPoint = [0,0];

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

// Update the history lists to add the latest values
export function updateHistories(th1, th2, om1, om2, totalFrames){
    graphHistoryTh1.push(normaliseAngle(th1));
    graphHistoryTh2.push(normaliseAngle(th2));
    graphHistoryOm1.push(normaliseAngle(om1));
    graphHistoryOm2.push(normaliseAngle(om2));
    graphHistoryTime.push(totalFrames);

    // Limit the history to maxGraphPoints
    while (graphHistoryTh1.length > maxGraphPoints) {
        graphHistoryTh1.shift();
        graphHistoryTh2.shift();
        graphHistoryOm1.shift();
        graphHistoryOm2.shift();
        graphHistoryTime.shift();
    }
}

// Empty the histories to reset the graph
export function resetHistories(){
    graphHistoryTh1 = [];
    graphHistoryTh2 = [];
    graphHistoryOm1 = [];
    graphHistoryOm2 = [];
}

// Gets the smallest value in an array of dictionaries by a certain key
const minBy = (arr, key) => arr.reduce((a,b) => a[key] < b[key] ? a:b, {});

// Uses a KNN to get cloest point and returns it.
export function drawClosestPoint(canvasGraph, event, xGraph, yGraph, widthGraph, heightGraph){

    // Calculates the x and y position of where has been clicked
    const rect = canvasGraph.getBoundingClientRect();
    const xClick = event.clientX - rect.left;
    const yClick = event.clientY - rect.top;

    //Scaling
    let yScale = heightGraph / (2 * Math.PI);
    let xScale = widthGraph / (2 * Math.PI);
        
    // Get xy data
    let xData = eval(xGraph);
    let yData = eval(yGraph);

    if (xGraph != 'graphHistoryTime'){
        let xPoint = -(xClick / xScale - Math.PI);
        let yPoint = -(yClick / yScale - Math.PI);

        let distances = [];
        for (let i = 0; i < xData.length; i++){
            let distance = Math.sqrt((xPoint-xData[i])**2 + (yPoint-yData[i])**2);
            distances.push({'distance': distance, 'point': [xData[i], yData[i]]});
        }
    
        let closest = minBy(distances, 'distance')

        closestPoint = closest;

        drawPoint = true;
        
    };




}

// Draws the graph to the canvas
export function drawGraph(ctxGraph, xGraph, yGraph, widthGraph, heightGraph, pauseCheck) {

    ctxGraph.clearRect(0,0, widthGraph, heightGraph);

    // Calculate padding so graph items don't go over the edge
    let paddedHeightGraph = heightGraph * (1 - padding/100);
    let paddedWidthGraph = widthGraph * (1 - padding/100); 

    //Scaling
    let yScale = paddedHeightGraph / (2 * Math.PI);
    let xScale = paddedWidthGraph / (2 * Math.PI);

    // Get xy data
    let xData = eval(xGraph);
    let yData = eval(yGraph);

    // Draw axes
    ctxGraph.beginPath();
    ctxGraph.moveTo(0, heightGraph / 2);
    ctxGraph.lineTo(widthGraph, heightGraph / 2);
    ctxGraph.moveTo(widthGraph / 2, 0);
    ctxGraph.lineTo(widthGraph / 2, heightGraph);
    ctxGraph.strokeStyle = "#000000";
    ctxGraph.stroke();

    //+-pi on y scale
    ctxGraph.fillText("\u03C0", widthGraph/2-15, heightGraph/2 - Math.PI*yScale + 5);
    ctxGraph.fillText("-\u03C0", widthGraph/2-15, heightGraph/2 + Math.PI*yScale + 5);

    //Tick marks for y axes
    ctxGraph.beginPath();
    ctxGraph.moveTo(widthGraph/2 - 5, heightGraph/2 - Math.PI*yScale);
    ctxGraph.lineTo(widthGraph/2, heightGraph/2 - Math.PI*yScale);
    ctxGraph.moveTo(widthGraph/2 - 5, heightGraph/2 + Math.PI*yScale);
    ctxGraph.lineTo(widthGraph/2, heightGraph/2 + Math.PI*yScale);
    ctxGraph.stroke();

    //x axes for angle variables
    if (xGraph != 'graphHistoryTime'){
        //+-pi on x scale
        ctxGraph.fillText("\u03C0", widthGraph/2 + Math.PI*xScale, heightGraph/2 + 20);
        ctxGraph.fillText("-\u03C0", widthGraph/2 - Math.PI*xScale, heightGraph/2 + 20);

        //tick marks for x axes
        ctxGraph.beginPath();
        ctxGraph.moveTo(widthGraph/2 - Math.PI*xScale, heightGraph/2 + 5);
        ctxGraph.lineTo(widthGraph/2 - Math.PI*xScale, heightGraph/2);
        ctxGraph.moveTo(widthGraph/2 + Math.PI*xScale, heightGraph/2 + 5);
        ctxGraph.lineTo(widthGraph/2 + Math.PI*xScale, heightGraph/2);
        ctxGraph.stroke();

        //Loop through graph history and plot
        for (let i = 0; i <= xData.length; i++) {

            ctxGraph.beginPath();

            let prevY = yData[i];
            let currY = yData[i+1];
            let prevX = xData[i];
            let currX = xData[i+1];

            ctxGraph.moveTo(widthGraph/2 - prevX*xScale, heightGraph / 2 - prevY * yScale);
            ctxGraph.lineTo(widthGraph/2 - currX*xScale, heightGraph / 2 - currY * yScale);
            ctxGraph.arc(widthGraph/2 - currX*xScale, heightGraph / 2 - currY * yScale, 1, 0, 2* Math.PI);

            //Check if points on opposite side of graph and makes line invisible
            if ((Math.abs(prevY - currY) > Math.PI) || (Math.abs(prevX - currX) > Math.PI)){
                ctxGraph.strokeStyle = "#00000000"; //Invisible if angle greater than 2PI
            }else{
                ctxGraph.strokeStyle = "#FF0000";  // Red for angle th1
            };
            ctxGraph.stroke();
        }
    } else {

        // x-axis labels and tick marks
        for (let i = 0; i <= numXTimePoints; i++){
            let xPos = i * (paddedWidthGraph/numXTimePoints);
            let time = xData[Math.floor(i*maxGraphPoints/numXTimePoints)]/100;
            if (time == undefined) {time = 100;}
            time = time.toFixed(2);
            ctxGraph.fillText(time, xPos, heightGraph/2 + 30);

            ctxGraph.beginPath();
            ctxGraph.moveTo(xPos, heightGraph/2);
            ctxGraph.lineTo(xPos, heightGraph/2 + 10);
            ctxGraph.stroke();
        }

        let pixelPerDataPoint = paddedWidthGraph / graphHistoryTh1.length;
        for (let i = 1; i < graphHistoryTh1.length; i++){

            ctxGraph.beginPath();

            let prevY = yData[i-1];
            let currY = yData[i];

            ctxGraph.moveTo((i - 1) * pixelPerDataPoint, heightGraph / 2 - prevY * yScale);
            ctxGraph.lineTo(i * pixelPerDataPoint, heightGraph / 2 - currY * yScale);

            if (Math.abs(prevY - currY) > Math.PI){
                ctxGraph.strokeStyle = "#00000000"; //Invisible if angle greater than 2PI
            }else{
                ctxGraph.strokeStyle = "#FF0000";  // Red for angle th1
            }
            
            ctxGraph.stroke();
    
        }

    }

    // Draws circle around closest point clicked on and shows the values of the point
    if (drawPoint && pauseCheck.checked == true) {
        let closestCoords = closestPoint.point;
        ctxGraph.beginPath();
        ctxGraph.arc(widthGraph/2 - closestCoords[0]*xScale, heightGraph / 2 - closestCoords[1] * yScale, 10, 0, 2* Math.PI);
        ctxGraph.fillText(`${closestCoords[0].toFixed(2)}, ${closestCoords[1].toFixed(2)}`, widthGraph/2 - closestCoords[0]*xScale + 10, heightGraph / 2 - closestCoords[1] * yScale - 10);
        ctxGraph.stroke();
    }

}