module.exports = function (grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    jslint: { 
      app: {
        src: [ 
          'lib/check-coverage.js'
        ],
        directives: { // example directives
          node: true
        },
        options: {
          shebang: true
        }
      }
    },
    watch: {
      css: {
        files: 'lib/check-coverage.js',
        tasks: ['jslint']
      },
    }
  });

  grunt.registerTask('default', 'jslint');
  grunt.registerTask('dev', ['jslint', 'watch']);
};