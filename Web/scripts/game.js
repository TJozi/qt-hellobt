//---------------------------------------------------------------------------------------
//         Constants
//---------------------------------------------------------------------------------------
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const gravity = 1;
const maxDistance = 22500;
const walkingSpeed = 8;
const jumpingSpeed = 20;
const backgroundSpeed = 5;
const foregroundSpeed = 8;
const blockWidth = 400;

//---------------------------------------------------------------------------------------
//          Images
//---------------------------------------------------------------------------------------
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
const attacking = new Image();
attacking.src = "./img/AlixAttack.png";

//Environment
const ground = new Image();
ground.src = "./img/block.png";
const background = new Image();
background.src = "./img/background2.png";
const backgroundA = new Image();
backgroundA.src = "./img/background1.png";
const foreground = new Image();
foreground.src = "./img/foreground.png";
const plateform = new Image();
plateform.src = "./img/plateform.png";
//---------------------------------------------------------------------------------------
//          Game information
//---------------------------------------------------------------------------------------
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
//                      Game elements
//---------------------------------------------------------------------------------------
let player = new Player();
let goblins = [
    new Pnj({x : 2000, y : 500}),
    new Pnj({x : 4500, y : 500}),
    new Pnj({x : 6000, y : 500}),
    new Pnj({x : 8000, y : 350}),
    new Pnj({x : 9200, y : 500}),
    new Pnj({x : 12000, y : 120}),
    new Pnj({x : 19450, y : 200}),
    new Pnj({x : 21000, y : 500})
];
let groundObj = [
    new Block({
        x : -5,
        y : 545
    }),
    new Block({
        x : blockWidth-30,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*2,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*3,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*4,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*5,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*6,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*7,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*8,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*9 + 600,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*10,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*11,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*12,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*13,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*14,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*15,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*16,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*17,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*18,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*24,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*25,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*26,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*27+350,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*35,
        y : 545
    }),

    new Block({
        x : (blockWidth-30)*41,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*42,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*43 + 250,
        y : 530
    }),
    new Block({
        x : (blockWidth-30)*44,
        y : 530
    }),
    new Block({
        x : (blockWidth-30)*53,
        y : 530
    }),
    new Block({
        x : (blockWidth-30)*54,
        y : 530
    }),
    new Block({
        x : (blockWidth-30)*55,
        y : 530
    }),
    new Block({
        x : (blockWidth-30)*56,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*58,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*59,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*60,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*61,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*62,
        y : 545
    }),
    new Block({
        x : (blockWidth-30)*63,
        y : 545
    }),

    //-----------------------------------------------------------
    //Floating plateforms
    new Plateform({
        x : (blockWidth-30)*8  ,
        y : 350
    }),
    new Plateform({
        x : (blockWidth-30)*8 + 400,
        y : 200
    }),
    new Plateform({
        x : (blockWidth-30)*20 - 60,
        y : 500
    }),
    new Plateform({
        x : (blockWidth-30)*21,
        y : 400
    }),
    new Plateform({
        x : (blockWidth-30)*22,
        y : 300
    }),
    new Plateform({
        x : (blockWidth-30)*23 + 70,
        y : 350
    }),
    new Plateform({
        x : (blockWidth-30)*29 + 200,
        y : 340
    }),
    new Plateform({
        x : (blockWidth-30)*31,
        y : 270
    }),
    new Plateform({
        x : (blockWidth-30)*32,
        y : 180
    }),
    new Plateform({
        x : (blockWidth-30)*33 + 200,
        y : 300
    }),
    new Plateform({
        x : (blockWidth-30)*36 + 350,
        y : 500
    }),
    new Plateform({
        x : (blockWidth-30)*38 + 200,
        y : 500
    }),
    new Plateform({
        x : (blockWidth-30)*39 + 200,
        y : 454
    }),
    new Plateform({
        x : (blockWidth-30)*46,
        y : 500
    }),
    new Plateform({
        x : (blockWidth-30)*47 + 150,
        y : 500
    }),
    new Plateform({
        x : (blockWidth-30)*49,
        y : 420
    }),
    new Plateform({
        x : (blockWidth-30)*50+100,
        y : 350
    }),
    new Plateform({
        x : (blockWidth-30)*52,
        y : 260
    }),
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
//---------------------------------------------------------------------------------------
function animation(){
    requestAnimationFrame(animation);

    //Display
    c.fillStyle = 'grey'
    c.fillRect(0,0,canvas.width,canvas.height);
    
    backgroundObj.forEach(backgroundObject => {
        backgroundObject.draw();
    });

    groundObj.forEach(block => {
        block.draw();
    });

    goblins.forEach(pnj => {
        pnj.draw();
    });

    player.update();
    fore.draw();
   /* console.log("state : " + player.currentState);
   console.log("frame : " + player.frames);
   console.log("current frame : " + player.currentFrame); */

    //Control
    if(keys.left.pressed && player.position.x >= 50)
        player.velocity.x = -walkingSpeed;
    else if(keys.right.pressed && player.position.x < 400)
        player.velocity.x = walkingSpeed;
    else{
        player.velocity.x = 0;

        if(keys.right.pressed && playerProgression < maxDistance){                                            //Movement to the right
            playerProgression += walkingSpeed;

            groundObj.forEach(block => {
                block.position.x += -walkingSpeed;
            });

            backgroundObj.forEach(backgroundObject => {
                if(backgroundObject.Image == backgroundA)
                    backgroundObject.position.x += -backgroundSpeed;
            });
            goblins.forEach(pnj => {
                pnj.position.x -= walkingSpeed;
            });

            fore.position.x -= foregroundSpeed;
        }

        if(keys.left.pressed && playerProgression > 0){                    //Movement to the left
            playerProgression += -walkingSpeed;

            groundObj.forEach(block => {
                block.position.x += walkingSpeed;
            });

             backgroundObj.forEach(backgroundObject => {
                if(backgroundObject.Image == backgroundA)
                    backgroundObject.position.x += backgroundSpeed;
            });

            goblins.forEach(pnj => {
                pnj.position.x += walkingSpeed;
            });

            fore.position.x += foregroundSpeed;
        }
       // console.log(playerProgression);
    }
    

    //Win                                                                   //End of game
    if(playerProgression >= maxDistance){
        console.log("win");
        player.velocity.x = 0;
        //alert("YOU WIN, CONGRATULATIONS!");
        //document.location.reload();
    }
    //Lose
    if(player.position.y > canvas.height){
        console.log("lose");
        reset();
    }

    //Losing health--------------dying
    goblins.forEach(pnj => {
   //     oldContact = contact;
        if(pnj.alive){                  //Is it alive?
            if((player.position.x + player.width/2) >= pnj.position.x && (player.position.x + player.width/2) < (pnj.position.x + pnj.width) &&
            (player.position.y + player.height) >= pnj.position.y){     //Is it in contact with the player?
                reset();
            }
        }
        
    })

    //Ground collision
    groundObj.forEach(obj => {
        if((player.position.y + player.height) <= obj.position.y + 25 && 
            (player.position.y + player.height + player.velocity.y >= obj.position.y + 25) &&
            (player.position.x + player.width >= obj.position.x) &&
            (player.position.x <= obj.position.x + obj.width)){

            player.velocity.y = 0;

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
    health = 4;
    groundObj = [
        new Block({
            x : -5,
            y : 545
        }),
        new Block({
            x : blockWidth-30,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*2,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*3,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*4,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*5,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*6,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*7,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*8,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*9 + 600,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*10,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*11,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*12,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*13,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*14,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*15,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*16,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*17,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*18,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*24,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*25,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*26,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*27+350,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*35,
            y : 545
        }),
    
        new Block({
            x : (blockWidth-30)*41,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*42,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*43 + 250,
            y : 530
        }),
        new Block({
            x : (blockWidth-30)*44,
            y : 530
        }),
        new Block({
            x : (blockWidth-30)*53,
            y : 530
        }),
        new Block({
            x : (blockWidth-30)*54,
            y : 530
        }),
        new Block({
            x : (blockWidth-30)*55,
            y : 530
        }),
        new Block({
            x : (blockWidth-30)*56,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*58,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*59,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*60,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*61,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*62,
            y : 545
        }),
        new Block({
            x : (blockWidth-30)*63,
            y : 545
        }),
        new Plateform({
            x : (blockWidth-30)*8  ,
            y : 350
        }),
        new Plateform({
            x : (blockWidth-30)*8 + 400,
            y : 200
        }),
        new Plateform({
            x : (blockWidth-30)*20 - 60,
            y : 500
        }),
        new Plateform({
            x : (blockWidth-30)*21,
            y : 400
        }),
        new Plateform({
            x : (blockWidth-30)*22,
            y : 300
        }),
        new Plateform({
            x : (blockWidth-30)*23 + 200,
            y : 350
        }),
        new Plateform({
            x : (blockWidth-30)*29 + 200,
            y : 340
        }),
        new Plateform({
            x : (blockWidth-30)*31,
            y : 270
        }),
        new Plateform({
            x : (blockWidth-30)*32,
            y : 180
        }),
        new Plateform({
            x : (blockWidth-30)*33 + 200,
            y : 300
        }),
        new Plateform({
            x : (blockWidth-30)*36 + 350,
            y : 500
        }),
        new Plateform({
            x : (blockWidth-30)*38 + 200,
            y : 500
        }),
        new Plateform({
            x : (blockWidth-30)*39 + 200,
            y : 454
        }),
        new Plateform({
            x : (blockWidth-30)*46,
            y : 500
        }),
        new Plateform({
            x : (blockWidth-30)*47 + 150,
            y : 500
        }),
        new Plateform({
            x : (blockWidth-30)*49,
            y : 420
        }),
        new Plateform({
            x : (blockWidth-30)*50+100,
            y : 350
        }),
        new Plateform({
            x : (blockWidth-30)*52,
            y : 260
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

    goblins = [
        new Pnj({x : 2000, y : 500}),
        new Pnj({x : 4500, y : 500}),
        new Pnj({x : 6000, y : 500}),
        new Pnj({x : 8000, y : 350}),
        new Pnj({x : 9200, y : 500}),
        new Pnj({x : 12000, y : 120}),
        new Pnj({x : 19450, y : 200}),
        new Pnj({x : 21000, y : 500})
    ];

    fore = new foregroundObject();
    playerProgression = 0;
}
function attack(){
    console.log("attacking");
    goblins.forEach(pnj => {
             if(pnj.position.x - (player.position.x + player.width) <= 50){
                 pnj.alive = false;
                 console.log("hit");
             }
         })
}

animation();

//---------------------------------------------------------------------------------------
//          Events key listeners
//---------------------------------------------------------------------------------------
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
            break;
        case 'KeyC':    player.currentState = player.states.hit.right;
                        player.currentFrame = player.states.hit.frames;
                        player.currentWidth = player.states.hit.crop;
                        player.width = player.states.hit.width;
                        player.frames = 0;
                        attack();
            break;
        case 'Space':   player.jump();
                        if(player.currentState == player.states.run.right || 
                            player.currentState == player.states.stand.right ||
                            player.currentState == player.states.jump.right ||
                            player.currentState == player.states.hit.right)
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