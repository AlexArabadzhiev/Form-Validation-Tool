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

	    var ttsCheck = function(item) {
	    	var item = item || items[0];
        	JSDOM.fromFile(item, null).then(dom => {
	        	var doc = dom.window.document;
                var ttsTags = doc.querySelectorAll('.text-to-speech');
                async.each(ttsTags, function(tag, callback){
	                if (!tag.hasAttribute('label') &&
	                	!tag.hasAttribute('alt') &&
	                	!tag.hasAttribute('alt-text') &&
	                	!tag.hasAttribute('alttext') &&
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
	        		errorLogger.logCheckEnded(checkName, errCounter, errors);
	        	} else {
	        		ttsCheck(items[count]);
	        	}
	        });
	    };

	    ttsCheck();
	}
};