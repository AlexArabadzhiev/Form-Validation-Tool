var fs = require('fs');
var async = require('async');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var errorLogger = require('../errorLogger');
var content = require('../contentManager');

module.exports = {
	name: "Resourse Check",

	execute: function() {

		var count = 0;
		var errCounter = 0;
		var checkName = this.name;
		var errors = [];
		var forms = content.forms;
		var formsLength = forms.length;

		async.each(forms, function(form, callback){
			var manifestPath = content.formsPath + form + '/imsmanifest.xml';
			JSDOM.fromFile(manifestPath, null).then(dom => {
				var doc = dom.window.document;
				var resources = doc.querySelectorAll('resource');
				async.each(resources, function(item, callback){
					if (item.getAttribute('type') == 'imsqti_item_xmlv2p0') {
						var isHrefCorrect = fs.existsSync(content.itemsPath + item.getAttribute('href'));
						if (!isHrefCorrect){
							var err = {
								errorType: 'Recource missing',
								file: manifestPath,
								identifier: item.getAttribute('identifier')
							};
							errors.push(err);
							errCounter++;
						}
					}
				});
			}).then(function(){
				count++;
				if (count == formsLength){
					errorLogger.logCheckEnded(checkName, errCounter, errors);
				}
			});
		});
	}
};