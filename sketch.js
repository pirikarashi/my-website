function preload() {
  sounds.kill.push(loadSound("./sounds/killsound_02_1kill.mp3"));
  sounds.kill.push(loadSound("./sounds/killsound_02_2kill.mp3"));
  sounds.kill.push(loadSound("./sounds/killsound_02_3kill.mp3"));
  sounds.kill.push(loadSound("./sounds/killsound_02_4kill.mp3"));
  sounds.kill.push(loadSound("./sounds/killsound_02_5kill_ACE.mp3"));
}

class Button {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
  }

  display() {
    this.x = width / 2 - 150;
    fill(255, 255, 255, 0);
    noStroke();
    rect(this.x, this.y, 300, 100, 10);

    fill(0);
    textSize(60); // テキストサイズを32に設定
    textFont("Arial");
    textAlign(CENTER, CENTER); // テキストの位置を四角の中心に設定
    text(this.text, width / 2, this.y + 50); // (x, y) でテキストを描画
  }
}

class Bot {
  constructor() {
    this.deltaX = 0;
    this.place = [
      null,
      [width / 6 + (width * 0.1 - boxSize) / 2, 200],
      [width / 2 - 75 / 2, 400],
      [(width * 5) / 6 - (width * 0.1 + boxSize) / 2, 600],
    ];

    this.x = this.place[Math.floor(Math.random() * 3) + 1][0];
    this.y = this.place[Math.floor(Math.random() * 3) + 1][1];
    this.vector = Math.floor(Math.random() * 2);
  }

  update() {
    if (this.deltaX < 100 && this.vector === 1) {
      this.deltaX += 6;
      this.x += 6;
    } else if (this.deltaX > -100 && this.vector === 0) {
      this.deltaX -= 6;
      this.x -= 6;
    }
  }

  display() {
    switch (totalACE) {
      case 0:
        fill(0, 230, 0); // 点の色
        break;
      case 1:
        fill(230, 0, 230); // 点の色
        break;
      case 2:
        fill(230, 0, 0); // 点の色
        break;
      default:
        fill(0, 230, 0);
    }

    rect(this.x, this.y, boxSize); // 点を描画
  }
}

class Wall {
  constructor(x) {
    this.x = x;
  }

  update(x) {
    this.x = x;
  }

  display() {
    fill(80, 80, 80); // 点の色
    rect(this.x, 100, width * 0.1, 600, 10);
  }
}

let sounds = {
  kill: [null],
  rifleShotSound: null,
};

let killCount = 0;
let totalACE = 0;
let killSound;
let boxSize = 75;
let currentScene = 0;
let alpha = 0;
let isAlphaCon = false;

let startTime = 0;
let elapsedTime = 0;
let clearTime = 0;

let button_start;
let wall1, wall2, wall3, bot;

function setup() {
  createCanvas(windowWidth, windowHeight);
  button_start = new Button(width / 2 - 150, 600, "START");
  wall1 = new Wall(width / 6);
  wall2 = new Wall(width / 2 - (width * 0.1) / 2);
  wall3 = new Wall((width * 5) / 6 - width * 0.1);

  bot = new Bot();
}

function draw() {
  background(255);
  if (currentScene === 0) {
    if (alpha <= 0) {
      isAlphaCon = true;
    } else if (alpha >= 255) {
      isAlphaCon = false;
    }
    if (isAlphaCon) {
      alpha += 2;
    } else {
      alpha -= 2;
    }
    scene1();
  } else if (currentScene === 1) {
    scene2();
  } else if (currentScene === 2) {
    scene3();
  }
}

function scene1() {
  textSize(34);
  textFont("Arial");
  textAlign(CENTER, CENTER); // テキストの位置を四角の中心に設定
  fill(0, 0, 0, alpha);
  textStyle(NORMAL);
  text("[F]でフルスクリーン", width / 2, height - 100); // (x, y) でテキストを描画
  textStyle(BOLD);
  fill(100, 10, 0);
  textSize(180);
  text("F I F   P", width / 2, height / 4); // (x, y) でテキストを描画
  button_start.display();
}

function scene2() {
  bot.update();
  bot.display();

  wall1.update(width / 6);
  wall1.display();

  wall2.update(width / 2 - (width * 0.1) / 2);
  wall2.display();

  wall3.update((width * 5) / 6 - width * 0.1);
  wall3.display();

  elapsedTime = nf((millis() - startTime) / 1000, 1, 2);
  fill(0);
  textSize(60); // テキストサイズを32に設定
  textFont("Arial");
  textAlign(CENTER, CENTER); // テキストの位置を四角の中心に設定
  text(elapsedTime, 100, 50); // (x, y) でテキストを描画

  fill(255, 10, 10);
  noStroke();
  ellipse(mouseX, mouseY, 5, 5);
  cursor("none");
}

function scene3() {
  cursor("default");

  button_start = new Button(width / 2 - 150, 800, "RETRY");
  button_start.display();
  fill(0);
  textSize(300); // テキストサイズを32に設定
  textFont("Arial");
  textAlign(CENTER, CENTER); // テキストの位置を四角の中心に設定
  text(clearTime + "秒", width / 2, height / 2); // (x, y) でテキストを描画
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  if (
    mouseX > bot.x &&
    mouseX < bot.x + boxSize &&
    mouseY > bot.y &&
    mouseY < bot.y + boxSize
  ) {
    bot = new Bot();
    killCount = (killCount + 1) % 6;
    if (killCount === 0) {
      killCount = 1;
    }
    if (killCount === 5) {
      totalACE++;
    }
    sounds.kill[killCount].play();
  } else {
    killCount = 0;
    totalACE = 0;
  }

  if (
    mouseX > button_start.x &&
    mouseX < button_start.x + 300 &&
    mouseY > button_start.y &&
    mouseY < button_start.y + 100
  ) {
    button_start = new Button(-1000, -1000);
    startTime = millis();
    if (currentScene === 0) {
      currentScene = 1;
    } else if (currentScene === 2) {
      currentScene = 0;
      button_start = new Button(width / 2 - 150, 600, "START");
      bot = new Bot();
    }
  }

  if (killCount === 5 && totalACE === 3) {
    killCount = 0;
    totalACE = 0;
    currentScene = 2;
    clearTime = elapsedTime;
    background(255);
  }
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    currentScene = 0;
    button_start = new Button(width / 2 - 150, 600, "START");
    bot = new Bot();
    cursor("default");
  }
  if (key === "f" || key === "F") {
    let fs = fullscreen(); // 現在のフルスクリーン状態を取得
    fullscreen(!fs);
    button_start = new Button(width / 2 - 150, 600, "START");
    bot = new Bot();
  }
}
