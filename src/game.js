var WIDTH = 960;
var HEIGHT = 480;

var world = {
  width: WIDTH * 2,
  height: HEIGHT - 100,
};

window.onload = function() {
  var game = new Phaser.Game(
    WIDTH,
    HEIGHT,
    Phaser.AUTO,
    "", {
      preload: preload,
      create: create,
      update: update
    }
  );
  
  var slingshot = {
    x: 300,
    y: 300,
  };  

  var DEBUG = true;

  var dog;
  var dogs = [];
  
  var bitmap;
  var cursors;
  var drag;
  
  function preload() {
    game.time.advancedTiming = true;
    game.load.image("dog", "img/dog.png");
    game.load.image("block", "img/block.png");
    game.load.image("block_long", "img/block_long.png");
  }

  function create() {
    game.world.setBounds(0, 0, world.width, world.height);
    game.stage.backgroundColor = "#6495ed";
    game.input.onDown.add(grab, this);
    game.input.onUp.add(release, this);
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 800;

    cursors = game.input.keyboard.createCursorKeys();
    bitmap = game.add.bitmapData(world.width, HEIGHT);
    game.add.sprite(0, 0, bitmap);
    
    var x = 0;
    var y = 0;
    for (var i = 0; i < 4; i++) {
      var dog = game.add.sprite(slingshot.x - i * 40 - 100, slingshot.y + 48, "dog");
      dog.anchor = new PIXI.Point(.5, .5);
      dogs.push(dog);
    }
    
    Map.load(game, 0);
    reload();
  }

  function update() {
    if (DEBUG) {
      debug();
    }
    drawLine();
    moveCamera();
    if (!drag) {
      return;
    }
    if (drag.target) {
      drag.target.body.velocity.y = 0;
      drag.target.body.x = game.input.x - drag.offset.x;
      drag.target.body.y = game.input.y - drag.offset.y;
    } else {
      game.camera.x = drag.position.x + drag.camera.x - game.input.x;
      game.camera.y = drag.position.y + drag.camera.y - game.input.y;
    }
  }
  
  function grab() {
    game.camera.unfollow();
    drag = {
      position: {
        x: game.input.x,
        y: game.input.y,
      },
      camera: {
        x: game.camera.x,
        y: game.camera.y,
      }
    };
    if (dog && dog.input.pointerOver()) {
      game.physics.p2.enable(dog);
      drag.target = dog;
      drag.offset = {
        x: Math.round(drag.position.x - dog.body.x),
        y: Math.round(drag.position.y - dog.body.y),
      };
    }
  }
  
  function release() {
    if (drag.target) {
      fire();
    }
    drag = null;
  }
  
  function drawLine() {
    bitmap.clear();
    if (drag) {
      if (drag.target) {
        bitmap.ctx.beginPath();
        bitmap.ctx.moveTo(dog.body.x, dog.body.y);
        bitmap.ctx.lineTo(
          drag.position.x + drag.camera.x,
          drag.position.y + drag.camera.y
        );
        bitmap.ctx.lineWidth = Math.max(10 - Math.floor(getDragDistance() / 20), 4);
        bitmap.ctx.strokeStyle = "white";
        bitmap.ctx.stroke();
        bitmap.ctx.closePath();
        bitmap.render();
      }
    }
  }
  
  function getDragDistance() {
    return Phaser.Math.distance(
      game.input.x,
      game.input.y,
      drag.position.x,
      drag.position.y
    );
  }
  
  function fire() {
    var speed = 800;
    var x = (drag.position.x + drag.camera.x - dog.body.x) / 100;
    var y = (drag.position.y + drag.camera.y - dog.body.y) / 100;
    dog.body.velocity.x = speed * x;
    dog.body.velocity.y = speed * y;
    dog.body.angularVelocity = 5;
    dog.inputEnabled = false;
    game.camera.follow(dog, Phaser.Camera.FOLLOW_PLATFORMER);
    reload();
  }
  
  function reload() {
    dog = dogs.pop();
    if (dog) {
      dog.inputEnabled = true;
      dog.x = slingshot.x;
      dog.y = slingshot.y;
    }
  }
  
  function moveCamera() {
    if (cursors.left.isDown) {
      game.camera.x -= 10;
    } else if (cursors.right.isDown) {
      game.camera.x += 10;
    }
  }
  
  function debug() {
    game.debug.text("Angry Dogs", 20, 30);
    game.debug.text("FPS: " + game.time.fps, 20, 50);
    game.debug.cameraInfo(game.camera, 20, 80);
  }
};
