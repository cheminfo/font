'use strict';

const fs = require('fs');
const path = require('path');
const webfontsGenerator = require('webfonts-generator');
var files = fs.readdirSync(__dirname + '/svg');

files=files.filter(function(file) {
    return file.match(/svg$/);
})

webfontsGenerator({
    files: files.map(file => path.join('svg', file)),
    dest: 'dist/',
    html: true,
    fontName: 'cheminfo',
    templateOptions: {
        classPrefix: 'ci-icon-',
        baseClass: 'ci-icon'
    }
});
