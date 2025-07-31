const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

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

let player = new Player(75, 250, 50, "red");
const bg = new Background(0, 0);
bg.initialize();

function animate() {
  window.requestAnimationFrame(animate);
  bg.draw();
  bg.update();
  player.draw();
}

animate();
bg.spawnClouds();
