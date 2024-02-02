import { setAngleParams } from "./main.js";

function selectPreset(presetData) {
    fetch('/selectPreset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pres: JSON.stringify(presetData) })
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response data
        // Assuming you have a function to update the simulation
        setAngleParams(data.th1, data.th2, data.om1, data.om2);
    })
    .catch(error => console.error('Error:', error));
}
