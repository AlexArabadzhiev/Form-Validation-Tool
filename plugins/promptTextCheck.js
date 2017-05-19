var fs = require('fs');
var path = require('path');
var async = require('async');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var errorLogger = require('../errorLogger');
var content = require('../contentManager');

module.exports = {
	name: "Prompt Tag Check",

	execute: function() {

		var items = content.items;
		var count = 0;
		var errCounter = 0;
		var checkName = this.name;
		var errors = [];
		var itemsLength = items.length;

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
				if (count == itemsLength){
					errorLogger.logCheckEnded(checkName, errCounter, errors);
				}
			});
		});
	}
};