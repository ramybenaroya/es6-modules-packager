// var fs = require('fs'),
//     files = {};
// fs.readdirSync('./app/root/modules').filter(function (file) {
//     return fs.statSync('./app/root/modules/' + file).isDirectory();
// }).forEach(function (file) {
//     files['tmp/' + file + '.amd.js'] = ['tmp/modules/' + file + '/**/*.amd.js'];
// });

// var modules = grunt.file.readJSON('modules.json');
// var files = {};
// modules.forEach(function(module){
//     var src = [];
//     modules.files.forEach(function(file){
//         src.push('tmp/modules/' + file + '.amd.js');
//     });
//     files['tmp/' + file + '.amd.js'] = src;
// });

module.exports = function(grunt) {

    var modules = grunt.file.readJSON('modules.json'),
        files = {};
    modules.forEach(function(module){
        var src = [];
        module.files.forEach(function(file){
            src.push('tmp/modules/' + file + '.amd.js');
        });
        files['tmp/' + module.name + '.amd.js'] = src;
    });

    return {
        options: {
            sourceMap : true      
        },

        amd: {
            files: files,
        },

        amdNoVersion: {
            src: ['tmp/modules/**/*.amd.js', 'tmp/modules.amd.js'],
            dest: 'tmp/modules.amd.js'
        },

        deps: {
            src: ['vendor/deps/*.js'],
            dest: 'dist/deps.amd.js'
        },

        browser: {
            src: ['app/loader/loader.js', 'tmp/modules/**/*.amd.js', 'tmp/modules.amd.js'],
            dest: 'tmp/modules.browser1.js'
        }
    };   
}