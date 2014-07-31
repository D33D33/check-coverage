var fs = require('fs'),
	util = require('util'),
    xml2js = require('xml2js');

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/cobertura.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        var packages = result.coverage.packages[0].package;
        for(var i=0; i < packages.length; i++)
        {
        	var classes = packages[i].classes[0].class;
        	for(var j=0; j < classes.length; j++)
        	{
        		console.log(classes[j].$.filename + ' <-> ' + classes[j].$['line-rate']);
        	}
        }
        console.log('Done');
    });
});