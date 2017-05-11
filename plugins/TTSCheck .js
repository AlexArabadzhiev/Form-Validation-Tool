var fs = require('fs');
var path = require('path');
var async = require('async');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var errorLogger = require('../errorLogger');
var walker = require('../fileWalker');

module.exports = {
	name: "TTS Tag Check",

	execute: function() {

		var items = walker.walk('./content/Items');
		var count = 0;
		var errCounter = 0;
		var checkName = this.name;
		var errors = [];

        async.each(items, function(item, callback){
        	JSDOM.fromFile(item, null).then(dom => {
	        	var doc = dom.window.document;
                var prompts = doc.querySelectorAll('.text-to-speech');
                async.each(prompts, function(tag, callback){
	                if (!tag.hasAttribute('label') &&
	                	!tag.hasAttribute('alt') &&
	                	!tag.hasAttribute('alt-text') &&
	                	!tag.hasAttribute('aria-label')){
	                    var err = {
	                        errorType: 'Text To Speech tag with no TTS attribute',
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
                    errorLogger.logMessage(" ");
	        	}
	        });
	    });
	}
};