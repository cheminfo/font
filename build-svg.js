'use strict';

const fs = require('fs-extra');
const prefix = 'ci-icon';
const source = __dirname + '/src';
const svgFolder = __dirname + '/svg';
const destination = __dirname + '/dist/';
const destination_html = __dirname + '/docs/';
const destination_react = __dirname + '/react.ts';

const SVGO = require('svgo');
const svgo = new SVGO(/*{ custom config object }*/);
const btoa = require('btoa');

const {
  appendHeaderHtml,
  appendFooterHtml,
  appendEntryHtml,
} = require('./util/html.js');

const { appendHeaderCss, appendEntryCss } = require('./util/css.js');

var resultsCss = [];
var resultsHtml = [];

doAll();

async function doAll() {
  appendHeaderCss(resultsCss, prefix);
  appendHeaderHtml(resultsHtml);
  const folders = [];
  await appendFolder(source, folders);
  appendFooterHtml(resultsHtml);

  fs.outputFileSync(destination + 'style.css', resultsCss.join('\r\n'));
  fs.outputFileSync(destination_html + 'index.html', resultsHtml.join('\r\n'));
  fs.outputFileSync(destination_html + 'style.css', resultsCss.join('\r\n'));

  fs.outputFileSync(destination_react, buildReactExports(folders));
}

async function appendFolder(folder, allFolders) {
  var files = fs.readdirSync(folder).filter((a) => a.indexOf('.ori.') === -1);

  files.forEach(async function (file) {
    var fullname = folder + '/' + file;
    if (fs.lstatSync(fullname).isDirectory()) {
      allFolders.push(fullname.replace(source + '/', ''));
      appendFolder(fullname, allFolders);
    } else if (file.match(/svg$/)) {
      var icon = fullname
        .replace(source + '/', '')
        .replace(/\//g, '-')
        .replace(/\..[^\.]*$/g, '');
      var svg = fs.readFileSync(fullname, 'utf-8');

      let smallSVG = await svgo.optimize(svg);
      let newName = fullname.replace(source, svgFolder);
      fs.outputFileSync(newName, smallSVG.data, 'utf8');

      var dataUrl = 'data:image/svg+xml;base64,' + btoa(smallSVG.data);

      appendEntryCss(resultsCss, dataUrl, prefix, icon);
      appendEntryHtml(resultsHtml, prefix, icon);
    }
  });
}

function buildReactExports(folders) {
  return folders
    .map((folder) => `export * from './lib-react-tsx/${folder}/index';`)
    .join('\n');
}
