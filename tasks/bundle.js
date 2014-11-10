/*

Builds a source package for all components located in this package

*/

var async = require("async");
var browserify = require("browserify");
var exorcist = require("exorcist");
var fs = require("fs");
var path = require("path");

module.exports = function(grunt) {

  grunt.registerTask("bundle", "Compile build/app.js using Browserify", function() {
    var done = this.async();

    //set name, out for each seed file
    var components = grunt.file.expand({filter: "isDirectory", cwd: "src" }, ["*", "!lib"]);
    var files = components.map(function(d) { return path.join(d, d) });
    files.filter(function(f) { grunt.file.exists(f) });

    grunt.file.mkdir("build");

    async.each(files, function(file, c) {
      var output = "build/" + path.basename(file) + ".js";

      var outStream = fs.createWriteStream(output);

      var b = browserify({ debug: true });

      b.add("./src/" + file);
      b.bundle().pipe(exorcist(output + ".map")).pipe(outStream).on("finish", function() {
        c();
      });

    }, function(err) {
      if (err) console.log(err);
      done();
    });

  });

};
