//variables 
let ground;
let avatar;
let barriers;
let startyell;
let endsound;
let masterRect;
let Cloud;
let Cloud2;


let isGameOver = false;
let hasGameBegun = false;
let score = 0;
let jumpCount = 0;
let canjump = true;

let minDistanceBetweenBarriers = 100;
let nextSpawnDistance;
let isInvincible = false;
let w = window.innerWidth
let h = window.innerHeight

let CloudX = w;
let Cloud2x = w / 2;

let RectY = h / 2;


function preload() {

    startyell = loadSound('subway-surfers-huy.mp3')

    masterRect = loadImage('MasterRect.png')

    Cloud = loadImage('Cloud.png')

    Cloud2 = loadImage('Cloud2.png')

    endsound = loadSound('subway-surfers-crash.mp3')
}



function setup() {
    createCanvas(w, h);
    ground = new Ground();

    resetGame();

    // stop game loop until space bar hit to begin
    noLoop();

    startyell.setVolume(1)
    endsound.setVolume(1)
}



class Ground extends Shape {
    constructor() {
        let yGround = height * 0.7;
        let groundHeight = ceil(height - yGround);
        super(0, yGround, width, groundHeight);
        this.fillColor = color(128);
        this.dividerWidth = 100; // Width of each divider
        this.dividerHeight = this.height / 24; // Height of each divider
        this.dividerSpeed = 9; // Speed of the divider movement
        this.dividerSpacing = 200; // Spacing between dividers
        this.dividers = []; // Array to store x-positions of dividers
        this.initializeDividers();
    }

    initializeDividers() {
        // Initialize dividers at suitable intervals
        for (let x = width; x > -this.dividerWidth; x -= this.dividerSpacing) {
            this.dividers.push(x);
        }
    }

    draw() {
        push();
        noStroke();
        fill(this.fillColor);
        rect(this.x, this.y, this.width, this.height); // Draw the main road

        // Draw the dividers
        fill(255); // White color for the dividers
        for (let x of this.dividers) {
            rect(x, this.y + (this.height - this.dividerHeight) / 2, this.dividerWidth, this.dividerHeight);
        }
        pop();

        // Update the position of each divider
        for (let i = 0; i < this.dividers.length; i++) {
            this.dividers[i] -= this.dividerSpeed;
            // Reset the position of the divider when it moves off the left side of the canvas
            if (this.dividers[i] + this.dividerWidth < 0) {
                this.dividers[i] = width;
            }
        }
    }
}








//Avatar 
class Avatar extends Shape {
    constructor(yGround) {
        let avatarHeight = 20;
        //height and width
        super(300, yGround - avatarHeight, 70, 70);
        this.fillColor = color(790);
        this.gravity = 0.9;
        this.jumpStrength = 20;
        this.yVelocity = 0;
        this.yGround = yGround;
    }

    jump() {
        this.yVelocity += -this.jumpStrength;
    }

    isOnGround() {
        return this.y == this.yGround - this.height;
    }

    update() {
        this.yVelocity += this.gravity;
        this.yVelocity *= 0.9; // some air resistance
        this.y += this.yVelocity;

        if (this.y + this.height > this.yGround) {
            // hit the ground
            this.y = this.yGround - this.height;
            this.yVelocity = 0;
        }
    }
    //chatgpt also did
    draw() {
        push();
        noStroke();
        fill(this.fillColor);
        ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width, this.height);

        // Draw sad face features
        let eyeSize = 5;
        let eyeOffsetX = 10;
        let eyeOffsetY = 10;
        let eyeSpacing = 15;
        let mouthOffsetY = 30; // Adjusted mouth offset
        let mouthWidth = 20;
        let mouthHeight = 20; // Adjusted mouth height

        // Draw eyebrows
        let browLength = 10;
        let browOffsetY = 5;
        stroke(0); // Black color for eyebrows
        strokeWeight(2); // Adjust eyebrow thickness
        line(this.x + this.width / 2 - eyeOffsetX - 3, this.y + this.height / 2 - eyeOffsetY - browOffsetY, this.x + this.width / 2 - eyeOffsetX + 3, this.y + this.height / 2 - eyeOffsetY - browOffsetY); // Adjusted eyebrow position
        line(this.x + this.width / 2 + eyeOffsetX - 3, this.y + this.height / 2 - eyeOffsetY - browOffsetY, this.x + this.width / 2 + eyeOffsetX + 3, this.y + this.height / 2 - eyeOffsetY - browOffsetY); // Adjusted eyebrow position

        // Draw eyes
        fill(0); // Black color for eyes
        ellipse(this.x + this.width / 2 - eyeOffsetX, this.y + this.height / 2 - eyeOffsetY, eyeSize, eyeSize);
        ellipse(this.x + this.width / 2 + eyeOffsetX, this.y + this.height / 2 - eyeOffsetY, eyeSize, eyeSize);

        // Draw mouth
        noFill();
        stroke(0); // Black color for mouth
        strokeWeight(2); // Adjust mouth thickness
        arc(this.x + this.width / 2, this.y + this.height / 2 + mouthOffsetY, mouthWidth, mouthHeight, PI + QUARTER_PI, TWO_PI - QUARTER_PI); // Adjusted mouth shape

        pop();
    }
}



//chat gpt did this
class Barrier extends Shape {
    constructor(x, yGround) {
        let barrierWidth = random(30, 70);
        let barrierHeight = random(30, 70);
        let y = yGround - barrierHeight;
        super(x, y, barrierWidth, barrierHeight);
        this.fillColor = color(57);
        this.speed = 9;
        this.hasScoredYet = false;
    }

    checkIfCollision(shape) {
        return this.overlaps(shape);
    }

    update() {
        this.x -= this.speed;
    }
    //chatgpt did this for me <3
    draw() {
        push();
        noStroke();
        fill(this.fillColor);
        rect(this.x, this.y, this.width, this.height); // Draw the barrier rectangle

        // Draw the angry eyes
        fill(0); // Black color
        ellipse(this.x + this.width / 4, this.y + this.height / 3, this.width / 6, this.height / 6); // Left eye
        ellipse(this.x + this.width * 3 / 4, this.y + this.height / 3, this.width / 6, this.height / 6); // Right eye

        // Draw the angry eyebrows
        stroke(0); // Black color
        strokeWeight(2);
        line(this.x + this.width / 4 - 5, this.y + this.height / 3 - 10, this.x + this.width / 4 + 5, this.y + this.height / 3 - 5); // Left eyebrow
        line(this.x + this.width * 3 / 4 - 5, this.y + this.height / 3 - 5, this.x + this.width * 3 / 4 + 5, this.y + this.height / 3 - 10); // Right eyebrow
        // Right eyebrow
        // Draw the angry mouth
        noFill();
        stroke(0); // Black color
        strokeWeight(2);
        arc(this.x + this.width / 2, this.y + this.height * 3 / 4, this.width / 2, this.height / 4, 0, PI); // Angry mouth
        pop();
    }
}




function resetGame() {
    score = 0;
    isGameOver = false;

    avatar = new Avatar(ground.y);
    barriers = [new Barrier(width, ground.y)];
    loop();
}



function keyPressed() {
    //if (key == ' ' && avatar.isOnGround()){ // spacebar 
    //     avatar.jump();
    //    } 
    //Adhish helped me with this/////
    if (key == ' ' && avatar.y >> h / 2 - 60 && canjump == true) { // spacebar 
        if (jumpCount < 2) {
            jumpCount += 1
            avatar.jump();
            canjump = true
        }
        else {
            canjump == false
            jumpCount = 0
        }

    }
    if (avatar.isOnGround) {
        jumpCount = 0
        canjump = true
    }
    // check for special states (game over or if game hasn't begun)
    //if (key == ' ' && avatar.isOnGround() == false){
    //startyell.play()
    //}
    if (isGameOver == true && key == ' ') {
        resetGame();
        startyell.play()
    }

    else if (hasGameBegun == false && key == ' ') {
        hasGameBegun = true;
        loop();
        startyell.play()
    }



}





function draw() {
    background(65, 129, 126);


    if (barriers.length <= 0 || width - barriers[barriers.length - 1].x >= nextSpawnDistance) {
        barriers.push(new Barrier(width, ground.y));
        nextSpawnDistance = random(minDistanceBetweenBarriers, width * 1);
    }

    // loop through all the barriers and update them
    for (let i = barriers.length - 1; i >= 0; i--) {
        barriers[i].update();
        barriers[i].draw();

        //if we hit the barrier, end game
        if (isInvincible != true && barriers[i].checkIfCollision(avatar)) {
            isGameOver = true;
            noLoop(); // game is over, stop game loop
        }

        if (barriers[i].hasScoredYet == false && barriers[i].getRight() < avatar.x) {
            barriers[i].hasScoredYet = true;
            score++;
        }

        // remove barriers that have gone off the screen
        if (barriers[i].getRight() < 0) {
            barriers.splice(i, 1);
        }
    }

    if (isGameOver == true) {
        endsound.play()
    }

    avatar.update(ground.y);
    ground.draw();
    avatar.draw();
    drawScore();

    CloudX -= 5
    Cloud2x -= 5

    RectY = 0

    if (hasGameBegun == true && RectY < -masterRect.height) {
        RectY = height;
    }

    image(masterRect, 5, 280, 200, 200)

    if (hasGameBegun == true && CloudX < -Cloud.width) {
        CloudX = width;
    }

    image(Cloud, CloudX, 10, 200, 200)

    if (hasGameBegun == true && Cloud2x < -Cloud2.width) {
        Cloud2x = width;
    }

    image(Cloud2, Cloud2x, 10, 200, 200)

}

function drawScore() {

    fill(0);
    textAlign(LEFT);
    textSize(35);
    text('Score:' + score, 10, 20);

    if (isGameOver) {

        // dark overlay
        fill(0, 0, 0, 100);
        rect(0, 0, width, height);

        // draw game over text
        textAlign(CENTER);
        textSize(35);
        fill(255);
        text('GAME OVER!', width / 2, height / 3);
        text('Master Rect() has caught you!', width / 2, height / 2.5);

        textSize(12);
        text('Press SPACE BAR to play again.', width / 2, height / 2);

    } else if (hasGameBegun == false) {
        // if we're here, then the game hasnt started yet

        // dark overlay
        fill(0, 0, 0, 100);
        rect(0, 0, width, height);

        // draw game over text
        textAlign(CENTER);
        textSize(30);
        fill(255);
        text('You’re a circle in a world full of rectangles. The rectangles are trying to kill you!', width / 2, height / 3)
        text('Escape from Master Rect() and jump over his rectangle minions.', width / 2, height / 2.5)
        textSize(12);
        text('Press SPACE BAR to play!', width / 2, height / 2);
    }
}

