//Create variables here
var dog, happyDog, database, foodS, foodStock, dogImg, dogImg1;
var feed, addFood, fedTime, lastFed;
var foodObj; 

function preload()
{
	//load images here
  dogImg = loadImage('images/dogImg.png');
  dogImg1 = loadImage('images/dogImg1.png');
}

function setup() {
	
  database = firebase.database();

  createCanvas(800, 700);
  foodObj =  new Food();

  dog = createSprite(250,300,100,100);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  foodStock = database.ref('Food');
  foodStock.on('value', readStock);
  textSize(20);

  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  
}


function draw() {  
  background(46,139,87);

  foodObj.display();

  if(lastFed >= 12){
    text('Last Feed : '+LastFed%12 + " PM", 350,30)
  } else if (lastFed == 0){
    text('Last Feed : 12 AM', 350,30)
  }else{
    text("Last Feed : "+ lastFed + " AM", 350,30)
  }

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  drawSprites();
  fill(255);
  stroke('black');
  text('Food Remaining:'+ foodS, 170, 200);
  textSize(30);
  text("Note: Press UP_Arrow Key to Feed Drago Milk!", 20,50);
  textSize(15);
  //add styles here

}

function readStock(data){
  foodS = data.val();
}

function writeStock(x){
  if(x <= 0){
    x = 0;
  }else{
    x = x - 1;
  }
  database.ref('/').update({
    Food : x
  });
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food : foodS
  })
}