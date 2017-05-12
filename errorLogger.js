var fs = require('fs');

module.exports = {

	clearFile: function () {
		fs.writeFileSync('./errors.txt', '');
	},

	logError: function (log) {
		for (var i = 0; i < log.length; i++) {
			fs.appendFileSync('./errors.txt', JSON.stringify(log[i], null, " ") + '\r\n');
			console.log(JSON.stringify(log[i], null, 4));
			fs.appendFileSync('./errors.txt', '\r\n');
		}		
	},

	logCheckEnded: function (checkName, errCounter, errors) {
		this.logMessage(checkName + " ended:");
		this.logMessage(errCounter + ' errors found');
		if (errors.length > 0){
            this.logError(errors);
        }
        this.logMessage(" ");
	},

	logMessage: function (message) {		
		fs.appendFileSync('./errors.txt', message + '\r\n');
		console.log(message);
	}
};