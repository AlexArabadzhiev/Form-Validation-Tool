var fs = require('fs');
var files = fs.readdirSync('./plugins/');
var errorLogger = require('./errorLogger');

module.exports = {

	pluginArray: [],

	chosenPlugins: {
		"Prompt Tag Check": true,
		"Resourse Check": true,
		"TTS Tag Check": true,
		"Unique ID Check": true,
		"Valid ID Check": true
	},

	getPlugins: function () {
		files.forEach(file => {
			this.pluginArray.push(require('./plugins/' + file));
		});
	},

	executePlugins: function () {
		errorLogger.clearFile();
		errorLogger.logMessage('Validations Started \r\n');
		for (var i = 0; i < this.pluginArray.length; i++) {
			var plugName = this.pluginArray[i].name;
			var shouldExec = this.chosenPlugins[plugName];
			if (shouldExec) {
				this.pluginArray[i].execute();
			}
		}
	}

};