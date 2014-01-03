/*
 * Borrowed from grunt-cli
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Tyler Kellen, contributors
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt-init/blob/master/LICENSE-MIT
 */

'use strict';

var fs = require('fs');
var path = require('path');

exports.print = function(name) {
    var code = 0;
    var filepath = path.join(__dirname, '../completion', name);
    var output;
    try {
        output = String(fs.readFileSync(filepath));
    } catch (err) {
        code = 5;
        output = 'echo "Specified gulp shell auto-completion rules ';
        if (name && name !== 'true') {
            output += 'for \'' + name + '\' ';
        }
        output += 'not found."';
    }

    console.log(output);
    process.exit(code);
};
