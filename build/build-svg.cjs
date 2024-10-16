'use strict';

const fs = require('fs-extra');
const prefix = 'ci-icon';
const source = __dirname + '/../src';
const svgFolder = __dirname + '/../svg';
const destination = __dirname + '/../dist/';
const destination_html = __dirname + '/../docs/';
const destination_react = __dirname + '/react.index.ts';

const svgo = require('svgo');

const {
  appendHeaderHtml,
  appendFooterHtml,
  appendEntryHtml,
} = require('./util/html.cjs');

const { appendHeaderCss, appendEntryCss } = require('./util/css.cjs');

var resultsCss = [];
var resultsHtml = [];

doAll().catch((error) => {
  console.error(error);
  process.exit(1);
});

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

  for (const file of files) {
    var fullname = folder + '/' + file;
    if (fs.lstatSync(fullname).isDirectory()) {
      allFolders.push(fullname.replace(source + '/', ''));
      await appendFolder(fullname, allFolders);
    } else if (file.match(/svg$/)) {
      const icon = fullname
        .replace(source + '/', '')
        .replace(/\//g, '-')
        .replace(/\..[^\.]*$/g, '');
      const svg = fs.readFileSync(fullname, 'utf-8');

      const smallSVG = svgo.optimize(svg, {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
          'convertStyleToAttrs',
          'removeDimensions',
        ],
      });
      const newName = fullname.replace(source, svgFolder);
      fs.outputFileSync(newName, smallSVG.data, 'utf8');

      const dataUrl =
        'data:image/svg+xml;base64,' +
        Buffer.from(smallSVG.data).toString('base64');

      appendEntryCss(resultsCss, dataUrl, prefix, icon);
      appendEntryHtml(resultsHtml, prefix, icon);
    }
  }
}

function buildReactExports(folders) {
  return folders
    .map((folder) => `export * from './lib-react-tsx/${folder}/index.js';`)
    .join('\n');
}
