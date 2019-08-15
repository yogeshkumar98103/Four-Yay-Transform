var inputTimer;
var doneInterval = 300;

var speedSlider = document.getElementById("speed-slider");
var termSlider = document.getElementById("term-slider");
var speedValue = document.getElementById("speed-value");
var termValue = document.getElementById("term-value");

let singleMode = document.getElementById("left-mode-btn");
let dualMode = document.getElementById("right-mode-btn");
let modeMask = document.getElementById("mode-mask");
// modeMask.style.left = "5px";

speedSlider.oninput = function(){
    clearTimeout(inputTimer);
    inputTimer = setTimeout(()=>{
        speedValue.value = speedSlider.value;
        changeSpeed(speedValue.value);
    }, doneInterval);
}

termSlider.oninput = function(){
    clearTimeout(inputTimer);
    inputTimer = setTimeout(()=>{
        termValue.value = termSlider.value;
        changeTerm(termValue.value);
    }, doneInterval);
}

speedValue.addEventListener("change", ()=>{
    speedSlider.value = speedValue.value;
    changeSpeed(speedValue.value);
})

termValue.addEventListener("change", ()=>{
    termSlider.value = termValue.value;
    changeTerm(termValue.value);
})

function changeSpeed(newSpeed){
    path.speed = parseInt(newSpeed);
    series.speed = path.speed;
}

function changeTerm(newTerm){
    path.numberOfTerms = parseInt(newTerm);
    series = new FourierSeries(path);
}

function reDraw(){
    let speed = parseInt(speedSlider.value);
    let terms = parseInt(termSlider.value);
    if(series.speed == speed && series.numberOfTerms == terms){
        series.restart();
    }
    else{
        path.speed = speed
        path.numberOfTerms = terms;
        series = new FourierSeries(path);
    }
}

function setMode(mode){
    if(mode !== drawingMode){
        drawingMode = mode;
        series = new FourierSeries(path);

        switch(mode){
            case DOUBLE:
                modeMask.classList.add("move-right");
                modeMask.classList.remove("move-left");
                break;

            case SINGLE:
                modeMask.classList.add("move-left");
                modeMask.classList.remove("move-right");
                break;
        }
    }
}