var fs = require('fs');
var errorLogger = require('./errorLogger');
var walker = require('./fileWalker');

var contentPath = "../../Content/tennessee/";

module.exports = {

	contentPath: contentPath,
	formsPath: contentPath + 'Forms/',
	itemsPath: contentPath + 'Items/',
	forms: [],
	items: [],

	loadContent: function () {
		this.forms = fs.readdirSync(contentPath + '/Forms');
		this.items = walker.walk(contentPath + '/Items');
	},

};