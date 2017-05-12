var fs = require('fs');
var path = require('path');
var async = require('async');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var errorLogger = require('../errorLogger');
var walker = require('../fileWalker');

module.exports = {
	name: "Unique ID Check",

	execute: function() {

		var items = walker.walk('./content/Items');
		var count = 0;
		var errCounter = 0;
		var checkName = this.name;
		var errors = [];
		var idArray = [];

	    var idCheck = function(item) {
	    	var item = item || items[0];
        	JSDOM.fromFile(item, null).then(dom => {
	        	var doc = dom.window.document;
	        	var responseDeclarationTag = doc.querySelector('responseDeclaration');
	        	if (responseDeclarationTag) {
	        		var responseDeclarationTagId = doc.querySelector('responseDeclaration').getAttribute('identifier');
	        		isIdUnique = idArray.indexOf(responseDeclarationTagId) > -1;
	                if (isIdUnique) {
	                    var err = {
	                        errorType: 'ID is not unique',
	                        file: item,
	                        identifier: responseDeclarationTagId
	                    };
	                    errors.push(err);
	                    errCounter++;
		            } else {
		        		idArray.push(responseDeclarationTagId);
		            }
	        	}
	        }).then(function(){
	        	count++;
	        	if (count == items.length){
	        		errorLogger.logCheckEnded(checkName, errCounter, errors);
	        	} else {
	        		idCheck(items[count]);
	        	}
	        });
	    };

	    idCheck();
	}
};