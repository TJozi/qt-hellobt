const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const gravity = 1;
const maxDistance = 1000;
const walkingSpeed = 8;
const jumpingSpeed = 20;
const backgroundSpeed = 3;
const foregroundSpeed = 5;
const blockWidth = 400;

//---------------------------------------------------------------------------------------
//Images
//Player
const idleR = new Image();
idleR.src = "./img/AlixStandRight.png";
const idleL = new Image();
idleL.src = "./img/AlixStandLeft.png";
const runR = new Image();
runR.src = "./img/AlixRunRight.png";
const runL = new Image();
runL.src = "./img/AlixRunLeft.png";
const jumpR = new Image();
jumpR.src = "./img/AlixJumpRight.png";
const jumpL = new Image();
jumpL.src = "./img/AlixJumpLeft.png";

//Environment
const ground = new Image();
ground.src = "./img/block.png";
const background = new Image();
background.src = "./img/background2.png";
const backgroundA = new Image();
backgroundA.src = "./img/background1.png";
const foreground = new Image();
foreground.src = "./img/foreground.png";

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
            x : 50,
            y : 100
        };

        this.velocity = {
            x : 0,
            y : 0
        };

        this.width = 115;        //change the size of the player
        this.height = 240;
        this.Image = idleR;
        this.frames = 0;
        this.count  = 0;
        this.states = {
            stand: {
                right : 0,
                left : 1,
                crop : 177,
                width : 115,
                frames : 59
            },
            run: {
                right : 2,
                left : 3,
                crop : 341,
                width : 220,
                frames : 34
            },
            jump: {
                right : 4,
                left : 5,
                crop : 341,
                width : 220,
                frames : 3
            }
        };
        this.currentState = this.states.stand.right;
        this.currentWidth = this.states.stand.crop;
        this.currentFrame = this.states.stand.frames;
    }

    update(){
        switch(this.currentState){
            case this.states.stand.right: this.Image = idleR;
                break;
            case this.states.stand.left: this.Image = idleL;
                break;
            case this.states.run.right: this.Image = runR;
                break;
            case this.states.run.left: this.Image = runL;
                break;
            case this.states.jump.right: this.Image = jumpR;
                break;
            case this.states.jump.left: this.Image = jumpL;
                break;

        }
        //this.count++;
        //---------------------------------------------------------------------------------------------------
        //Tout faire avec la velocity.y plutôt que les touches. Ne garder qu'une frame du sprite?------------
        //--------------------------------------------------------------------------------------------------
        if(this.currentState == this.states.jump.right ||
            this.currentState == this.states.jump.left){
                if((this.frames < this.currentFrame) && (this.velocity.y < 0)){
                    this.frames++;  
                }else if((this.frame) >= 0 && (this.velocity.y >= 0))
                    this.frames--;
        }else{
            this.frames++;
            if(this.frames > this.currentFrame)
                this.frames = 0;

        }

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if(this.velocity.y + this.position.y + this.height <= canvas.height)
            this.velocity.y += gravity;


        this.draw();
    }

    draw(){
        c.drawImage(
            this.Image,
            this.currentWidth * this.frames,
            0,
            this.currentWidth,
            400,
            this.position.x,
            this.position.y,
            this.width,
            this.height);
    }

    jump(){
        //if(this.velocity.y == 0){
            this.velocity.y += -jumpingSpeed;
            this.update();
            //console.log("jumping");
        //}
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
//---------------------------------------------------------------------------------------


let player = new Player();
let blocks = [
    new Block({
        x : 0,
        y : 545
    }),
    new Block({
        x : blockWidth-1,
        y : 545
    }),
    new Block({
        x : blockWidth*2 + 100,
        y : 545
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
    }, "back1")
];
let fore = new foregroundObject();

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
    fore.draw();


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
                if(backgroundObject.Image == backgroundA)
                    backgroundObject.position.x += -backgroundSpeed;
            }); 

            fore.position.x -= foregroundSpeed;
        }

        if(keys.left.pressed && playerProgression > 0){                    //Movement to the left
            playerProgression += -walkingSpeed;

            blocks.forEach(block => {
                block.position.x += walkingSpeed;
            });

             backgroundObj.forEach(backgroundObject => {
                if(backgroundObject.Image == backgroundA)
                    backgroundObject.position.x += backgroundSpeed;
            });

            fore.position.x += foregroundSpeed;
        }
        //console.log(playerProgression);
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
        if((player.position.y + player.height) <= block.position.y + 10 && 
            (player.position.y + player.height + player.velocity.y >= block.position.y + 10) &&
            (player.position.x + player.width >= block.position.x) &&
            (player.position.x <= block.position.x + block.width)){

            player.velocity.y = 0;

            //console.log("current state " + player.currentState)
            //Animation when landing
            if(player.currentState == player.states.jump.right){
                if(keys.right.pressed){
                    player.currentState = player.states.run.right;
                    player.currentFrame = player.states.run.frames;
                }
                else{
                    player.currentState = player.states.stand.right;
                    player.currentWidth = player.states.stand.crop;
                    player.currentFrame = player.states.stand.frames;
                    player.width = player.states.stand.width;
                }
                  
            }
            else if(player.currentState == player.states.jump.left){
                if(keys.left.pressed){
                    player.currentState = player.states.run.left;
                    player.currentFrame = player.states.run.frames;
                }else{
                    player.currentState = player.states.stand.left;
                    player.currentWidth = player.states.stand.crop;
                    player.currentFrame = player.states.stand.frames;
                    player.width = player.states.stand.width;
                }
            }
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
        }, "back1")
    ];

    fore = new foregroundObject();
    playerProgression = 0;
}

animation();

//---------------------------------------------------------------------------------------
//Events
addEventListener('keydown', ({code})=>{
    //console.log(code);
    switch(code){
        case 'KeyA':    keys.left.pressed = true;
                        if(player.velocity.y == 0){
                            player.currentState = player.states.run.left;
                            player.currentFrame = player.states.run.frames;
                        }else{
                            player.currentState = player.states.jump.left;
                            player.currentFrame = player.states.jump.frames;
                        }
                        player.currentWidth = player.states.run.crop;
                        player.width = player.states.run.width;
                        //player.frames = 0;
                      
            break;
        case 'KeyD':    keys.right.pressed = true;
                        if(player.velocity.y == 0){
                            player.currentState = player.states.run.right;
                            player.currentFrame = player.states.run.frames;
                        }else{
                            player.currentState = player.states.jump.right;
                            player.currentFrame = player.states.jump.frames;
                        }
                        player.currentWidth = player.states.run.crop;
                        player.width = player.states.run.width;
                        // player.frames = 0;
            break;
        case 'Space':   player.jump();
                        if(player.currentState == player.states.run.right || 
                               player.currentState == player.states.stand.right ||
                               player.currentState == player.states.jump.right)
                            player.currentState = player.states.jump.right;
                        else
                            player.currentState = player.states.jump.left;

                        player.currentWidth = player.states.jump.crop;
                        player.currentFrame = player.states.jump.frames;
                        player.width = player.states.jump.width;
                        player.frames = 0;
            break;
    }
})

addEventListener('keyup', ({code})=>{
    switch(code){
        case 'KeyA':    keys.left.pressed = false;
                        if(player.velocity.y == 0){
                            player.currentState = player.states.stand.left;
                            player.currentWidth = player.states.stand.crop;
                            player.currentFrame = player.states.stand.frames;
                            player.width = player.states.stand.width;
                        }
            break;
        case 'KeyD':    keys.right.pressed = false;
                        if(player.velocity.y == 0){
                            player.currentState = player.states.stand.right;
                            player.currentWidth = player.states.stand.crop;
                            player.currentFrame = player.states.stand.frames;
                            player.width = player.states.stand.width;
                        }
            break;
    }
})

