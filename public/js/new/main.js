
// import "./graph.js"
// import "./physics.js"

import { getMaxEnergy } from "../pendulum";

// Only run the code when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function(){

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

    let pendulum = {"g":parseFloat(gravSlider.value), 
                    "m1":parseFloat(m1Slider.value),
                    "m2":parseFloat(m2Slider.value),
                    "l1":parseFloat(l1Slider.value), 
                    "l2":parseFloat(l2Slider.value), 
                    "h":parseFloat(hSlider.value),
                    "th1":(90*(Math.PI/180)), 
                    "th2":(30*(Math.PI/180)), 
                    "om1":0, 
                    "om2":0}
    
    pendulum.maxLabel = physics.getMaxEnergy(pendulum)
    pendulum.kineticEnergy = physics.getKineticEnergy(pendulum)
    pendulum.potentialEnergy = physics.getPotentialEnergy(pendulum)

    //Reset and restart functions
    function RestartGraph(){
        th1 = 90 * (Math.PI / 180);
        th2 = 30 * (Math.PI / 180);
        om1 = 0;
        om2 = 0;
        resetHistories()
        resetPendHistories()
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

    //Run reset scrips when these buttons are clicked on the html
    restartButton.addEventListener('click', RestartGraph);
    resetButton.addEventListener('click', RestartVariablesAndGraph);

    presetSelect.addEventListener("change", function(e){
        const preset = JSON.parse(e.target.value);
        pendulum.th1 = preset.th1;
        pendulum.th2 = preset.th2;
        pendulum.om1 = preset.om1;
        pendulum.om2 = preset.om2;
        pendulum.maxLabel = physics.getMaxEnergy(pendulum);
    });

    //Canvas setup for pendulum
    const desiredFPS = 60;
    let canvasPendulum = document.querySelector('#canvasPendulum');
    let ctxPendulum = canvasPendulum.getContext('2d');
    let widthPendulum = canvasPendulum.width;
    let heightPendulum = canvasPendulum.height;

    // Changes position of pendulum when you click on it
    canvasPendulum.addEventListener("click", function(event){
        [pendulum.th1, pendulum.th2, pendulum.om1, pendulum.om2] = setPendulumPosition(canvasPendulum, event, pendulum);
        pendulum.maxLabel = physics.getMaxEnergy(pendulum);
    })

    //Canvas setup for graph
    let canvasGraph = document.querySelector('#canvasGraph');
    let ctxGraph = canvasGraph.getContext('2d');
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
    let canvasEnergy = document.querySelector('#canvasEnergy');
    let ctxEnergy = canvasEnergy.getContext('2d');
    ctxEnergy.font = "16px Arial";
    ctxEnergy.textAlign = "center";
    let widthEnergy = canvasEnergy.width;
    let heightEnergy = canvasEnergy.height;

    function updateVariables(x){

    }

});