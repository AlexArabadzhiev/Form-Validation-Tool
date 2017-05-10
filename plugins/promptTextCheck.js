var fs = require('fs');
var path = require('path');
var async = require('async');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var errorLogger = require('../errorLogger');
var walker = require('../fileWalker');

module.exports = {
	name: "Prompt Tag Check",

	execute: function() {

		var items = walker.walk('./content/Items');
		var count = 0;
		var errCounter = 0;
		var checkName = this.name;
		var errors = [];

        async.each(items, function(item, callback){
        	JSDOM.fromFile(item, null).then(dom => {
	        	var doc = dom.window.document;
                var prompts = doc.querySelectorAll('prompt-text');
                async.each(prompts, function(tag, callback){
	                if (tag.textContent.trim() == ''){
	                    var err = {
	                        errorType: 'Empty Prompt Text tag',
	                        file: item
	                    };
	                    errors.push(err);
	                    errCounter++;
	                }
	        	});
	        }).then(function(){
	        	count++;
	        	if (count == items.length){
	        		errorLogger.logMessage(checkName + " ended:");
	        		errorLogger.logMessage(errCounter + ' errors found');
	        		if (errors.length > 0){
                        errorLogger.logError(errors);
                    }
	        	}
	        });
	    });
	}
};