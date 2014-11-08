/*

Builds a source package, starting from src/js/main.js

*/

var async = require("async");
var path = require("path");
var r = require("requirejs");
var project = require("../project.json");

module.exports = function(grunt) {

  grunt.registerTask("amd", "Compile AMD modules to build/main.js", function(mode) {
    var done = this.async();

    //set name, out for each seed file
    var files = grunt.file.expand(["src/*.js"]);
    var packages = [];
    files.forEach(function(src) {
      //one for each configuration
      packages.push({ src: src, standalone: true });
      packages.push({ src: src, standalone: false });
    });

    async.each(packages, function(package, c) {
      var extension = path.extname(package.src);
      var basename = path.basename(package.src);
      var module = basename.replace(extension, "");
      var output = "build/" + basename;
      var dev = mode == "dev";
      
      if (!dev) {
        output = output.replace(extension, ".min" + extension);
      }
      
      if (package.standalone) {
        output = output.replace(extension, ".amd" + extension);
      }

      var config = {
        name: module,
        out: output,
        baseUrl: "src",
        deps: ["registerElement"],
        generateSourceMaps: dev ? true : false,
        preserveLicenseComments: false,
        optimize: dev ? "none" : "uglify2",
        stubModules: ["text", "less", "template"],
        //move plugins to subdirectory, simplifies builds
        paths: {
          "registerElement": "lib/document-register-element/build/document-register-element",
          "define": "amd/define",
          "less": "amd/less",
          "template": "amd/template",
          "text": "amd/text"
        }
      };
      
      if (!package.standalone) {
        config.deps.unshift("define");
      }

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
