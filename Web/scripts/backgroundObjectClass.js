class backgroundObject {
    constructor({x, y}, objType){
        this.position = {
            x,
            y
        };
        objType;
        switch(objType){
            case "back" : this.Image = background;
                break;
            case "back1" : this.Image = backgroundA;
                break;
        }
        
        this.width = 400;
        this.height = 45;
        
    }
    draw(){
        c.drawImage(this.Image, this.position.x, this.position.y);
    }
}