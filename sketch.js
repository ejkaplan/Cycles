let grid;
let agent;
let level_order = [
  "straight_line.json",
  "two_color_corner.json",
  "one_color_corner.json",
  "spiral.json",
  "spoon.json",
  "salmon_ladder.json",
  "polkadots.json",
  "fork_in_the_road.json",
  "polka_explosion.json"
]
let json = [];
let level = 0;
let editor = false;
let yProgram, mProgram, cProgram;
let runButton, stopButton, saveButton, sizeUpButton, sizeDownButton;
let prevButton, nextButton;
let jingleSnd, explosionSnd, moveSnd, wallSnd;
let size = 7;
let programLength = 0;

function preload() {
  jingleSnd = loadSound("sounds/jingle.wav");
  explosionSnd = loadSound("sounds/explosion.wav");
  moveSnd = loadSound("sounds/move.wav");
  wallSnd = loadSound("sounds/wall.wav");
  for (let fname of level_order) {
    let f = "levels/"+fname;
    console.log(f);
    json.push(loadJSON(f))
  }
}

function setup() {
  let myCanvas = createCanvas(600,600);
  myCanvas.parent('canvasContainer');
  createElement('span',"yellow: ").parent("yellowContainer");
  yProgram = createInput();
  yProgram.parent('yellowContainer');
  createElement('span',"magenta: ").parent("magentaContainer");
  mProgram = createInput();
  mProgram.parent('magentaContainer');
  createElement('span',"cyan: ").parent("cyanContainer");
  cProgram = createInput();
  cProgram.parent('cyanContainer');
  runButton = createButton("Run");
  runButton.mousePressed(runProgram);
  runButton.parent('buttonContainer');
  stopButton = createButton("Stop");
  stopButton.mousePressed(stopProgram);
  stopButton.parent('buttonContainer');
  prevButton = createButton("Previous");
  prevButton.mousePressed(prevLevel);
  prevButton.parent('levelContainer');
  prevButton = createButton("Next");
  prevButton.mousePressed(nextLevel);
  prevButton.parent('levelContainer');
  saveButton = createButton("Save");
  saveButton.mousePressed(saveLevel);
  saveButton.parent('buttonContainer');
  saveButton.hide();
  sizeUpButton = createButton("Bigger");
  sizeUpButton.mousePressed(sizeUp);
  sizeUpButton.parent('buttonContainer');
  sizeUpButton.hide();
  sizeDownButton = createButton("Smaller");
  sizeDownButton.mousePressed(sizeDown);
  sizeDownButton.parent('buttonContainer');
  sizeDownButton.hide();
  background(0);
  grid = new Grid(7,7);
  grid = gridFromJSON(json[0]);
}

function draw() {
  grid.display();
  if (agent != null) {
    agent.update();
    agent.display();
    if (!agent.running) agent = null;
  }
}

function mousePressed() {
  if (editor && agent == null) {
    let c = int(mouseX / grid.cellWidth);
    let r = int(mouseY / grid.cellHeight);
    if (r >= grid.grid.length || c >= grid.grid[0].length) return;
    if (keyIsPressed && key == 's') {
      grid.switches[r][c]++;
      if (grid.switches[r][c] > Object.keys(SwitchEnum).length) grid.switches[r][c] = 1;
    } else {
      grid.grid[r][c]++;
      if (grid.grid[r][c] > Object.keys(GridEnum).length) grid.grid[r][c] = 1;
    }
  }
}

function runProgram() {
  grid.startProgram();
}

function stopProgram() {
  agent = null;
}

function saveLevel() {
  grid.saveGrid();
}

function sizeUp() {
  size++;
  grid = new Grid(size, size);
}

function sizeDown() {
  size = max(size-1,3);
  grid = new Grid(size, size);
}

function prevLevel() {
  level = max(level-1, -1);
  agent = null;
  if (level < 0){
     editor = true;
     saveButton.show();
     sizeUpButton.show();
     sizeDownButton.show();
     grid = new Grid(size, size);
  } else {
    grid = gridFromJSON(json[level]);
  }
}

function nextLevel() {
  level = min(level+1, json.length-1);
  agent = null;
  if (level >= 0) {
    editor = false;
    saveButton.hide();
    sizeUpButton.hide();
    sizeDownButton.hide();
    grid = gridFromJSON(json[level]);
  }
}
