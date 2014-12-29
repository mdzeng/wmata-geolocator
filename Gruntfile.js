/* jshint node:true */
'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		browserify: {
			options: {
				alias: [
					'./views/components/home.jsx:Home',
					'react:react'
				],
				transform: [require('grunt-react').browserify],
				browserifyOptions: {
					debug: true
				}
			},
			client: {
				src: ['views/components/**/*.jsx'],
				dest: 'public/js/built_components.js'
			}
		},

		nodemon: {
			dev: {
				script: 'app.js',
				options: {
					nodeArgs: ['--debug'],
					ignore: ['node_modules/**'],

					callback: function (nodemon) {
						nodemon.on('log', function (event) {
						  console.log(event.colour);
						});

						// opens browser on initial server start
						nodemon.on('config:update', function () {
							// Delay before server listens on port
							setTimeout(function() {
							require('open')('http://localhost:3000');
								//TODO: This may not always be port 3000, maybe config
							}, 1000);
						});

						// refreshes browser when server reboots
						nodemon.on('restart', function () {
							// Delay before server listens on port
							setTimeout(function() {
							}, 1000);
						});
				  }
				}
			}
		},

		watch: {
			client: {
				files: [
					'views/components/**/*.jsx'
				],
				tasks: ['browserify']
			}
		},

		concurrent: {
			target: {
				tasks: ['nodemon:dev', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-react');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('run', ['browserify', 'concurrent']);

};