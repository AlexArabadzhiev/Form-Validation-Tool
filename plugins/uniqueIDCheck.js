var fs = require('fs');
var async = require('async');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var errorLogger = require('../errorLogger');
var content = require('../contentManager');

module.exports = {
	name: "Unique ID Check",

	execute: function() {

		var forms = content.forms;
		var errCounter = 0;
		var checkName = this.name;
		var errors = [];
		var countManifest = 0;
		var countForm = 0;

		var formResponseDeclarationIdArray = [];

		var walkForms = function(form) {
			var manifestPath = content.formsPath + form + '/imsmanifest.xml';
			var currResources = [];
			JSDOM.fromFile(manifestPath, null).then(dom => {
				var doc = dom.window.document;
				var resources = doc.querySelectorAll('resource');
				async.each(resources, function(item, callback){
					if (item.getAttribute('type') == 'imsqti_item_xmlv2p0') {
						currResources.push(content.itemsPath + item.getAttribute('href'));
					}
				});
			}).then(function(){
				if(currResources.length > 0) {
					var formObject = {
						name: form,
						resources: currResources
					};
					formResponseDeclarationIdArray.push(formObject);
				}
				countManifest++;
				if (countManifest == forms.length) {
					walkForm(formResponseDeclarationIdArray[0]);
				} else {
					walkForms(forms[countManifest]);
				}
			});
		};

		var walkForm = function(form) {
			return new Promise((resolve, reject) => {
				resolve(form);
			}).then((item) => {
				countForm++;
				if(countForm == formResponseDeclarationIdArray.length){
					errorLogger.logCheckEnded(checkName, errCounter, errors);
				} else {
					idCheck(form);
				}
			});
		};

		var idCheck = function(form) {
			var formName = form.name;
			var arr = form.resources;
			var idArray = [];
			var countItems = 0;
			var hasErrors = false;
			return new Promise ((resolve, reject) => {
				async.each(arr, function(item, callback) {
					JSDOM.fromFile(item, null).then(dom => {
					var doc = dom.window.document;
					var responseDeclarationTag = doc.querySelector('responseDeclaration');
						if (responseDeclarationTag) {
							var responseDeclarationTagId = responseDeclarationTag.getAttribute('identifier');
							isIdUnique = idArray.indexOf(responseDeclarationTagId) > -1;
							if (isIdUnique) {
								hasErrors = true;
							}
							idArray.push(responseDeclarationTagId);
						}
					}).then(function(){
						countItems++;
						if (countItems == arr.length){
							if (hasErrors){
								var err = {
									errorType: 'This form has items which IDs are not unique',
									formName: formName,
									idArray: idArray
								};
								errors.push(err);
								errCounter++;
							}
							walkForm(formResponseDeclarationIdArray[countForm]);
						}
					});
				});
			});
		};

		walkForms(forms[countManifest]);
	}
};