// Available Sample Paths :-
    // 1. samples/hand.json
    // 2. samples/face.json
    // 3. samples/fourier.json
    // 4. samples/train.json

const DRAWING_MODE = 1;
const SELECTION_MODE = 2;
const DEFAULT_SPEED = 50;
const DEFAULT_TERMS = 100;
let mode = SELECTION_MODE;

let selectionPane = document.getElementById("selection-pane");
let drawingPane = document.getElementById("drawing-pane");

let fps = 40;
let series;
let path = {x : [], y : []};
let points = [];

function setup(){
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("canvas");
    
    frameRate(40);
    stroke(255, 255);
    strokeWeight(2);
    noFill();
    background("#fff");
    setUpSelectionMode();
}

function draw(){
    background("#333");
    displayGrids();
    switch(mode){
        case DRAWING_MODE   :   series.display();
                                break;

        case SELECTION_MODE :   displayPoints();
                                break;
    }
}

function displayPoints(){
    stroke("#0f0");
    strokeWeight(2);
    translate((width*0.73)/2,height/2 - 100);
    for(let pt of points){
        point(pt.x, pt.y);
    }
}

// This function displays the background grid
const gridSize = 30;
function displayGrids(){
    stroke(255, 50);
    strokeWeight(1);
    let i = 0;
    while(i < width){
        line(i, 0, i, height);
        i += gridSize;
    }

    let j = 0;
    while(j < height){
        line(0, j, width, j);
        j += gridSize;
    }
}

function setUpDrawingMode(pathExists){
    selectionPane.classList.add("hideSelectionPane");
    selectionPane.classList.remove("showSelectionPane");

    if(!pathExists){
        path = convertToPath(points);
    }
    
    // switch(transformMode){
    //     case REAL:      dualMode.focus();
    //     case COMPLEX:   singleMode.focus();
    // }
    series = new FourierSeries(path);
    mode = DRAWING_MODE;

    // Set the values of control parameters
    speedValue.value = path.speed || DEFAULT_SPEED;
    termValue.value = path.numberOfTerms || DEFAULT_TERMS;
    speedSlider.value = path.speed || DEFAULT_SPEED;
    termSlider.value = path.numberOfTerms|| DEFAULT_TERMS;


}

function setUpSelectionMode(){
    selectionPane.classList.add("showSelectionPane");
    selectionPane.classList.remove("hideSelectionPane");
    mode = SELECTION_MODE;
}

