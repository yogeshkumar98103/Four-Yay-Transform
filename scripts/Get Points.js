function getPoints(p, numberOfPoints){
    let points = [];
    let size = p.getTotalLength();
    let sampleInterval = size/numberOfPoints;

    for(let i = 0; i < size; i += sampleInterval) {
        pt = p.getPointAtLength(i);
        points.push({x : pt.x, y : pt.y});
    }

    orientCorrectly(points);
    return points;
}

function orientCorrectly(points){
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for(let pt of points){
        if(minX > pt.x) minX = pt.x;
        if(maxX < pt.x) maxX = pt.x;
        if(minY > pt.y) minY = pt.y;
        if(maxY < pt.y) maxY = pt.y;
    }

    let dx = maxX-minX;
    let dy = maxY-minY;

    console.log(width,height);
    // Scale
    let controlAxis = Math.max((dx/width), (dy/height));
    let scale = 0.5/controlAxis;
    console.log(controlAxis,scale);

    // Provide offset
    let xoff = -(dx/2 + minX) * scale;
    let yoff = 100 - (dy/2 + minY) * scale;

    for(let pt of points){
        pt.x *= scale;
        pt.y *= scale;
        pt.x += xoff;
        pt.y += yoff;
    }
}

function convertToPath(points){
    let path = {size : 0, "x" : [], "y" : []};
    for(let pt of points){
        path.x.push(pt.x);
        path.y.push(pt.y);
    }
    path.size = points.length;
    return path;
}
