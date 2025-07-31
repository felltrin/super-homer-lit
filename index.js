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

let player = new Player(10, 10, 50, "red");

c.fillStyle = "rgba(137, 207, 240, 0.8)";
c.fillRect(0, 0, canvas.width, canvas.height);

player.draw();

function init() {
  player = new Player(10, 10, 50, "red");

  // move to animate function
  player.draw();
  c.fillStyle = "rgba(0, 0, 0, 0.2)";
}

// init();
