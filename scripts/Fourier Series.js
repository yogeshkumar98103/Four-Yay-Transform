const DOUBLE = 2;
const SINGLE = 1;
let drawingMode = SINGLE;

class FourierSeries{
    constructor(points){
        this.points = points;
        this.numberOfTerms = points.numberOfTerms || DEFAULT_TERMS;
        this.speed = path.speed || DEFAULT_SPEED;

        this.showOnlyTrails = false;
        this.showCircles = true;
        this.trailCount = 50;

        this.time = 0;
        this.path = [];
        
        this.calculateFourier();
    }

    set speed(val){
        this.s = val
        this.amount = val/(fps * 100);
    }

    get speed(){
        this.s;
    }

    // This can used to scale up the Drawing
    set scale(val){
        if(this.time > 0){
            this.restart();
            this.calculateFourier(val);
        }
    }

    calculateFourier(scale){
        let sortFn = (a,b) => {
            return a.amplitude > b.amplitude;
        }

        switch(drawingMode){
            case DOUBLE: 
                this.fourierX = this.transform(this.points.x, scale);
                this.fourierY = this.transform(this.points.y, scale);
                this.fourierX.sort(sortFn);
                this.fourierY.sort(sortFn);
                break;

            case SINGLE: 
                this.SINGLEFourierTerms = this.SINGLETransform(this.points, scale);
                this.SINGLEFourierTerms.sort(sortFn);
                break;
        }
        
    }

    display(){
        strokeWeight(1);
        stroke(255, 180);
        
        let x = 0;
        let y = 0;

        switch(drawingMode){
            case DOUBLE:
                // let x = 0;
                let yoff = 0;
                push()
                translate(width/2,100)
                for(let term of this.fourierX){
                    term.update(this.time, this.scale);
                    term.display(this.showCircles);
                    x += term.x;
                    yoff += term.y;
                }
                pop();
        
                let xoff = 0;
                // let y = 0;
                push()
                translate(100, height/2);
                for(let term of this.fourierY){
                    term.update(this.time, HALF_PI);
                    term.display(this.showCircles);
                    xoff += term.x;
                    y += term.y;
                }
                pop();

                // Drawing Lasers
                strokeWeight(1);
                stroke("#0F0");

                push();
                translate(width/2,100);
                line(x, yoff, x, y + this.yoff - 50);
                pop();

                push();
                translate(100, height/2);
                line(xoff, y, x + this.xoff - 50, y);
                pop();
                break;

            case SINGLE:
                push()
                translate(width/2,height/2);
                for(let term of this.SINGLEFourierTerms){
                    term.update(this.time);
                    term.display(this.showCircles);
                    x += term.x;
                    y += term.y;
                }
                pop();
                break;
        }
        

        // Add points to show
        if(this.time <= 1.1){
            this.path.push({x,y});
        }

        // Draw Shape
        strokeWeight(4);
        stroke("#F00");
        push()
        translate(width/2, height/2);
        beginShape();
        for(let pt of this.path){
            curveVertex(pt.x, pt.y);
        }
        endShape();
        pop()

        // Show Trail Only
        if(this.showOnlyTrails && this.path.length > this.trailCount){
            this.path.shift();
        }

        // Update Time
        this.time += this.amount;
    }

    // This Functions calculates the fourier Transform along each axis;
    transform(x, scale){
        let X = [];

        const N = x.length;
        let k = 0;
        for(let i = 0; i < this.numberOfTerms; i++){
            let re = 0;
            let im = 0;

            for(let n = 0; n < N; n++){
                let angle = (TWO_PI * k * n)/N;
                re += x[n] * cos(angle);
                im -= x[n] * sin(angle);
            }
            re /= N;
            im /= N;
            let amplitude = sqrt(re * re + im * im);
            let phase = atan2(im, re);

            X.push(new FourierTerm(amplitude, k, phase, scale));

            k *= -1;
            if(k >= 0){
                k++;
            }
        }

        return X;
    }

    restart(){
        this.time = 0;
        this.path = [];
    }

    SINGLETransform(points, scale){
        let k = 0;
        let c = [];
        
        for(let i = 0; i < this.numberOfTerms; i++){
            let omega = 2*Math.PI*k;
            let F1 = (i,t)=>{
                return points.x[i] * Math.cos(omega*t) + points.y[i] * Math.sin(omega*t); 
            }
    
            let F2 = (i,t)=>{
                return points.y[i] * Math.cos(omega*t) - points.x[i] * Math.sin(omega*t);
            }
            
            let re = this.integral(F1, points.size);
            let im = this.integral(F2, points.size);
    
            let amplitude = Math.sqrt(re * re + im * im);
            let phase = atan2(im, re);
            c.push(new FourierTerm(amplitude, k, phase, scale));
    
            k *= (-1);
            if(k >= 0) k++;
        }
    
        return c;
    }
    
    integral(f, size){
        let dt = 1/size;
        let sum = 0;
        let i = 0;
        let t = 0;
        while(i < size){
            sum += f(i,t)*dt;
            i++;
            t += dt;
        }
        return sum;
    }
}