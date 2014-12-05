window.onload = function() {
  var width = 960;
  var height = 480;
  var world = {
    width: width * 2,
    height: height
  };
  
  var DEBUG = true;

  var game = new Phaser.Game(
    width,
    height,
    Phaser.AUTO,
    "", {
      preload: preload,
      create: create,
      update: update
    }
  );

  var dog;
  
  var drag;
  var bitmap;
  
  var center = {
    x: function() { return game.world.centerX; },
    y: function() { return game.world.centerY; },
  };

  function preload() {
    game.time.advancedTiming = true;
    game.load.image("dog", "img/dog_32.png");
  }

  function create() {
    game.world.setBounds(0, 0, world.width, world.height - 100);
    game.stage.backgroundColor = "#6495ed";
    game.input.onDown.add(grab, this);
    game.input.onUp.add(release, this);
    game.physics.startSystem(Phaser.Physics.P2JS);

    bitmap = game.add.bitmapData(world.width, world.height);
    game.add.sprite(0, 0, bitmap);
    
    dog = game.add.sprite(center.x() / 2, center.y(), "dog");
    dog.inputEnabled = true;
    game.physics.p2.enable(dog);
  }

  function update() {
    drawLine();
    debug();
    if (!drag) {
      return;
    }
    if (drag.target) {
      drag.target.body.x = game.input.x - drag.offset.x;
      drag.target.body.y = game.input.y - drag.offset.y;
    } else {
      game.camera.x = drag.position.x + drag.camera.x - game.input.x;
      game.camera.y = drag.position.y + drag.camera.y - game.input.y;
    }
  }
  
  function grab() {
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
    if (dog.input.pointerOver()) {
      game.physics.p2.gravity.y = 800;
      drag.target = dog;
      drag.offset = {
        x: Math.round(drag.position.x - dog.body.x),
        y: Math.round(drag.position.y - dog.body.y),
      }
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
  }
  
  function debug() {
    if (DEBUG) {
      game.debug.text("Angry Dogs", 20, 30);
      game.debug.text("FPS: " + game.time.fps, 20, 50);
      game.debug.cameraInfo(game.camera, 20, 80);
    }
  }
};
