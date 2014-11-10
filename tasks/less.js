/*

Run the LESS compiler against seed.less and output to style.css.

*/

module.exports = function(grunt) {

  var fs = require("fs");
  var less = require("less");
  var async = require("async");
  
  var options = {
    paths: ["src/css"],
    filename: "seed.less"
  };
  
  grunt.registerTask("less", function() {
    
    var done = this.async();
    
    var componentLess = grunt.file.expandMapping("**/*.less", "temp", { cwd: "src" });
    async.each(componentLess, function(mapping, c) {
      var file = mapping.src.pop();
      var css = grunt.file.read(file);
      less.render(css, function(err, result) {
        if (err) return c(err);
        grunt.file.write(mapping.dest, result.css);
        c();
      })
    }, function(err) {
      if (err) console.error(err);
      done();
    });
    
  });

};