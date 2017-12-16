module.exports = function(grunt){

	grunt.initConfig({
		browserify: {
			'../dist/app.js': ['../js/main.js']
		},
		jshint: {
			options: {
				predef: ["document", "console", "d3", "$", "this"],
				esnext: true,
				globalstrict: true,
				globals: {"$": true},
				browserify: true
			},
			files: ['../js/**/*.js']
		},
		watch: {
			javascripts: {
				files: ['../js/**/*.js'],
				tasks: ['jshint', 'browserify']
			},
			browserify: {
				files: ['../js/*.js'],
				tasks: ["browserify"]
			}
		}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	grunt.registerTask('default', ['jshint', 'browserify', 'watch']);

};