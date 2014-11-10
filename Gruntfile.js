module.exports = function(grunt) {

  //load tasks
  grunt.loadTasks("./tasks");

  grunt.registerTask("default", ["bundle", "build", "connect", "watch"]);
};
