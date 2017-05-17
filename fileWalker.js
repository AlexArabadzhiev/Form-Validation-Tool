var fs = require('fs');
var path = require('path');
var errorLogger = require('./errorLogger');

var walkSync = function(dir, list) {
		var files = fs.readdirSync(dir);
		var filelist = list || [];
		files.forEach(function(file) {
			if (fs.statSync(path.join(dir, file)).isDirectory()) {
				filelist = walkSync(path.join(dir, file), filelist);
			}
			else {
				filelist.push(path.join(dir, file));
			}
		});

		return filelist;

};

module.exports = {

		walk: function(dir) {
			return walkSync(dir);
		}
};