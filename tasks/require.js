/*

Builds a source package, starting from src/js/main.js

*/

var async = require("async");
var path = require("path");
var r = require("requirejs");
var project = require("../project.json");

module.exports = function(grunt) {

  grunt.registerTask("amd", "Compile AMD modules to build/main.js", function() {
    
    //less must be pre-compiled first, because the optimizer is sync-only
    grunt.task.requires("less");
    
    var done = this.async();

    //set name, out for each seed file
    var components = grunt.file.expand({filter: "isDirectory", cwd: "src" }, ["*", "!amd", "!lib"]);
    var files = components.map(function(d) { return d + "/" + d + ".js" });
    var packages = [];
    files.forEach(function(src) {
      //one for each configuration
      packages.push({ src: src, dev: true });
      packages.push({ src: src, dev: false });
    });

    async.each(packages, function(package, c) {
      var extension = path.extname(package.src);
      var basename = path.basename(package.src);
      var module = package.src.replace(extension, "");
      var output = "build/" + basename;
      
      if (!package.dev) {
        output = output.replace(extension, ".min" + extension);
      }

      var config = {
        name: module,
        out: output,
        baseUrl: "src",
        deps: ["amd/define"],
        generateSourceMaps: package.dev ? true : false,
        preserveLicenseComments: false,
        optimize: package.dev ? "none" : "uglify2",
        stubModules: ["amd/text", "amd/less", "amd/template"]
      };

      for (var key in project.require) {
        config[key] = project.require[key];
      }

      r.optimize(config, function() { 
        console.log("Wrote %s", config.out);
        c()
      }, function(err) {
        if (err) console.error(err);
        c(err);
      });
    }, function(err) {
      if (err) console.log(err);
      done();
    });

  });

};
