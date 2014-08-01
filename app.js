#!/usr/bin/env node

var fs = require('fs'),
    argsjs = require('args.js'),
    xml2js = require('xml2js'),
    colors = require('colors');

var parser = new argsjs.Parser([
  { id: 'file', defaultValue: 'cobertura.xml' },
  { id: 'rate', flags:['r', 'rate'], validator: 'int', help: 'Minimum coverage rate [0-100]', defaultValue: 80, validator: function(value) {
    var i = argsjs.validators.int()(value);
    if(i >= 0 && i <= 100) {
      return i;
    }
    throw 'should be between [0-100]';
  } },
  { id: 'all', flags:['a', 'all'], isSwitch: true, help: 'Shows all (aka: not only files under rate coverage)'},
  { id: 'help', flags:['h', 'help'], isSwitch: true, special: true, help: 'Shows this message', validator: function() {
      console.log(parser.help().replace(/(\n)/g, '$1    ').replace(/(^.*\n)/g, 'Usage: check-coverage $1\n Options: '));
      process.exit(0);
  } }
]);


try {
  var params = parser.parse();
} catch(err) {
  console.error('Error: ' + err.message);
  console.log('Try --help for options');
  process.exit(1);
}


var parser = new xml2js.Parser(),
    rate = params.rate/100,
    fail = false;
fs.readFile(__dirname + '/' + params.file, function(err, data) {
  parser.parseString(data, function (err, result) {
    var packages = result.coverage.packages[0].package;
    for(var i=0; i < packages.length; i++)
    {
      var classes = packages[i].classes[0].class;
      for(var j=0; j < classes.length; j++)
      {
        var lineRate = parseFloat(classes[j].$['line-rate']);

        if( isNaN(rate) || lineRate < rate) {
          fail = true;
          console.log((classes[j].$.filename + ' <-> ' + lineRate).red);
        } else if(params.all) {
          console.log((classes[j].$.filename + ' <-> ' + lineRate).green);
        }
      }
    }

    if (fail) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  });
});