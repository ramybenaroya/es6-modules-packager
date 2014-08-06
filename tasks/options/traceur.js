// var fs = require('fs'),
//     files = {};
// fs.readdirSync('./app/root/modules').filter(function (file) {
//     return fs.statSync('./app/root/modules/' + file).isDirectory();
// }).forEach(function (file) {
//     files['dist/' + file + '.js'] = ['tmp/' + file + '.js'];
// });



module.exports = function (grunt) {
    var modules = grunt.file.readJSON('modules.json'),
        files = {};
    modules.forEach(function (module) {
        files['dist/' + module.name + '.js'] = ['tmp/' + module.name + '.js'];
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