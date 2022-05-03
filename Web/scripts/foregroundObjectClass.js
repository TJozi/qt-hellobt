class foregroundObject {
    constructor(){
        this.position = {
            x : 0,
            y : 0
        };
        this.Image = foreground;
        this.width = 400;
        this.height = 45;   
    }

    draw(){
        c.drawImage(this.Image, this.position.x, this.position.y);
    }
}