var fs = require('fs');
var content = require('./contentManager');

var pluginManager = require('./pluginManager');

(function app() {
	content.loadContent();
	pluginManager.getPlugins();
	pluginManager.executePlugins();
})();