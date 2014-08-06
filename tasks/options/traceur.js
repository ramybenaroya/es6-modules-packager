// var fs = require('fs'),
//     files = {};
// fs.readdirSync('./app/root/modules').filter(function (file) {
//     return fs.statSync('./app/root/modules/' + file).isDirectory();
// }).forEach(function (file) {
//     files['dist/' + file + '.amd.js'] = ['tmp/' + file + '.amd.js'];
// });



module.exports = function (grunt) {
    var modules = grunt.file.readJSON('modules.json'),
        files = {};
    modules.forEach(function (module) {
        files['dist/' + module.name + '.amd.js'] = ['tmp/' + module.name + '.amd.js'];
    });
    return {
        amd: {
            files: files,
        },
        options : {
        	sourceMaps:true
        }
    };
}