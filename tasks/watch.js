/*

Standard configuration from grunt-contrib-watch:
- Compile LESS when source files change
- Compile page template when index.html changes
- Compile JSON data when CSVs change
- (optional) Run optimizer on AMD modules when JS files change

*/

module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.config.merge({
    watch: {
      options: {
        livereload: true
      },
      templates: {
        files: ["src/**/*.html"], //test files for local development
        tasks: ["build"]
      },
      js: {
        files: ["src/**/*"], //everything, due to templating, GLSL, LESS, etc.
        tasks: ["bundle"]
      }
    }
  });

};
