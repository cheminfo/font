'use strict';

const fs = require('fs');
const prefix='ci-icon';
const source=__dirname + '/svg';
const destination=__dirname + '/dist/';

var resultsCss=[];
var resultsHtml=[];
appendHeaderCss();
appendHeaderHtml();

appendFolder(source);

appendFooterHtml();

fs.writeFileSync(destination+'style.css', resultsCss.join('\r\n'));
fs.writeFileSync(destination+'test.html', resultsHtml.join('\r\n'));


function appendFolder(folder) {
    var files = fs.readdirSync(folder);
    files.forEach(function(file) {
        var fullname=folder+'/'+file;
        if (fs.lstatSync(fullname).isDirectory()) {
            appendFolder(fullname);
        } else if (file.match(/svg$/)) {
            var icon=fullname.replace(source+'/','').replace(/\//g,'-').replace(/\..[^\.]*$/g,'');
            console.log(icon);
            var base64 = fs.readFileSync(fullname, 'base64');
            var dataUrl = 'data:image/svg+xml;base64,' + base64;
            resultsCss.push(`
.${prefix}-${icon} {
        content: url('${dataUrl}');
}
     `)

            resultsHtml.push(`
<div class="preview" style="font-size: 12px">
	<span class="preview_icon">
		<span class="${prefix} ${prefix}-${icon}"></span>
	</span>
	<span>${icon}</span>
</div>            
            `)
        }
    })
}



function appendHeaderCss() {
    resultsCss.push(`
.${prefix} {
        width: 1em;
        height: 1em;
}
    `);
}


function appendHeaderHtml() {
    resultsHtml.push(`
<html lang="en">
<head>
	<meta charset="UTF-8">
	<style>
	body {
			font-family: sans-serif;
			margin: 0;
			padding: 10px 20px;
		}

		.preview {
			line-height: 1.5em;
		}
		.preview_icon {
		    font-size: 2em
		}

</style>
	<link rel="stylesheet" type="text/css" href="./style.css">
</head>
<body>
	
    `);
}

function appendFooterHtml() {
    resultsHtml.push(`
</body>
</html>	
    `);
}


