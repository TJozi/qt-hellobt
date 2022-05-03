class Block {
    constructor({x, y}){
        this.position = {
            x,
            y
        };
        this.Image = ground;
        this.width = blockWidth;
        this.height = 45;
        
    }
    draw(){
        c.drawImage(this.Image, this.position.x, this.position.y, blockWidth, this.height);
    }
}