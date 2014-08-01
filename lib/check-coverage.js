#!/usr/bin/env node
(function () {
    "use strict";
    require('colors');

    var fs = require('fs'),
        argsjs = require('args.js'),
        xml2js = require('xml2js'),

        params = {},
        argParser = new argsjs.Parser([
            { id: 'file', defaultValue: 'cobertura.xml' },
            { id: 'rate', flags: ['r', 'rate'], help: 'Minimum coverage rate [0-100]', defaultValue: 80, validator: function (value) {
                var i = argsjs.validators.int()(value);
                if (i >= 0 && i <= 100) {
                    return i;
                }
                throw 'should be between [0-100]';
            }},
            { id: 'all', flags: ['a', 'all'], isSwitch: true, help: 'Shows all (aka: not only files under rate coverage)'},
            { id: 'help', flags: ['h', 'help'], isSwitch: true, special: true, help: 'Shows this message', validator: function () {
                console.log(argParser.help().replace(/(\n)/g, '$1    ').replace(/(^[\w\W]*\n)/g, 'Usage: check-coverage $1\n Options: '));
                process.exit(0);
            }}
        ]),
        rate = 80,
        fail = false;


    try {
        params = argParser.parse();
    } catch (err) {
        console.error('Error: ' + err.message);
        console.log('Try --help for options');
        process.exit(1);
    }

    rate = params.rate / 100;

    fs.readFile(params.file, function (err, data) {
        if (err) { throw err; }
        var xmlParser = new xml2js.Parser();
        xmlParser.parseString(data, function (err, result) {
            if (err) { throw err; }

            var i, j, classes, lineRate,
                packages = result.coverage.packages[0].package;

            for (i = 0; i < packages.length; i += 1) {
                classes = packages[i].classes[0].class;

                for (j = 0; j < classes.length; j += 1) {
                    lineRate = parseFloat(classes[j].$['line-rate']);

                    if (isNaN(rate) || lineRate < rate) {
                        fail = true;
                        console.log((classes[j].$.filename + ' <-> ' + lineRate).red);
                    } else if (params.all) {
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
}());