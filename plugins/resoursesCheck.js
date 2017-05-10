var fs = require('fs');
var async = require('async');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var forms = fs.readdirSync('./content/Forms');
var errorLogger = require('../errorLogger');

module.exports = {
	name: "Resourse Check",

	execute: function() {

        var count = 0;
        var errCounter = 0;
        var checkName = this.name;
        var errors = [];

        async.each(forms, function(item, callback){
            var manifestPath = './content/Forms/' + item + '/imsmanifest.xml';
            JSDOM.fromFile(manifestPath, null).then(dom => {
                var doc = dom.window.document;
                var resources = doc.querySelectorAll('resource');
                async.each(resources, function(item, callback){
                    if (item.getAttribute('type') == 'imsqti_item_xmlv2p0') {
                        var isHrefCorrect = fs.existsSync('./content/Items/' + item.getAttribute('href'));
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
                if (count == forms.length){
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