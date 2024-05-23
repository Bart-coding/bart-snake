let mapSize,
  snakePartSize,
  snakePartRadius,
  snakeParts,
  pointsPerSpeedUp,
  speedDivider,
  direction,
  fruits,
  minFruitSize,
  maxFruitSize,
  score,
  scoreTextY,
  scoreTextColor,
  framesPerTurn,
  lastTurnFrameCount,
  music,
  biteSound,
  musicRate;

function preload() {
  music = loadSound("./assets/Sneaky-Snitch(chosic.com).mp3");
	biteSound = loadSound("./assets/Apple_Bite-Simon_Craggs-1683647397.mp3");
}

function setup() {
  mapSize = 750;
  createCanvas(mapSize, mapSize);

  snakePartSize = 50;
  snakePartRadius = snakePartSize / 2;
  rectMode(CENTER);
  snakeParts = [
    [
      snakePartRadius,
      snakePartRadius,
      color(random(100, 255), random(100, 255), random(100, 255)),
    ],
  ];
  speedDivider = 30;
  pointsPerSpeedUp = 4;
  direction = [0, 1];
  framesPerTurn = 10;
  lastTurnFrameCount = 0;

  minFruitSize = 15;
  maxFruitSize = 30;
  fruits = [
    [
      width / 2,
      height / 2,
      random(minFruitSize, maxFruitSize),
      color(random(100, 255), random(100, 255), random(100, 255)),
    ],
    [
      (width * 2) / 5,
      height / 4,
      random(minFruitSize, maxFruitSize),
      color(random(100, 255), random(100, 255), random(100, 255)),
    ],
    [
      (width * 4) / 5,
      (height * 2) / 5,
      random(minFruitSize, maxFruitSize),
      color(random(100, 255), random(100, 255), random(100, 255)),
    ],
  ];

  score = 0;
  scoreTextY = 60;
  scoreTextColor = color(255);
  textAlign(CENTER, CENTER);
  textSize(80);

  music.loop();
  music.play();
}

function handleFruitEating() {
  for (let i = fruits.length - 1; i >= 0; --i) {
    if (
      snakeParts[0][0] - snakePartRadius <= fruits[i][0] &&
      snakeParts[0][0] + snakePartRadius >= fruits[i][0] &&
      snakeParts[0][1] - snakePartRadius <= fruits[i][1] &&
      snakeParts[0][1] + snakePartRadius >= fruits[i][1]
    ) {
	    biteSound.play();
		
      fruitX = random(minFruitSize / 2, mapSize - minFruitSize / 2);
      fruitY = random(minFruitSize / 2, mapSize - minFruitSize / 2);
      /*let pixel = get(fruitX, fruitY); //
      while (!(red(pixel) === 0 && green(pixel) === 0 && blue(pixel) === 0)) {
        fruitX = random(minFruitSize / 2, mapSize - minFruitSize / 2);
        fruitY = random(minFruitSize / 2, mapSize - minFruitSize / 2);
        pixel = get(fruitX, fruitY);
      }*/
      fruits[i] = [
        fruitX,
        fruitY,
        random(minFruitSize, maxFruitSize),
        color(random(100, 255), random(100, 255), random(100, 255)),
      ];

      let newSnakePart = [
        -1,
        -1,
        color(random(100, 255), random(100, 255), random(100, 255)),
      ];
      snakeParts.push(newSnakePart);

      ++score;
      if (score % pointsPerSpeedUp === 0) {
        speedDivider -= 1;

      let currentTime = music.currentTime();
      music.stop();
      let currentRate = music.rate();
      music.rate(currentRate + 0.08);
      music.jump(currentTime);
      music.play();
      } 
      continue;
    }
    fill(fruits[i][3]);
    noStroke();
    circle(fruits[i][0], fruits[i][1], fruits[i][2]);
  }
}

function moveSnakeParts() {
  let snakeHeadNewPosition = [snakeParts[0][0], snakeParts[0][1]];
  snakeHeadNewPosition[direction[0]] =
    (((snakeHeadNewPosition[direction[0]] + snakePartSize * direction[1]) %
      mapSize) +
      mapSize) %
    mapSize;

  for (let i = snakeParts.length - 1; i >= 1; --i) {
    if (
      snakeHeadNewPosition[0] === snakeParts[i][0] &&
      snakeHeadNewPosition[1] === snakeParts[i][1]
    ) {
      snakeParts = [[...snakeHeadNewPosition, snakeParts[0][2]]];
      score = 0;
      music.stop();
      music.play();
      break;
    }

    snakeParts[i][0] = snakeParts[i - 1][0];
    snakeParts[i][1] = snakeParts[i - 1][1];

    fill(snakeParts[i][2]);
    noStroke();
    rect(snakeParts[i][0], snakeParts[i][1], snakePartSize, snakePartSize);
  }

  fill(snakeParts[0][2]);
  noStroke();
  snakeParts[0][direction[0]] =
    (((snakeParts[0][direction[0]] + snakePartSize * direction[1]) % mapSize) +
      mapSize) %
    mapSize;
  rect(snakeParts[0][0], snakeParts[0][1], snakePartSize, snakePartSize);
}

function redrawScoreText() {
  if (frameCount) fill(scoreTextColor);
  text("Score: " + score, width / 2, scoreTextY);
}

function redrawMap() {
  background(0);
  handleFruitEating();
  moveSnakeParts();
  redrawScoreText();
}
function draw() {
  let redrawed = false;
  if (lastTurnFrameCount === 0) {
    if (keyIsDown(LEFT_ARROW) && !(direction[0] === 0)) {
      direction = [0, -1];
      redrawMap();
      redrawed = true;
      lastTurnFrameCount = framesPerTurn;
    } else if (keyIsDown(RIGHT_ARROW) && !(direction[0] === 0)) {
      direction = [0, 1];
      redrawMap();
      redrawed = true;
      lastTurnFrameCount = framesPerTurn;
    } else if (keyIsDown(UP_ARROW) && !(direction[0] === 1)) {
      direction = [1, -1];
      redrawMap();
      redrawed = true;
      lastTurnFrameCount = framesPerTurn;
    } else if (keyIsDown(DOWN_ARROW) && !(direction[0] === 1)) {
      direction = [1, 1];
      redrawMap();
      redrawed = true;
      lastTurnFrameCount = framesPerTurn;
    }
  }
  if (lastTurnFrameCount > 0) lastTurnFrameCount -= 1;

  if (!redrawed && frameCount % speedDivider === 0) {
    redrawMap();
  }
}