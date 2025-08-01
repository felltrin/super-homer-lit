const canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext("2d");

class Player {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;

    this.width = size;
    this.height = size;
    this.color = color;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Circle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;

    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

class Cloud {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.color = "white";
    this.radius = 30;

    this.cloudSpeed = 3;

    // first circle fields
    this.firstCircleY = this.y - 5;

    // second circle fields
    this.secondCircleRadius = this.radius - 5;
    this.secondCircleX = this.x + 30;

    // third circle fields
    this.thirdCircleRadius = this.radius - 15;
    this.thirdCircleX = this.x - 30;
    this.thirdCircleY = this.y + 10;

    // bottom smooth rectangle
    this.bottomRectX = this.x - 30;
    this.bottomRectWidth = this.radius + 30;
    this.bottomRectHeight = this.radius - 5;

    this.circle = new Circle(
      this.x,
      this.firstCircleY,
      this.radius,
      this.color
    );
    this.circleTwo = new Circle(
      this.secondCircleX,
      this.y,
      this.secondCircleRadius,
      this.color
    );
    this.circleThree = new Circle(
      this.thirdCircleX,
      this.thirdCircleY,
      this.thirdCircleRadius,
      this.color
    );
  }

  draw() {
    this.circle.draw();
    this.circleTwo.draw();
    this.circleThree.draw();
    c.fillRect(
      this.bottomRectX,
      this.y,
      this.bottomRectWidth,
      this.bottomRectHeight
    );
  }

  update() {
    this.circle.x -= this.cloudSpeed;
    this.circleTwo.x -= this.cloudSpeed;
    this.circleThree.x -= this.cloudSpeed;
    this.bottomRectX -= this.cloudSpeed;
  }
}

class Background {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.backgroundColor = "rgba(137, 207, 240, 0.8";

    this.numOfClouds = Math.floor(Math.random() * 10);
    this.clouds = [];
  }

  initialize() {
    for (let i = 0; i < this.numOfClouds; i++) {
      const x = Math.floor(Math.random() * canvas.width);
      const y = Math.floor(Math.random() * canvas.height);
      if (x > 0 && x < canvas.width - 50 && y > 50 && y < canvas.height - 50) {
        const cloud = new Cloud(x, y);
        this.clouds.push(cloud);
      }
    }
  }

  draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = this.backgroundColor;
    c.fillRect(this.x, this.y, canvas.width, canvas.height);
    for (let cloud of this.clouds) {
      cloud.draw();
    }
    c.fillStyle = "blue";
    c.fillRect(0, canvas.height - 50, canvas.width, 50);
  }

  update() {
    this.clouds.forEach((cloud, index) => {
      cloud.update();

      // removes cloud once off the screen
      if (cloud.circleTwo.x < -50) {
        this.clouds.splice(index, 1);
      }
    });
  }

  spawnClouds() {
    setInterval(() => {
      const x = canvas.width + 100;
      const y = Math.floor(Math.random() * canvas.height);
      const cloud = new Cloud(x, y);
      this.clouds.push(cloud);
    }, 1000);
  }
}

class PourMeterIndicator {
  constructor(x, y, endX, height) {
    this.x = x;
    this.y = y;

    this.height = height;
    this.endX = endX;
    this.startX = x;

    this.width = 10;
    this.speed = 5;
    this.hitRight = false;
  }

  draw() {
    c.fillStyle = "black";
    c.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    if (this.x === this.endX - this.width) {
      this.hitRight = true;
    } else if (this.x === this.startX) {
      this.hitRight = false;
    }
    if (!this.hitRight) {
      this.x += this.speed;
    } else {
      this.x -= this.speed;
    }
  }

  reset() {
    this.x = this.startX;
  }
}

const key = {
  space: {
    pressed: false,
  },
};
let isTime;

class PourMeter {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 250;
    this.height = 25;

    this.hitZoneX = this.x + 55;
    this.hitZoneWidth = 100;
    this.indicator = new PourMeterIndicator(
      this.x,
      this.y,
      this.x + this.width,
      this.height
    );
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.x, this.y, this.width, this.height);
    c.fillStyle = "green";
    c.fillRect(this.hitZoneX, this.y, this.hitZoneWidth, 25);
    this.indicator.draw();
    c.strokeStyle = "black";
    c.strokeRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.indicator.update();
    if (key.space.pressed) {
      if (
        this.indicator.x > this.hitZoneX &&
        this.indicator.x < this.hitZoneX + this.hitZoneWidth
      ) {
        // this.indicator.speed = 0;
        console.log("you hit!");
      }
      isTime = false;
      this.indicator.reset();
    }
  }
}

const bg = new Background(0, 0);
const pourMeter = new PourMeter(canvas.width / 2 - 125, 50);
let player = new Player(75, 250, 50, "red");
isTime = false;

bg.initialize();

let animationId;
function animate() {
  animationId = window.requestAnimationFrame(animate);
  resizeCanvasToActual();

  bg.draw();
  bg.update();
  player.draw();
  if (isTime) {
    pourMeter.draw();
    pourMeter.update();
  }
}

function resizeCanvasToActual() {
  if (canvas.width !== innerWidth || canvas.height !== innerHeight) {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
}

animate();
bg.spawnClouds();

setInterval(() => {
  if (key.space.pressed) {
    key.space.pressed = false;
  }
}, 15);

addEventListener("keypress", (event) => {
  if (event.key === " " && !event.repeat) {
    key.space.pressed = true;
  }
});

let firstTime = true;
setInterval(() => {
  if (!isTime && firstTime) {
    isTime = true;
    firstTime = false;
  } else if (isTime && !firstTime) {
    isTime = false;
    pourMeter.indicator.reset();
  } else {
    isTime = true;
  }
}, 3000);
