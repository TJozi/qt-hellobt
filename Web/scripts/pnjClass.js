class Pnj {
    constructor({x, y}){
        this.position = {
            x,
            y
        };
        this.alive = true;
        this.width = 78;
        this.height = 120;
        this.Image = gbln;
    }
    draw(){
        if(this.alive){
            c.drawImage(this.Image, this.position.x, this.position.y, this.width, this.height);
        }
        
    }
}
