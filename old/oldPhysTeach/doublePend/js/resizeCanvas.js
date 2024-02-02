function resizeCanvas(xPerc, yPerc){
    var canvs = document.getElementById("canvasPendulum");
    canvs.width = window.innerWidth * xPerc / 100;
    canvs.height = window.innerHeight * yPerc / 100;
}