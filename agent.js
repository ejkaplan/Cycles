var DirEnum = Object.freeze({north:1, east:2, south:3, west:4})

class Agent {

  constructor(grid, row, col) {
    this.grid = grid;
    this.row = row;
    this.col = col;
    this.dir = DirEnum.north;
    this.running = true;
    this.nextChangeTime = millis() + 500;
    this.mode = this.grid.switchAt(this.row, this.col);
    this.step = 0;
    this.programs = []
    let fields = [yProgram, mProgram, cProgram];
    for (let x in fields) {
      this.programs.push(fields[x].value().toLowerCase().split(","));
    }
  }

  update() {
    if (this.running && millis() > this.nextChangeTime) {
      if (this.grid.terrainAt(this.row, this.col) == GridEnum.spikes) {
        this.running = false;
        explosionSnd.play();
        return;
      } else if (this.grid.terrainAt(this.row, this.col) == GridEnum.target) {
        this.running = false;
        this.grid.solved = true;
        jingleSnd.play();
        return;
      }
      let move = this.programs[this.mode-2][this.step];
      this.nextChangeTime = millis() + 500;
      this.step = (this.step + 1) % this.programs[this.mode-2].length;
      if (move == "f") {
        let nextRow = this.row, nextCol = this.col;
        if (this.dir % 2 == 1) {
          nextRow += this.dir == 1 ? -1 : 1;
        } else {
          nextCol += this.dir == 2 ? 1 : -1;
        }
        if (!this.grid.inBounds(nextRow, nextCol)) {
          this.running = false;
          explosionSnd.play();
          return;
        }
        if (this.grid.terrainAt(nextRow, nextCol) != GridEnum.wall) {
          this.row = nextRow;
          this.col = nextCol;
          moveSnd.rate(random(0.5,1.5));
          moveSnd.play();
          if (this.grid.switchAt(this.row, this.col) != SwitchEnum.empty) {
            this.mode = this.grid.switchAt(this.row, this.col);
            this.step = 0;
          }
        } else {
          wallSnd.play();
        }
      } else if (move == "r") {
        this.dir = this.dir == 4 ? 1 : this.dir+1;
        moveSnd.rate(random(0.5,1.5));
        moveSnd.play();
      } else if (move == "l") {
        this.dir = this.dir == 1 ? 4 : this.dir-1;
        moveSnd.rate(random(0.5,1.5));
        moveSnd.play();
      }
    }
  }

  display() {
    let loc = this.grid.coords(this.row, this.col);
    let w = 0.7*this.grid.cellWidth;
    let h = 0.7*this.grid.cellHeight;
    push();
    translate(loc.x, loc.y);
    rotate(-PI + HALF_PI * this.dir);
    ellipse(0, 0, 10, 10);
    fill(0,0,255);
    triangle(w/2, 0, -w/2, -h/2, -w/2, h/2);
    pop();
  }

}
