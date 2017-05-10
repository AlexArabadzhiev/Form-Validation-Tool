var fs = require('fs');

var pluginManager = require('./pluginManager');


(function app() {
	pluginManager.getPlugins();
	pluginManager.executePlugins();
})();