var fs = require('fs');
var async = require('async');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var errorLogger = require('../errorLogger');
var content = require('../contentManager');

module.exports = {
	name: "Valid ID Check",

	execute: function() {

		var items = content.items;
		var errCounter = 0;
		var checkName = this.name;
		var errors = [];
		var countItems = 0;


		var walkItems = function(item) {
			JSDOM.fromFile(item, null).then(dom => {
				var doc = dom.window.document;
				var tags = doc.querySelectorAll('responseDeclaration');
				async.each(tags, function(tag, callback){
					if (tag.getAttribute('identifier')) {
						var id = tag.getAttribute('identifier');
						re = /^\D+[\w\-\:\.]*$/;
    					if (!re.test(id)) {
    						var err = {
								errorType: 'This item has Response Declaration TAG with an ID that is not a valid HTML5 ID',
								itemName: item,
								id: id
							};
							errors.push(err);
							errCounter++;
    					}
					}
				});
			}).then(function(){
				countItems++;
				if (countItems == items.length) {
					errorLogger.logCheckEnded(checkName, errCounter, errors);
				} else {
					walkItems(items[countItems]);
				}
			});
		};

		walkItems(items[countItems]);
	}
};