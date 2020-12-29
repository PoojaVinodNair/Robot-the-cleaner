var rob_walking;
var rob_picking;
var robot;
var robo
var ground, groundImage;
var waste1, waste2, waste3, waste4;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score = 0;
var obstaclesGroup;
var carGroup;
var gameOver, restart;
var c1, c2, c3, c4

function preload() {
  rob_walking = loadAnimation("images/robwalking.png", "images/rob2.png", "images/rob3.png");
  rob_picking = loadAnimation("images/robwalking.png", "images/rob picking2.png", "images/rob picking3.png")
  robo =loadImage("images/roboO.png")

  waste1 = loadImage("images/waste1.png")
  waste2 = loadImage("images/waste2.png")
  waste3 = loadImage("images/waste3.png")
  waste4 = loadImage("images/plastic1.png")

  c1 = loadImage("images/car1.png")
  c2 = loadImage("images/car2.png")
  c3 = loadImage("images/car3.png")
  c4 = loadImage("images/car4.png")
  groundImage = loadImage("images/track.jpg");
  restartImg = loadImage("images/restart.png");
  gameOverImg = loadImage("images/gameOver.png");
}
function setup() {
  createCanvas(800, 800);


  ground = createSprite(width / 2, -height * 4, width, height * 5);
  ground.addImage("ground", groundImage);
  // ground.y = ground.height / 2;
  // ground.velocityY = (6 + 3 * score / 100);
  robot = createSprite(width / 2, 180, 20, 50);
  robot.addAnimation("walking", rob_walking);
  robot.addAnimation("picking", rob_picking);
  robot.scale = 0.6

  gameOver = createSprite(width/2,robot.y-100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(width/2, robot.y-50);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  score = 0;
  obstaclesGroup = []
  carGroup = []
}
function draw() {

  background("white")


  if (gameState === PLAY) {
    if (keyDown("up")) {
      robot.y = robot.y - 3;
    }
    if (keyDown("down")) {
      robot.y = robot.y + 3
    }
    if (keyDown("right")) {
      robot.x = robot.x + 3
    }
    if (keyDown("left")) {
      robot.x = robot.x - 3
    }
    for (var i = 0; i < obstaclesGroup.length; i++) {
      if (robot.isTouching(obstaclesGroup[i])) {
        score = score + 10;
        obstaclesGroup[i].destroy();
      }
    }
    for (var i = 0; i < carGroup.length; i++) {
      if (robot.isTouching(carGroup[i])) {
        gameState=END;
  
      }
    }
    camera.position.y = robot.position.y;
    camera.position.x = width / 2;

    // ground.velocityY= (6 + 3 * score / 100);
    spawnObstacles();
    spawncars();

    // if (ground.y < 0) {
    //   ground.y= ground.height / 2;
    // }
  } else if (gameState === END) {
    background(150)
   ground.destroy();
   robot.addImage(robo)
    gameOver = createSprite(width/2,robot.y-100);
    gameOver.addImage(gameOverImg);
  
    restart = createSprite(width/2, robot.y-50);
    restart.addImage(restartImg);

    gameOver.visible = true;
    restart.visible = true;
    //set velcity of each game object to 0
    // ground.velocityY= 0;
    robot.velocityX = 0;

    if (mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
  textSize(30)
  fill("white")
  text("Score: " + score, camera.position.x + 250, camera.position.y - 350);

}
function reset() {

  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  if (localStorage["HighestScore"] < score) {
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);

  score = 0;
robot.x=width/2;
robot.y=180;
for (var i = 0; i < obstaclesGroup.length; i++) {
 
    
    obstaclesGroup[i].destroy();
}
for (var i = 0; i < carGroup.length; i++) {
  carGroup[i].destroy();
}

}
function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(0, 0, 10, 40);
    //obstacle.debug = true;
    // obstacle.velocityX = -(6 + 3*score/100);
    obstacle.x = Math.round(random(50, width - 50))
    obstacle.y = robot.y - 300;
    //generate random obstacles
    var rand = Math.round(random(1, 4));
    switch (rand) {
      case 1: obstacle.addImage(waste1);
        break;
      case 2: obstacle.addImage(waste2);
        break;
      case 3: obstacle.addImage(waste3);
        break;
      case 4: obstacle.addImage(waste4);

      default: break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 1000;
    //add each obstacle to the group
    obstaclesGroup.push(obstacle);

  }
}
function spawncars() {
  if (frameCount % 60 === 0) {
    var cars = createSprite(0, 0, 10, 40);
    //obstacle.debug = true;
    // obstacle.velocityX = -(6 + 3*score/100);
    cars.y = robot.y - displayHeight;
    cars.x = Math.round(random(50, width - 50))
    cars.velocityY = 10;
    //generate random obstacles
    var rand = Math.round(random(1, 4));
    switch (rand) {
      case 1: cars.addImage(c1);
        break;
      case 2: cars.addImage(c2);
        break;
      case 3: cars.addImage(c3);
        break;
      case 4: cars.addImage(c4);

      default: break;
    }

    //assign scale and lifetime to the obstacle           
    cars.scale = 1.0;
    cars.lifetime = 1000;
    //add each obstacle to the group
    carGroup.push(cars);

  }
}
