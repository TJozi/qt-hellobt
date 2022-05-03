class Plateform {
    constructor({x, y}){
        this.position = {
            x,
            y
        };
        this.Image = plateform;
        this.width = 200;
        this.height = 45;
    }

    draw(){
        c.drawImage(this.Image, this.position.x, this.position.y);
    }
}