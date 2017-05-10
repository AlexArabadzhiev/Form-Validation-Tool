var fs = require('fs');
var files = fs.readdirSync('./plugins/');
var errorLogger = require('./errorLogger');

module.exports = {

	pluginArray: [],

	getPlugins: function () {
		files.forEach(file => {
			this.pluginArray.push(require('./plugins/' + file));
		});
	},

	executePlugins: function () {
		errorLogger.clearFile();
		errorLogger.logMessage('Validations Started \r\n');
		for (var i = 0; i < this.pluginArray.length; i++) {
			this.pluginArray[i].execute();
		}
	}

};