let mapSize,
  snakePartSize,
  snakePartRadius,
  maxSnakeLengthX,
  maxSnakeLengthY,
  snakeParts,
  eyesDistFromHeadCenter,
  pointsPerSpeedUp,
  speedDivider,
  maxSpeedDivider,
  direction,
  fruits,
  minFruitSize,
  maxFruitSize,
  score,
  scoreTextSize,
  scoreTextY,
  scoreTextColor,
  framesPerTurn,
  lastTurnFrameCount,
  gameStarted,
  music,
  biteSound,
  musicRate;

function preload() {
  music = loadSound("./assets/Sneaky-Snitch(chosic.com).mp3");
  biteSound = loadSound("./assets/Apple_Bite-Simon_Craggs-1683647397.mp3");
}

function setup() {
  mapSize = [1600, 900];
  createCanvas(mapSize[0], mapSize[1]);

  background(0);
  redrawScoreText();
  fill(color(100, 250, 100));
  textAlign(CENTER, CENTER);
  textSize(180);
  text("Click to start!", mapSize[0] / 2, mapSize[1] / 2);

  snakePartSize = 100;
  snakePartRadius = snakePartSize / 2;
  maxSnakeLengthX = mapSize[0] / snakePartSize;
  maxSnakeLengthY = mapSize[1] / snakePartSize;
  rectMode(CENTER);
  snakeParts = [
    [
      snakePartRadius,
      snakePartRadius,
      color(random(100, 256), random(100, 256), random(100, 256)),
    ],
  ];
  eyesDistFromHeadCenter = snakePartRadius * 0.6;

  maxSpeedDivider = 30;
  speedDivider = maxSpeedDivider;
  pointsPerSpeedUp = 4;
  direction = [0, 1];
  framesPerTurn = 10;
  lastTurnFrameCount = 0;

  minFruitSize = 15;
  maxFruitSize = 30;
  fruits = [
    [
      snakePartRadius + snakePartSize * 2,
      snakePartRadius,
      random(minFruitSize, maxFruitSize),
      color(random(100, 256), random(100, 256), random(100, 256)),
    ],
    [
      snakePartRadius + snakePartSize * 3,
      snakePartRadius + snakePartSize * 2,
      random(minFruitSize, maxFruitSize),
      color(random(100, 256), random(100, 256), random(100, 256)),
    ],
    [
      snakePartRadius + snakePartSize * 8,
      snakePartRadius + snakePartSize * 5,
      random(minFruitSize, maxFruitSize),
      color(random(100, 256), random(100, 256), random(100, 256)),
    ],
  ];

  score = 0;
  scoreTextSize = 100;
  scoreTextY = 80;
  scoreTextColor = color(255);
  textSize(scoreTextSize);
  
  gameStarted = false;

  music.loop();
  music.play();
}

function getNewFruitCoords() {
  fruitX = snakePartRadius + snakePartSize * int(random(0, maxSnakeLengthX));
  fruitY = snakePartRadius + snakePartSize * int(random(0, maxSnakeLengthY));
  for (let fruit of fruits) {
    if (fruitX === fruit[0] && fruitY === fruit[1]) return getNewFruitCoords();
  }
  for (let snakePart of snakeParts) {
    if (fruitX === snakePart[0] && fruitY === snakePart[1])
      return getNewFruitCoords();
  }
  return [fruitX, fruitY];
}

function redrawFruits() {
  for (let i = fruits.length - 1; i >= 0; --i) {
    if (
      snakeParts[0][0] === fruits[i][0] &&
      snakeParts[0][1] === fruits[i][1]
    ) {
      biteSound.play();
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

      fruitCoords = getNewFruitCoords();
      fruits[i] = [
        fruitCoords[0],
        fruitCoords[1],
        random(minFruitSize, maxFruitSize),
        color(random(100, 256), random(100, 256), random(100, 256)),
      ];

      let newSnakePart = [
        -1,
        -1,
        color(random(100, 256), random(100, 256), random(100, 256)),
      ];
      snakeParts.push(newSnakePart);
    } else {
      fill(fruits[i][3]);
      noStroke();
      circle(fruits[i][0], fruits[i][1], fruits[i][2]);
    }
  }
}

function redrawSnakeEyes() {
  let leftEyeCoords = [];
  let rightEyeCoords = [];
  if (direction[0] === 0 && direction[1] === 1) {
    leftEyeCoords = [
      snakeParts[0][0] - eyesDistFromHeadCenter,
      snakeParts[0][1] - eyesDistFromHeadCenter,
    ];
    rightEyeCoords = [
      snakeParts[0][0] - eyesDistFromHeadCenter,
      snakeParts[0][1] + eyesDistFromHeadCenter,
    ];
  } else if (direction[0] === 0 && direction[1] === -1) {
    leftEyeCoords = [
      snakeParts[0][0] + eyesDistFromHeadCenter,
      snakeParts[0][1] + eyesDistFromHeadCenter,
    ];
    rightEyeCoords = [
      snakeParts[0][0] + eyesDistFromHeadCenter,
      snakeParts[0][1] - eyesDistFromHeadCenter,
    ];
  } else if (direction[0] === 1 && direction[1] === -1) {
    leftEyeCoords = [
      snakeParts[0][0] - eyesDistFromHeadCenter,
      snakeParts[0][1] + eyesDistFromHeadCenter,
    ];
    rightEyeCoords = [
      snakeParts[0][0] + eyesDistFromHeadCenter,
      snakeParts[0][1] + eyesDistFromHeadCenter,
    ];
  } else {
    leftEyeCoords = [
      snakeParts[0][0] + eyesDistFromHeadCenter,
      snakeParts[0][1] - eyesDistFromHeadCenter,
    ];
    rightEyeCoords = [
      snakeParts[0][0] - eyesDistFromHeadCenter,
      snakeParts[0][1] - eyesDistFromHeadCenter,
    ];
  }
  circle(leftEyeCoords[0], leftEyeCoords[1], snakePartSize / 5);
  circle(rightEyeCoords[0], rightEyeCoords[1], snakePartSize / 5);
  fill(color(250));
  circle(leftEyeCoords[0], leftEyeCoords[1], snakePartSize / 10);
  circle(rightEyeCoords[0], rightEyeCoords[1], snakePartSize / 10);
  fill(color(50));
  circle(leftEyeCoords[0], leftEyeCoords[1], snakePartSize / 30);
  circle(rightEyeCoords[0], rightEyeCoords[1], snakePartSize / 30);
}

function moveSnake() {
  let newSnakeHead = [...snakeParts[0]];
  let mapSizeInTurnDirection = mapSize[direction[0]];
  newSnakeHead[direction[0]] =
    (((newSnakeHead[direction[0]] + snakePartSize * direction[1]) %
      mapSizeInTurnDirection) +
      mapSizeInTurnDirection) %
    mapSizeInTurnDirection;

  for (let i = snakeParts.length - 1; i >= 1; --i) {
    if (
      newSnakeHead[0] === snakeParts[i][0] &&
      newSnakeHead[1] === snakeParts[i][1]
    ) {
      snakeParts = [[]];
      score = 0;
      speedDivider = maxSpeedDivider;
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

  snakeParts[0] = [...newSnakeHead];
  fill(snakeParts[0][2]);
  noStroke();
  rect(snakeParts[0][0], snakeParts[0][1], snakePartSize, snakePartSize);
  fill(color(80));

  redrawSnakeEyes();
}

function redrawScoreText() {
  if (frameCount) fill(scoreTextColor);
  text("Score: " + score, mapSize[0] / 2, scoreTextY);
}

function redrawMap() {
  background(0);
  redrawFruits();
  moveSnake();
  redrawScoreText();
}
function draw() {
  if (!gameStarted) return;
  
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

function mouseClicked() {
  gameStarted = true;
}