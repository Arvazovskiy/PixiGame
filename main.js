let robot;
let isRobotLeft = false;

let fireball;
let keyRight;
let keyLeft;

const scaleX = 0.2
const scaleY = 0.2;

function init() {
    let type = "WebGL"
    if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
    }

    PIXI.utils.sayHello(type)

    //Create a Pixi Application
    app = new PIXI.Application({width: 512, height: 512});

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);
}

function loadSprites() {
    PIXI.loader
        .add("images/robot.png")
        .add("images/fireball.png")
        .load(setupSprites);
}

function setupSprites() {
    robot = new PIXI.Sprite(
      PIXI.loader.resources["images/robot.png"].texture
    );

    fireball = new PIXI.Sprite(
        PIXI.loader.resources["images/fireball.png"].texture
    );

    robot.scale.set(scaleX, scaleY);
    fireball.scale.set(scaleX, scaleY);
    app.stage.addChild(robot);
    // первоначальное положение робота
    robot.x = 200;
    robot.y = 200;
    robot.anchor.x = 0.5;
    robot.anchor.y = 0.5;
    // robot.rotation = 3.14 / 2;
    setupKeyboard();
    app.ticker.add(delta => gameLoop(delta));
   

}
  
function setupKeyboard() {
    keyRight = keyboard("ArrowRight");
    keyRight.press = () => {
        robot.scale.x = scaleX;
        isRobotLeft = false;
        robot.x += 10;
    }

    keyLeft = keyboard("ArrowLeft");
    keyLeft.press = () => {
        robot.scale.x = -scaleX;
        isRobotLeft = true;
        robot.x -= 10;
    }

    keyDown = keyboard("ArrowDown");
    keyDown.press = () => {
        robot.y += 10;
    }

    keyUp = keyboard("ArrowUp");
    keyUp.press = () => {
        robot.y -= 10;
    }

    keySpace = keyboard(" ");
    keySpace.press = () => {
        app.stage.addChild(fireball);
        fireball.x = robot.x;
        fireball.y = robot.y;
        if (isRobotLeft) {
            fireball.vx = -5;
            fireball.scale.x = -scaleX;

        } else {
            fireball.vx = 5;
            fireball.scale.x = scaleX;
        }
    }
}
   

function gameLoop(delta) {
    let step = 3;
    if (keyRight.isDown) {
        robot.x += step;
    }
    if (keyLeft.isDown) {
        robot.x -= step;
    }
    if (keyDown.isDown) {
        robot.y += step;
    }
    if (keyUp.isDown) {
        robot.y -= step;
    }
    if (fireball.renderable) {
        fireball.x += fireball.vx;
    }
//     //Update the cat's velocity
//   robot.vx = !robot.vx ? 1 : robot.vx + 1;
//   robot.vy = !robot.vy ? 1 : robot.vy + 1;

//   //Apply the velocity values to the robot's 
//   //position to make it move
//   robot.x += robot.vx;
//   robot.y += robot.vy;
}

function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
      if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    };
  
    //The `upHandler`
    key.upHandler = event => {
      if (event.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    };
  
    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);
    
    window.addEventListener(
      "keydown", downListener, false
    );
    window.addEventListener(
      "keyup", upListener, false
    );
    
    // Detach event listeners
    key.unsubscribe = () => {
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);
    };
    
    return key;
  }