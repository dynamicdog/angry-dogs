window.onload = function() {
  var width = 960;
  var height = 480;

  var game = new Phaser.Game(
    width,
    height,
    Phaser.AUTO,
    "", {
      preload: preload,
      create: create,
      update: update,
    }
  );

  var dog = null;
  var drag = null;
  
  var center = {
    x: function() { return game.world.centerX; },
    y: function() { return game.world.centerY; },
  };

  function preload() {
    game.load.image("dog", "img/dog_32.png");
  }

  function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.stage.backgroundColor = "#6495ed";
    
    game.input.onDown.add(grab, this);
    game.input.onUp.add(release, this);
    
    dog = game.add.sprite(center.x(), center.y(), "dog");
    dog.inputEnabled = true;
    game.physics.p2.enable(dog);
  }

  function update() {
    if (!drag) {
      return;
    }
    if (drag.target) {
      drag.target.body.x = game.input.x - drag.offset.x;
      drag.target.body.y = game.input.y - drag.offset.y;
    } else {
      // ..
    }
  }
  
  function grab() {
    drag = {
      position: {
        x: game.input.x,
        y: game.input.y,
      }
    };
    if (dog.input.pointerOver()) {
      drag.target = dog;
      drag.offset = {
        x: Math.round(drag.position.x - dog.body.x),
        y: Math.round(drag.position.y - dog.body.y),
      }
    }
  }
  
  function release() {
    drag = null;
  }
};
