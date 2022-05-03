class Pnj {
    constructor({x, y}){
        this.position = {
            x,
            y
        };
        //this.Image = plateform;
        this.alive = true;
        this.width = 50;
        this.height = 90;
    }
    draw(){
        if(this.alive){
            //c.drawImage(this.Image, this.position.x, this.position.y, blockWidth, this.height);
            c.fillStyle = 'red';
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
        
    }
}
