var dot = require("dot");
var path = require("path");
var through = require("through2");

var extensions = [".html", ".txt"];

dot.templateSettings.varname = "data";
dot.templateSettings.selfcontained = true;

module.exports = function(file) {

  if (extensions.indexOf(path.extname(file)) > -1) {
    var buffer = [];
    return through(function(chunk, enc, done) {
      buffer.push(chunk.toString());
      done();
    }, function(done) {
      var text = buffer.join("");
      buffer = [];

      var template = dot.compile(text);

      this.push("module.exports = " + template.toString());
      this.push(null);
      done();
    });
  }

  return through();

};