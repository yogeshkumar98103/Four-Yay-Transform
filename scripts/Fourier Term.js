const ARROW_ANGLE = (5 * Math.PI / 6);

class FourierTerm{
    constructor(amplitude, frequency, phase, scale){
        this.amplitude = amplitude;
        this.frequency = frequency;
        this.omega = 2 * Math.PI * this.frequency
        this.phase = phase;

        if(scale){
            this.amplitude *= scale;
        }

        this.arrowLength = this.amplitude/10;
    }

    update(time, rotation){
        this.angle = this.omega * time + this.phase;
        if(rotation) this.angle += rotation;
        this.x = this.amplitude * cos(this.angle);
        this.y = this.amplitude * sin(this.angle);
    }

    display(showCircle){
        // Draw Circle
        if(showCircle){
            circle(0, 0, 2 * this.amplitude);
        }
    
        // Draw Arrow line
        line(0, 0, this.x, this.y);
        translate(this.x, this.y);

        // Draw Arrow Pointers
        push()
            rotate(this.angle + ARROW_ANGLE);
            line(0, 0, this.arrowLength, 0);
        pop();

        push();
            rotate(this.angle - ARROW_ANGLE);
            line(0, 0, this.arrowLength, 0);
        pop();
    }
}