(function() {
  var Map = window.Map = {};
  Map.load = load;
  
  var offset = {
    x: 720,
    y: world.height
  };
  
  var maps = [[
  // sprite,  x,   y,   angle
    ["block", 32, -94,  0 ],
    ["block", 0,  -42,  90],
    ["block", 64, -42,  90],
    ["block", 32, -146, 90],
    ["block", 32, -198, 0 ],
  ]];
  
  function load(game, level) {
    var map = maps[level];
    for (var i = 0; i < map.length; i++) {
      var row = map[i];
      var sprite = game.add.sprite(offset.x + row[1], offset.y + row[2], row[0]);
      game.physics.p2.enable(sprite);
      sprite.body.angle = row[3];
    }
  }
})();
