

module.exports = function(grunt) {

  //load tasks
  grunt.loadTasks("./tasks");

  grunt.registerTask("default", ["amd:dev", "build", "connect", "watch"]);
};
