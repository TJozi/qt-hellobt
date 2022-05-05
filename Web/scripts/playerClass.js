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
                frames : 33
            },
            jump: {
                right : 4,
                left : 5,
                crop : 341,
                width : 220,
                frames : 3
            },
            hit: {
                right : 6,
                left : 7,
                crop : 351,
                width : 220,
                frames : 4
            }
        };
        //Initial state
        this.currentState = this.states.stand.right;
        this.currentWidth = this.states.stand.crop;
        this.currentFrame = this.states.stand.frames;
    }

    update(){
        //Updates the image to display according to the current state
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
            case this.states.hit.right: this.Image = attacking;
                break;
        }

        //Changes sprite when going up or down
        if(this.currentState == this.states.jump.right ||
            this.currentState == this.states.jump.left){
                if(this.velocity.y < 0){
                    this.frames = 0;
                }else if(this.velocity.y >= 0){
                    this.frames = 3;
                }

        }else{
            if(this.currentState == this.states.hit.right && this.frames < this.currentFrame){
                this.frames++;
            }else if(this.currentState == this.states.hit.right && this.frames == this.currentFrame){
                if(this.velocity.y == 0){
                    this.currentState = this.states.run.right;
                    this.currentFrame = this.states.run.frames;
                }else{
                    this.currentState = this.states.jump.right;
                    this.currentFrame = this.states.jump.frames;
                }
                this.currentWidth = this.states.run.crop;
                this.width = this.states.run.width;

            }else if (this.currentState != this.states.hit.right){
                this.frames++;

                if(this.frames > this.currentFrame)
                    this.frames = 0;
            }
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
        if(this.velocity.y == 0){
            this.velocity.y += -jumpingSpeed;
            this.update();
        }
    }
}