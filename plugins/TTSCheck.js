var fs = require('fs');
var path = require('path');
var async = require('async');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var errorLogger = require('../errorLogger');
var content = require('../contentManager');

module.exports = {
	name: "TTS Tag Check",

	execute: function() {

		var items = content.items;
		var count = 0;
		var errCounter = 0;
		var checkName = this.name;
		var errors = [];
		var itemsLength = items.length;

		var ttsCheck = function(item) {
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
				if (count == itemsLength){
					errorLogger.logCheckEnded(checkName, errCounter, errors);
				} else {
					ttsCheck(items[count]);
				}
			});
		};

		ttsCheck(items[0]);
	}
};