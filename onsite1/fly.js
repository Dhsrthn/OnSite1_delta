

let can, x, y
window.onload = function () {
  can = document.getElementById("backgroundcanvas")
  resizeCanvas(can)
}

window.onresize = function () {
  resizeCanvas(can)
}

function resizeCanvas(canvas) {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}


//game variables

let backCanvas = document.getElementById("backgroundcanvas")
var ctx = backCanvas.getContext("2d")
let pause = false;
let request;
let clickX, clickY;
let start = true
let clicked = false
let radius = window.innerWidth / 25




//game objects

const backgroundImg = document.createElement('img')
backgroundImg.src = 'assets/background2.jpg'

const leftImg = document.createElement('img')
leftImg.src = 'assets/left.png'

const rightImg = document.createElement('img')
rightImg.src = 'assets/right.png'

const deadImg = document.createElement('img')
deadImg.src = 'assets/dead.png'

const swatter = document.createElement('img')
swatter.src = 'assets/swatter.png'


class fly {
  constructor(x, y, speed, radius, h) {
    this.x = x
    this.y = y
    this.speed = speed
    this.start = true
    this.radius = radius
    this.windowHeight = h

  }

  //methods
  draw() {
    ctx.beginPath()
    // ctx.arc(this.x,this.y,this.radius,0,2*Math.PI)
    // ctx.fillStyle='white'
    // ctx.fill()

    if (this.start) {
      this.playerImg = rightImg
      this.new = false
      this.dead = false
      this.genRandomLoc()
      this.start = false
    }
    ctx.save()
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    ctx.drawImage(this.playerImg, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2)
    ctx.closePath()
    ctx.restore()
    if (!this.dead) {
      this.move()
    }
    else {
      this.playerImg=deadImg
      this.y += 6
      if (this.y - this.radius > this.windowHeight) {
        this.new = true
      }
    }
  }

  genRandomLoc() {
    let xw = window.innerWidth
    let yh = window.innerHeight
    this.targetx = Math.random() * (xw - 2 * this.radius) + this.radius
    this.targety = Math.random() * (yh - 2 * this.radius) + this.radius
    if (this.targetx - this.x > 0) {
      this.playerImg = rightImg
    } else {
      this.playerImg = leftImg

    }
    //Math.random() * (max - min + 1) + min) 
    this.move()
  }

  move() {
    this.angletravel = Math.atan2(this.targety - this.y, this.targetx - this.x)
    this.x += this.speed * (Math.cos(this.angletravel))
    this.y += this.speed * (Math.sin(this.angletravel))
    if (this.targetx - this.x < 5 && this.targety - this.y < 5) {
      this.targetx = this.x
      this.targety = this.y
      this.genRandomLoc()
    }

  }
}


//game functions
let insectArray = []
let score = 0

function main() {
  if (start) {
    let array = generateRandom()
    insectArray.push(new fly(array[0], array[1], 5, radius, window.innerHeight))
    start = false
  }
  if (!pause) {
    request = requestAnimationFrame(main)
    window.addEventListener('mousedown', getCoord)
    let height = window.innerHeight
    let width = window.innerWidth
    ctx.drawImage(backgroundImg, -10, -10, width+10, height+10);
    ctx.font=`${window.innerWidth/30}px Verdana`
    ctx.fillStyle = 'white'
    ctx.fillText(`score ${score}`, 50, 80)

    if (insectArray[0]) {
      insectArray[0].draw()
    }
    gameLogic()

  } else {

  }

  //gamelogic
  //gamepretty

}

window.requestAnimationFrame(main)


function gameLogic() {
  // if(checkDeath){
  //   insectArray.pop()
  //   insectArray.push(new fly())
  // }
  checkDeath()
}

function gamePretty() {

}

function getCoord(e) {
  clickX = e.clientX
  clickY = e.clientY
  clicked = true
}

function checkDeath() {
  if (clicked) {
    console.log('clicked')

    if ((Math.sqrt((clickX - insectArray[0].x) ** 2 + (clickY - insectArray[0].y) ** 2)) < insectArray[0].radius) {
      insectArray[0].dead = true
    }
    clicked = false
  }
  if (insectArray[0].new) {
    score++
    insectArray.pop()
    let array = generateRandom()
    insectArray.push(new fly(array[0], array[1], 5+ Math.random()*5, radius, window.innerHeight))

  }
}

// let xw=window.innerWidth
//     let yh=window.innerHeight
//     this.targetx=Math.random()*(xw-2*this.radius)+this.radius
//     this.targety=Math.random() * (yh-2*this.radius)+this.radius


function generateRandom() {
  let xw = window.innerWidth
  let yh = window.innerHeight
  return [Math.random() * (xw - 2 * radius) + radius, Math.random() * (yh - 2 * radius) + radius]
}


//fly swatter

// const cursorRounded = document.querySelector('swatter');


// const moveCursor = (e)=> {
//   const mouseY = e.clientY;
//   const mouseX = e.clientX;
   
//   cursorRounded.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  
 
// }

// window.addEventListener('mousemove', moveCursor)