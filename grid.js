var GridEnum = Object.freeze({empty:1, wall:2, spikes:3, target:4, start:5})
var SwitchEnum = Object.freeze({empty:1, yellow:2, magenta:3, cyan:4})

class Grid {

  constructor(rows, cols) {
    this.grid = [];
    this.switches = [];
    this.cellWidth = width/cols;
    this.cellHeight = height/rows;
    this.nextChangeTime = 0;
    this.solved = false;
    for (let r = 0; r < rows; r++) {
      this.grid[r] = [];
      this.switches[r] = [];
      for (let c = 0; c < cols; c++) {
        this.grid[r][c] = GridEnum.empty;
        this.switches[r][c] = SwitchEnum.empty;
      }
    }
  }

  display() {
    for (let r = 0; r < this.grid.length; r++) {
      let y = map(r,0,this.grid.length,0,height);
      for (let c = 0; c < this.grid[r].length; c++) {
        let x = map(c,0,this.grid[r].length,0,width);
        let dot = true;
        let squareColor, switchColor;
        switch(this.grid[r][c]) {
          case GridEnum.spikes:
            squareColor = color(255, 130, 130);
            break;
          case GridEnum.wall:
            squareColor = color(50);
            break
          case GridEnum.target:
            squareColor = color(138, 255, 130);
            break
          case GridEnum.start:
            squareColor = color(130, 163, 255);
            break;
          default:
            squareColor = color(250);
        }
        switch(this.switches[r][c]) {
          case SwitchEnum.yellow:
            switchColor = color(255,255,0);
            break;
          case SwitchEnum.magenta:
            switchColor = color(255,0,255);
            break;
          case SwitchEnum.cyan:
            switchColor = color(0,255,255);
            break;
          default:
            dot = false;
        }
        fill(squareColor);
        rect(x, y, this.cellWidth, this.cellHeight);
        if (dot) {
          fill(switchColor);
          ellipse(x+this.cellWidth/2, y+this.cellHeight/2, 0.7*this.cellWidth, 0.7*this.cellHeight);
        }
      }
    }
  }

  saveGrid() {
    let json = {grid:this.grid, switches:this.switches};
    saveJSON(json, "level.json");
  }

  coords(row, col) {
    return createVector((col+0.5)*this.cellWidth, (row+0.5)*this.cellHeight);
  }

  terrainAt(row, col) {
    return this.grid[row][col];
  }

  switchAt(row, col) {
    return this.switches[row][col];
  }

  inBounds(row, col) {
    return row >= 0 && row < this.grid.length &&
      col >= 0 && col < this.grid[0].length;
  }

  startProgram() {
    let agentStartR = -1, agentStartC = -1;
    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < this.grid[r].length; c++) {
        if (this.grid[r][c] == GridEnum.start) {
          agentStartR = r;
          agentStartC = c;
        }
      }
    }
    if (agentStartR > 0 && agentStartC > 0)
      agent = new Agent(this, agentStartR, agentStartC);
  }

}

function gridFromJSON(lvl) {
  let gr = lvl.grid, sw = lvl.switches;
  let grid = new Grid(gr.length, gr[0].length);
  grid.grid = gr;
  grid.switches = sw;
  return grid;
}
