var rob_walking;
var rob_picking;
var rob_stopped;
var robot;
var ground, groundImage;
var waste1, waste2, waste3, waste4;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score = 0;
var obstaclesGroup;
var carGroup;
var gameOver, restart;
var c1, c2, c3, c4;
var battery=100;
var b1,b2,b3,b4;
var energy;
var rechargeImg,rechargeGroup;

function preload() {
  rob_walking = loadAnimation("images/robwalking.png", "images/rob2.png", "images/rob3.png");
  rob_picking = loadAnimation("images/robwalking.png", "images/rob picking2.png", "images/rob picking3.png")
  rob_stopped =loadAnimation("images/roboO.png")

  waste1 = loadImage("images/waste1.png")
  waste2 = loadImage("images/waste2.png")
  waste3 = loadImage("images/waste3.png")
  waste4 = loadImage("images/plastic1.png")

  c1 = loadImage("images/car1.png")
  c2 = loadImage("images/car2.png")
  c3 = loadImage("images/car3.png")
  c4 = loadImage("images/car4.png")

  b1=loadImage("images/full.png");
  b2=loadImage("images/battery3.png")
  b3=loadImage("images/battery2.png");
  b4=loadImage("images/lessbattery.png")
  rechargeImg=loadImage("images/recharge.png")
  
  groundImage = loadImage("images/track.jpg");
  restartImg = loadImage("images/restart.png");
  gameOverImg = loadImage("images/gameOver.png");
}
function setup() {
  createCanvas(800, 600);

fill ("white")
  ground = createSprite(width / 2, -height * 4, width, height * 5);
  ground.addImage("ground", groundImage);
  // ground.y = ground.height / 2;
  // ground.velocityY = (6 + 3 * score / 100);
  robot = createSprite(width / 2, 180, 20, 50);
  robot.addAnimation("walking", rob_walking);
  robot.addAnimation("picking", rob_picking);
  robot.addAnimation("stopped",rob_stopped)
  robot.scale = 0.6

  energy=createSprite(100,100);
  energy.scale=0.2;

  score = 0;
  obstaclesGroup = []
  carGroup = []
  rechargeGroup=new Group ();
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
    if(frameCount%300===0){
      battery=battery-15;
    }
    energy.y=robot.y-50;
    energy.x=robot.x+50;
    if(battery>=75){
      energy.addImage(b1)
    }
    if(battery>=50&&battery<75){
      energy.addImage(b2)
    }
    if(battery>=25&&battery<50){
      energy.addImage(b3)
    }
    if(battery<25){
      energy.addImage(b4)
    }
    if(robot.isTouching(rechargeGroup)){
      battery=max(100,battery+25);
      rechargeGroup.destroyEach();
    }
   robot.changeAnimation("walking",rob_walking);
    ground.y=-displayHeight*4;
    for (var i = 0; i < obstaclesGroup.length; i++) {
      if (robot.isTouching(obstaclesGroup[i])) {
        score = score + 5;
        fill("white")
 

        obstaclesGroup[i].destroy();
      }
    }
    for (var i = 0; i < obstaclesGroup.length; i++) {
      if (robot.y-100<=obstaclesGroup[i].y) {
        score = min(0,score - 5);
        obstaclesGroup[i].destroy();
        fill("red");
 

      }
    }
    // for (var i = 0; i < carGroup.length; i++) {
    //   if (battery<=0||robot.isTouching(carGroup[i])) {
    //     carGroup[i].velocityY=0;
    //     gameState=END;
    //     gameOver = createSprite(width/2,robot.y-100);
    //     gameOver.addImage(gameOverImg);
    //     gameOver.scale=0.5;
      
    //     restart = createSprite(width/2, robot.y-50);
    //     restart.addImage(restartImg);
  
    //   }
    // }
    camera.position.y = robot.position.y;
    camera.position.x = width / 2;

    // ground.velocityY= (6 + 3 * score / 100);
    spawnObstacles();
    spawncars();
    spawnrecharge();
    // if (ground.y < 0) {
    //   ground.y= ground.height / 2;
    // }
  } else if (gameState === END) {
    background(150)
   ground.velocityY=0;
  robot.changeAnimation("stopped",rob_stopped);
    gameOver.visible = true;
    restart.visible = true;
    //set velcity of each game object to 0
    // ground.velocityY= 0;
    robot.velocityX = 0;

    fill("yellow")
    
  
    if (mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
  textSize(30)
  text("Score: " + score, camera.position.x + 250, camera.position.y - 250);
}
function reset() {

  gameState = PLAY;
  ground.visible=true;
  gameOver.visible = false;
  restart.visible = false;
  gameOver.destroy();
  restart.destroy();
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
function spawnrecharge() {
  if (frameCount % 750 === 0) {
    var recharge = createSprite(0, 0, 10, 40);
    //obstacle.debug = true;
    // obstacle.velocityX = -(6 + 3*score/100);
    recharge.x = Math.round(random(50, width - 50))
    recharge.y = robot.y - 300;
    recharge.addImage(rechargeImg);
    
   

    //assign scale and lifetime to the obstacle           
    recharge.scale = 0.2;
    recharge.lifetime = 1000;
    //add each obstacle to the group
    rechargeGroup.add(recharge);

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
