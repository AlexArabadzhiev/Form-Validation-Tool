var fs = require('fs');
var async = require('async');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var errorLogger = require('../errorLogger');
var content = require('../contentManager');

module.exports = {
	name: "Valid ID Check",

	execute: function() {

		var forms = content.forms;
		var items = content.items;
		var errCounter = 0;
		var checkName = this.name;
		var errors = [];
		var countForm = 0;
		var countItems = 0;

		var formResponseDeclarationIdArray = [];

		var walkForms = function(form) {
			var manifestPath = content.formsPath + form + '/imsmanifest.xml';
			JSDOM.fromFile(manifestPath, null).then(dom => {
				var doc = dom.window.document;
				var tags = doc.getElementsByTagName('*');
				async.each(tags, function(tag, callback){
					if (tag.getAttribute('identifier')) {
						var id = tag.getAttribute('identifier') ;
						re = /^[A-Za-z]+[\w\-\:\.]*$/;
    					if (!re.test(id)) {
    						var err = {
								errorType: 'This form has ID that is not a valid ID',
								formName: form,
								tag: tag.getAttribute('identifier')
							};
							errors.push(err);
							errCounter++;
    					}
					}
				});
			}).then(function(){
				countForm++;
				if (countForm == forms.length) {
					errorLogger.logCheckEnded(checkName, errCounter, errors);
					//walkItems(items[countItems]);
				} else {
					walkForms(forms[countForm]);
				}
			});
		};

		var walkItems = function(item) {
			JSDOM.fromFile(item, null).then(dom => {
				var doc = dom.window.document;
				var tags = doc.querySelectorAll('*');
				async.each(tags, function(tag, callback){
					if (tag.getAttribute('identifier')) {
						var id = tag.getAttribute('identifier');
						re = /^[A-Za-z]+[\w\-\:\.]*$/;
    					if (!re.test(id)) {
    						var err = {
								errorType: 'This item has ID that is not a valid ID',
								itemName: item,
								tag: tag.tagname
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

		// NEEDS WORK!!!

		//walkForms(forms[countForm]);
	}
};