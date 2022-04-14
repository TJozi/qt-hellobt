const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const gravity = 0.3;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
    constructor(){
        this.position = {
            x : 100,
            y : 100
        };

        this.velocity = {
            x : 0,
            y : 0
        };

        this.width = 20;
        this.height = 35;
    }

    update(){
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if(this.velocity.y + this.position.y + this.height <= canvas.height)
            this.velocity.y += gravity;
        else
            this.velocity.y = 0;

        this.draw();
    }

    draw(){
        c.fillStyle = 'blue';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    jump(){
        this.velocity.y += -8;
        this.update();
        console.log("jumping");
    }
}

const player = new Player();
const keys = {
    right : {
        pressed : false
    },
    left : {
        pressed : false
    }
}


function animation(){
    requestAnimationFrame(animation);
    c.clearRect(0,0,canvas.width,canvas.height);
    player.update();

    if(keys.left.pressed && player.position.x >= 50)
        player.velocity.x = -5;
    else if(keys.right.pressed && player.position.x < 400)
        player.velocity.x = 5;
    else{
        player.velocity.x = 0;

        if(keys.right.pressed){
            //bouger tous le chenille vers la gauche
        }
    }
       
}
animation();

addEventListener('keydown', ({code})=>{
    console.log(code);
    switch(code){
        case 'KeyA':  keys.left.pressed = true;
            break;
        case 'KeyD':  keys.right.pressed = true;
            break;
        case 'Space': player.jump();
            break;
    }
})

addEventListener('keyup', ({code})=>{
    switch(code){
        case 'KeyA':  keys.left.pressed = false;
            break;
        case 'KeyD':  keys.right.pressed = false;
            break;

    }
})

