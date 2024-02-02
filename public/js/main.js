
// Import functions from other files
import {drawGraph, resetHistories, updateHistories, drawClosestPoint} from "./graph.js";
import {drawPendulum, updatePendulum, setPendulumPosition, drawEnergyBar, updatePosHistories} from "./pendulum.js";

// Declare variables for exporting
let g, m1, m2, l1, l2;

function start(){
    //Initialise inputs
    const gravSlider = document.getElementById('gravSlider');
    const m1Slider = document.getElementById('m1Slider');
    const m2Slider = document.getElementById('m2Slider');
    const l1Slider = document.getElementById('l1Slider');
    const l2Slider = document.getElementById('l2Slider');
    const hSlider = document.getElementById('hSlider');
    const gravAmount = document.getElementById('gravAmount');
    const m1Amount = document.getElementById('m1Amount');
    const m2Amount = document.getElementById('m2Amount');
    const l1Amount = document.getElementById('l1Amount');
    const l2Amount = document.getElementById('l2Amount');
    const hAmount = document.getElementById('hAmount');
    const pauseCheck = document.getElementById('pauseCheck');
    const restartButton = document.getElementById('restartButton')
    const resetButton = document.getElementById('resetButton');
    const yGraphSelect = document.getElementById('yGraphSelect');
    const xGraphSelect = document.getElementById('xGraphSelect');
    const integrationSelect = document.getElementById('integrationSelect');
    const presetSelect = document.getElementById('presetSelect');

    //Run reset scrips when these buttons are clicked on the html
    restartButton.addEventListener('click', RestartGraph);
    resetButton.addEventListener('click', RestartVariablesAndGraph);

    presetSelect.addEventListener("change", function(e){
        const preset = JSON.parse(e.target.value);
        console.log(preset);
        console.log(preset.th1);
        setAngleParams(preset.th1, preset.th2, preset.om1, preset.om2);
    });

    //Initialise starting parameters
    g = gravSlider.value;
    m1 = m1Slider.value;
    m2 = m2Slider.value;
    l1 = l1Slider.value;
    l2 = l2Slider.value;
    let h = hSlider.value;
    let th1 = 90 * (Math.PI / 180);
    let th2 = 30 * (Math.PI / 180);
    let om1 = 0;
    let om2 = 0;

    //Canvas setup for pendulum
    const desiredFPS = 60;
    let canvasPendulum = document.querySelector('#canvasPendulum');
    let ctxPendulum = canvasPendulum.getContext('2d');
    let widthPendulum = canvasPendulum.width;
    let heightPendulum = canvasPendulum.height;

    canvasPendulum.addEventListener("click", function(event){
        [th1, th2, om1, om2] = setPendulumPosition(canvasPendulum, event, om1, om2);

    })

    //Canvas setup for graph
    const canvasGraph = document.querySelector('#canvasGraph');
    const ctxGraph = canvasGraph.getContext('2d');
    ctxGraph.font = "16px Arial";
    ctxGraph.textAlign = "center";
    let widthGraph = canvasGraph.width;
    let heightGraph = canvasGraph.height;

    // Checks when you click on the graph and does a function
    canvasGraph.addEventListener("click", function(event){
        if (pauseCheck.checked == true){
            drawClosestPoint(canvasGraph, event, xGraph, yGraph, widthGraph, heightGraph);
        } 
    });

    //Axes selection variables
    let yGraph = yGraphSelect.value;
    let xGraph = xGraphSelect.value;

    // Canvas setup for energy bar
    const canvasEnergy = document.querySelector('#canvasEnergy');
    const ctxEnergy = canvasEnergy.getContext('2d');
    ctxEnergy.font = "16px Arial";
    ctxEnergy.textAlign = "center";
    let widthEnergy = canvasEnergy.width;
    let heightEnergy = canvasEnergy.height;

    //Reset and restart functions
    function RestartGraph(){
        th1 = 90 * (Math.PI / 180);
        th2 = 30 * (Math.PI / 180);
        om1 = 0;
        om2 = 0;
        resetHistories()
        }

    function RestartVariablesAndGraph(){
        g = 9.81;
        gravSlider.value = 9.81;
        gravAmount.value = 9.81;
        h = 0.25;
        hSlider.value = 0.25;
        hAmount.value = 0.25;
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
        RestartGraph()
        }

    function updateVariables(){
        g = gravSlider.value;
        m1 = m1Slider.value;
        m2 = m2Slider.value;
        l1 = l1Slider.value;
        l2 = l2Slider.value;
        h = hSlider.value;
        yGraph = yGraphSelect.value;
        xGraph = xGraphSelect.value;
        widthGraph = canvasGraph.width;
        heightGraph = canvasGraph.height;
        widthPendulum = canvasPendulum.width;
        heightPendulum = canvasPendulum.height;
    }

    function setAngleParams(newTh1, newTh2, newOm1, newOm2){
        th1 = parseFloat(newTh1) * (Math.PI / 180);
        th2 = parseFloat(newTh2) * (Math.PI / 180);
        om1 = parseFloat(newOm1);
        om2 = parseFloat(newOm2);
    };

    const timePerFrame = 1000/desiredFPS;
    let totalFrames = 0;
    let previousTime = 0;

    function run(currentTime){

        requestAnimationFrame(run); 

        const deltaTime = currentTime - previousTime;

        if (deltaTime >= timePerFrame) {

            previousTime = currentTime;

            updateVariables();

            let [x, y] = drawPendulum(ctxPendulum, th1, th2, widthPendulum, heightPendulum);

            if (pauseCheck.checked == false){

                [th1, th2, om1, om2] = updatePendulum(integrationSelect.value, h, th1, th2, om1, om2);

                console.log(th1, th2, om1, om2);

                totalFrames++;

                updateHistories(th1, th2, om1, om2, totalFrames);

                updatePosHistories(x, y);

            }

            drawEnergyBar(ctxEnergy, widthEnergy, heightEnergy, th1, th2);

            drawGraph(ctxGraph, xGraph, yGraph, widthGraph, heightGraph, pauseCheck);

        }
    }

    requestAnimationFrame(run);

};

document.addEventListener('DOMContentLoaded', start);

// Get and set pendulum parameters
export function getParams() {
    return { g, m1, m2, l1, l2 };
};

export function setParams({ newG, newM1, newM2, newL1, newL2 }) {
    g = newG;
    m1 = newM1;
    m2 = newM2;
    l1 = newL1;
    l2 = newL2;
};