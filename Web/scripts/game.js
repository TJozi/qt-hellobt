const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const gravity = 1;
const maxDistance = 1000;
const walkingSpeed = 5;
const jumpingSpeed = 20;
const backgroundSpeed = 2;
const blockWidth = 400;

//---------------------------------------------------------------------------------------
//Images
//Player
const idle = new Image();
idle.src = "./img/spriteStandLeft.png";

//Environment
const ground = new Image();
ground.src = "./img/platform.png";
const background = new Image();
background.src = "./img/background.png";
const hills = new Image();
hills.src = "./img/hills.png";

//---------------------------------------------------------------------------------------
//Game information
let playerProgression = 0;

const keys = {
    right : {
        pressed : false
    },
    left : {
        pressed : false
    }
}

//Game window
canvas.width = 1024;
canvas.height = 576;

//---------------------------------------------------------------------------------------
//Classes
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

        this.width = 50;
        this.height = 150;
        this.Image = idle;
        this.frames = 0;
    }

    update(){
        this.frames++;
        if(this.frames > 28)
            this.frames = 0;

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if(this.velocity.y + this.position.y + this.height <= canvas.height)
            this.velocity.y += gravity;


        this.draw();
    }

    draw(){
        c.drawImage(
            this.Image,
            177 * this.frames,
            0,
            177,
            400,
            this.position.x,
            this.position.y,
            this.width,
            this.height);
    }

    jump(){
        if(this.velocity.y == 0){
            this.velocity.y += -jumpingSpeed;
            this.update();
            console.log("jumping");
        }
    }
}

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

class backgroundObject {
    constructor({x, y}, objType){
        this.position = {
            x,
            y,
        };
        objType;
        switch(objType){
            case "back" : this.Image = background;
                break;
            case "hill" : this.Image = hills;
                break;
        }
        
        this.width = 400;
        this.height = 45;
        
    }
    draw(){
        c.drawImage(this.Image, this.position.x, this.position.y);
    }
}
//---------------------------------------------------------------------------------------


let player = new Player();
let blocks = [
    new Block({
        x : 0,
        y : 530
    }),
    new Block({
        x : blockWidth-1,
        y : 530
    }),
    new Block({
        x : blockWidth*2 + 100,
        y : 530
    })
];
let backgroundObj = [
    new backgroundObject({
        x : 0,
        y : 0
    }, "back"),
    new backgroundObject({
        x : 0,
        y : 0  
    }, "hill")
];

//---------------------------------------------------------------------------------------
//Functions
function animation(){
    requestAnimationFrame(animation);

    //Display
    c.fillStyle = 'grey'
    c.fillRect(0,0,canvas.width,canvas.height);
    
    backgroundObj.forEach(backgroundObject => {
        backgroundObject.draw();
    });

    blocks.forEach(block => {
        block.draw();
    });
    player.update();

    //Control
    if(keys.left.pressed && player.position.x >= 50)
        player.velocity.x = -walkingSpeed;
    else if(keys.right.pressed && player.position.x < 400)
        player.velocity.x = walkingSpeed;
    else{
        player.velocity.x = 0;

        if(keys.right.pressed){                                            //Movement to the right
            playerProgression += walkingSpeed;

            blocks.forEach(block => {
                block.position.x += -walkingSpeed;
            });

            backgroundObj.forEach(backgroundObject => {
                if(backgroundObject.objType = "hill")
                    backgroundObject.position.x += -backgroundSpeed;
            }); 
        }

        if(keys.left.pressed && playerProgression > 0){                    //Movement to the left
            playerProgression += -walkingSpeed;

            blocks.forEach(block => {
                block.position.x += walkingSpeed;
            });

             backgroundObj.forEach(backgroundObject => {
                if(backgroundObject.objType = "hill")
                    backgroundObject.position.x += backgroundSpeed;
            }); 
        }
        console.log(playerProgression);
    }
    

    //Win                                                                   //End of game
    if(playerProgression >= maxDistance){
        console.log("win");
    }
    //Lose
    if(player.position.y > canvas.height){
        console.log("lose");
        reset();
    }

    //Ground collision
    blocks.forEach(block => {
        if((player.position.y + player.height) <= block.position.y && 
            (player.position.y + player.height + player.velocity.y >= block.position.y) &&
            (player.position.x + player.width >= block.position.x) &&
            (player.position.x <= block.position.x + block.width)){

        player.velocity.y = 0;
        }
    });
}

function reset(){
    player = new Player();
    blocks = [
        new Block({
            x : 0,
            y : 530
        }),
        new Block({
            x : blockWidth-1,
            y : 530
        }),
        new Block({
            x : blockWidth*2 + 100,
            y : 530
        })
    ];
    backgroundObj = [
        new backgroundObject({
            x : 0,
            y : 0
        }, "back"),
        new backgroundObject({
            x : 0,
            y : 0  
        }, "hill")
    ];

    playerProgression = 0;
}

animation();

//---------------------------------------------------------------------------------------
//Events
addEventListener('keydown', ({code})=>{
    //console.log(code);
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

