var express = require("express");

var PORT = 8080;
var app = express()
  .use(express.static("."))
  .listen(PORT);

console.log("");
console.log("Now running on http://localhost:" + PORT + "/");
console.log("Press ctrl-c to stop");
console.log("");
 
