let can, x, y;
window.onload = function () {
  can = document.getElementById("backgroundcanvas");
  resizeCanvas(can);
};

window.onresize = function () {
  resizeCanvas(can);
};

function resizeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

//game variables
let backCanvas = document.getElementById("backgroundcanvas");
var ctx = backCanvas.getContext("2d");
let pause = false;
let request;
let clickX, clickY;
let start = true;
let clicked = false;
let radius = window.innerWidth / 25;

//game objects
const leftImg = document.createElement("img");
leftImg.src = "assets/spriteLeft.png";

const rightImg = document.createElement("img");
rightImg.src = "assets/spriteRight.png";

const deadImg = document.createElement("img");
deadImg.src = "assets/dead.png";

const bushImg = document.createElement("img");
bushImg.src = "assets/bush.png";

class fly {
  constructor(x, y, speed, radius, h) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.start = true;
    this.radius = radius;
    this.windowHeight = h;
    this.spriteWidth = 240;
    this.n = 0;
    this.frameDelay = 700 / speed;
    this.lastFrameTime = performance.now();
  }

  //methods
  updateFrame() {
    const currentTime = performance.now();
    const elapsedTime = currentTime - this.lastFrameTime;
    if (elapsedTime >= this.frameDelay) {
      this.n++;
      if (this.n > 6) {
        this.n = 0;
      }

      this.lastFrameTime = currentTime;
    }
  }

  draw() {
    ctx.beginPath();
    if (this.start) {
      this.playerImg = rightImg;
      this.new = false;
      this.dead = false;
      this.genRandomLoc();
      this.start = false;
    }
    ctx.save();

    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    if (!this.dead) {
      ctx.drawImage(
        this.playerImg,
        this.n * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteWidth,
        this.x - this.radius,
        this.y - this.radius,
        this.radius * 2,
        this.radius * 2
      );
    } else {
      ctx.drawImage(
        this.playerImg,
        this.x - this.radius,
        this.y - this.radius,
        this.radius * 2,
        this.radius * 2
      );
    }
    ctx.closePath();
    ctx.restore();
    if (!this.dead) {
      this.updateFrame();
      this.move();
    } else {
      this.playerImg = deadImg;
      this.y += 8;
      if (this.y - this.radius > this.windowHeight) {
        this.new = true;
      }
    }
  }

  genRandomLoc() {
    let xw = window.innerWidth;
    let yh = window.innerHeight;
    this.targetx = Math.random() * (xw - 2 * this.radius) + this.radius;
    this.targety = Math.random() * (yh - 2 * this.radius) + this.radius;
    if (this.targetx - this.x > 0) {
      this.playerImg = rightImg;
    } else {
      this.playerImg = leftImg;
    }
    this.move();
  }

  move() {
    this.angletravel = Math.atan2(this.targety - this.y, this.targetx - this.x);
    this.x += this.speed * Math.cos(this.angletravel);
    this.y += this.speed * Math.sin(this.angletravel);
    if (this.targetx - this.x < 5 && this.targety - this.y < 5) {
      this.targetx = this.x;
      this.targety = this.y;
      this.genRandomLoc();
    }
  }
}

//game functions
let insectArray = [];
let score = 0;
let afterRounds = 0;
let rounds = 0;
let noActive = 1;
let currActive = 0;
let genRound = true;

function main() {
  //start condition => creates one insect
  if (start) {
    let array = generateRandom();
    insectArray.push(
      new fly(
        array[0],
        array[1],
        window.innerWidth / 360,
        radius,
        window.innerHeight
      )
    );
    currActive++;
    afterRounds = rounds + Math.floor(Math.random() * 10) + 1;
    genRound = false;
    start = false;
  }

  if (!pause) {
    request = requestAnimationFrame(main);
    if (!timeout) {
      window.addEventListener("mousedown", getCoord);
    } else {
      timeout = false;
      setTimeout(() => {
        window.addEventListener("mousedown", getCoord);
      }, 1500);
    }
    let height = window.innerHeight;
    let width = window.innerWidth;
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${window.innerWidth / 30}px Verdana`;
    ctx.fillStyle = "white";
    ctx.fillText(
      `Score ${score}`,
      (6 * window.innerWidth) / 14,
      80,
      window.innerWidth / 7
    );

    if (insectArray.length > 0) {
      for (insect of insectArray) {
        insect.draw();
      }
    }

    ctx.beginPath();
    ctx.arc(
      window.innerWidth,
      window.innerHeight / 2,
      window.innerHeight / 5,
      Math.PI / 2,
      (3 * Math.PI) / 2
    );
    ctx.drawImage(
      bushImg,
      window.innerWidth - window.innerHeight / 5,
      (3 * window.innerHeight) / 10,
      (2 * window.innerHeight) / 5,
      (2 * window.innerHeight) / 5
    );
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(
      0,
      window.innerHeight / 1.2,
      window.innerHeight / 5,
      (3 * Math.PI) / 2,
      Math.PI / 2
    );
    ctx.drawImage(
      bushImg,
      0 - window.innerHeight / 5,
      window.innerHeight / 1.2 - window.innerHeight / 5,
      (2 * window.innerHeight) / 5,
      (2 * window.innerHeight) / 5
    );
    ctx.closePath();
    checkConditions();
  }
}

window.requestAnimationFrame(main);
window.addEventListener("keydown", pausegame);

function getCoord(e) {
  clickX = e.clientX;
  clickY = e.clientY;
  clicked = true;
}

function checkConditions() {
  if (clicked) {
    for (let i = 0; i < insectArray.length; i++) {
      if (
        Math.sqrt(
          (clickX - insectArray[i].x) ** 2 + (clickY - insectArray[i].y) ** 2
        ) < insectArray[i].radius
      ) {
        insectArray[i].dead = true;
        score++;
      }
      else if (
        Math.sqrt(
          (clickX - insectArray[i].x) ** 2 + (clickY - insectArray[i].y) ** 2
        ) < 3* insectArray[i].radius
      ) {
        if(Math.random()>0.5){
          insectArray[i].genRandomLoc();
        }
      }

    }
    clicked = false;
  }

  for (let i = 0; i < insectArray.length; i++) {
    if (insectArray[i].new) {
      insectArray.splice(i, 1);
      currActive--;
    }
  }
  if (currActive === 0) {
    rounds++;
    if (afterRounds === rounds) {
      noActive = Math.floor(Math.random() * 10) + 1;
      genRound = true;
    } else {
      noActive = 1;
      genRound = false;
    }

    for (let i = 0; i < noActive; i++) {
      console.log(noActive)
      let array = generateRandom();
      let factor = window.innerWidth / 360;
      let radiusFactor;
      if(Math.random()>0.5){
        radiusFactor=1;
      }else{
        radiusFactor = (1 + ((noActive-1)/10))
      }
      insectArray.push(
        new fly(
          array[0],
          array[1],
          factor + Math.random() * factor + (score/10),
          radius/radiusFactor,
          window.innerHeight
        )
      );
      currActive++;
    }
    if (genRound) {
      afterRounds = rounds + Math.floor(Math.random() * 10) + 1;
    }
  }
}

function generateRandom() {
  let xw = window.innerWidth;
  let yh = window.innerHeight;
  return [
    Math.random() * (xw - 2 * radius) + radius,
    Math.random() * (yh - 2 * radius) + radius,
  ];
}

function pausegame() {
  if (pause) {
    playstart();
  } else pausestart();
}

function playstart() {
  if (pause) {
    pause = false;
    main();
  }
}

let timeout = false;

function pausestart() {
  if (!pause) {
    timeout = true;
    pause = true;
    cancelAnimationFrame(request);
    window.removeEventListener("mousedown", getCoord);
    pause = true;
    ctx.fillStyle = "rgba(128,128,128,0.5)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = "black";
    ctx.fillText(
      "Pause",
      (5 * window.innerWidth) / 12,
      window.innerHeight / 3,
      window.innerWidth / 6
    );
  }
}
