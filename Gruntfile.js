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
		}
	});
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-react');
	grunt.registerTask('run', ['browserify']);

};