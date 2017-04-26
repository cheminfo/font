'use strict';

const fs = require('fs');
const prefix='ci-icon';
const source=__dirname + '/svg';
const destination=__dirname + '/dist/';
const destination_html=__dirname + '/docs/';

const SVGO = require('svgo');
const svgo = new SVGO(/*{ custom config object }*/);
const btoa = require('btoa');

const {
    appendHeaderHtml,
    appendFooterHtml,
    appendEntryHtml
} = require('./util/html.js');

const {
    appendHeaderCss,
    appendEntryCss
} = require('./util/css.js');



var resultsCss=[];
var resultsHtml=[];
appendHeaderCss(resultsCss, prefix);
appendHeaderHtml(resultsHtml);
appendFolder(source);
appendFooterHtml(resultsHtml);

fs.writeFileSync(destination+'style.css', resultsCss.join('\r\n'));
fs.writeFileSync(destination_html+'index.html', resultsHtml.join('\r\n'));
fs.writeFileSync(destination_html+'style.css', resultsCss.join('\r\n'));

function appendFolder(folder) {
    var files = fs.readdirSync(folder).filter(
        a => a.indexOf('.ori.')===-1
    );

    files.forEach(function(file) {
        var fullname=folder+'/'+file;
        if (fs.lstatSync(fullname).isDirectory()) {
            appendFolder(fullname);
        } else if (file.match(/svg$/)) {
            var icon=fullname.replace(source+'/','').replace(/\//g,'-').replace(/\..[^\.]*$/g,'');
            var svg = fs.readFileSync(fullname, 'utf-8');
            
            svgo.optimize(svg, function(svg) {
                //var dataUrl = 'data:image/svg+xml;base64,' + btoa(svg.data);
                var dataUrl = 'data:image/svg+xml;utf-8,' + svg.data.replace(/'/g,'\\');
                appendEntryCss(resultsCss,dataUrl, prefix, icon);
                appendEntryHtml(resultsHtml,prefix, icon);
            })
        }
    });

}


