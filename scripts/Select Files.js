let dropBox = document.getElementById('file-drop-area');
let dropText = document.getElementById('drop-text');

dropBox.addEventListener("dragenter", (e) => {
    e.stopPropagation();
    e.preventDefault();

    dropBox.style.opacity = 0.9;
}, false);

dropBox.addEventListener("dragover", (e) => {
    e.stopPropagation();
    e.preventDefault();
}, false);

dropBox.addEventListener("drop", (e)=>{
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const file = dt.files[0];
    handleFile(file);
}, false);

// This is the preview of selected Image
let fileImage = document.createElement("img");
fileImage.classList.add("preview-image");
dropBox.appendChild(fileImage);

let svgPath;
function handleFile(selectedFile){
    hideSamples();
    if(!selectedFile && this.files){
        selectedFile = this.files[0];
    }
    if(selectedFile){
        if(selectedFile.type == "image/svg+xml"){
            dropText.style.display = "none";
            fileImage.style.display = "block";
            fileImage.file = selectedFile;
            const reader = new FileReader();

            // This displays the preview of the image selected by user
            reader.onload = (event)=>{
                fileImage.src = event.target.result
                let result = event.target.result;

                let xhr = new XMLHttpRequest();
                xhr.open('GET', result);
                xhr.addEventListener('load', (e)=>{
                    var xml = e.target.response;
                    let dom = new DOMParser();
                    let svg = dom.parseFromString(xml, "image/svg+xml").rootElement;
                    let svgPaths = svg.getElementsByTagName('path');
                    if(svgPaths.length > 0){
                        svgPath = svgPaths[0];
                        points = getPoints(svgPath, numberOfPoints.value);
                    }
                });
                xhr.send(null);
            }
            reader.readAsDataURL(selectedFile);
        }
    }
}

let numberOfPoints = document.getElementById("point-count");
function handleNumberOfPoints(){
    points = getPoints(svgPath, numberOfPoints.value);
}

let showingSamples = false;
const availableSamplesNames = ["Hand", "Face", "Fourier Text", "Train", "Music"];
const samplePath = ["samples/hand.json", "samples/face.json", "samples/fourierText.json", "samples/train.json", "samples/music.json"]
let sampleContainer;

function toggleSamples(){
    console.log("Pressed");
    if(showingSamples){
        // Hide samples
        hideSamples();
    }
    else if(sampleContainer){
        // Re Show samples
        showSamples();
    }
    else{
        sampleContainer = document.createElement('div');
        sampleContainer.classList.add("sample-container");
        let title = document.createElement('div');
        title.innerHTML = "Select From The Following Samples";
        title.classList.add("sample-container-title");
        title.classList.add("text");
        let collection = document.createElement('div');
        collection.classList.add("samples-list");

        let i = 0;
        for(let sampleName of availableSamplesNames){
            let sample = document.createElement('span');
            sample.innerHTML = sampleName;
            sample.classList.add("sample");
            sample.classList.add("text");
            sample.index = i++;
            sample.addEventListener("click", (event)=>{
                let index = event.target.index
                loadJSON(samplePath[index], (data)=>{
                    path = data;
                    setUpDrawingMode(true);
                });
            })
            collection.appendChild(sample);
        }
        sampleContainer.appendChild(title);
        sampleContainer.appendChild(collection);
        dropBox.appendChild(sampleContainer);
        setTimeout(showSamples,50);
    }
    showingSamples = !showingSamples;
}

function showSamples(){
    console.log("showing");
    if(fileImage){
        fileImage.style.display = "none";
    }
    sampleContainer.classList.add("showSamples");
    sampleContainer.classList.remove("hideSamples");
    dropText.style.display = "none";
}

function hideSamples(){
    if(sampleContainer){
        sampleContainer.classList.add("hideSamples");
        sampleContainer.classList.remove("showSamples");
        dropText.style.display = "block";
    }
}

