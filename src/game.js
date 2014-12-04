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
      update: update
    },
    false,
    false
  );

  var dog = null;
  var center = {
    x: function() { return game.world.centerX; },
    y: function() { return game.world.centerY; }
  };

  function preload() {
    game.load.image("dog", "img/dog_32.png");
  }

  function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.stage.backgroundColor = "#6495ed";
    
    dog = game.add.sprite(center.x(), center.y(), "dog");
    game.physics.p2.enable(dog);
  }

  function update() {
    // ..
  }
};
