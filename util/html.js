
function appendHeaderHtml(resultsHtml) {
    resultsHtml.push(`
<html lang="en">
<head>
	<meta charset="UTF-8">
	<style>
	body {
			font-family: sans-serif;
			margin: 0;
			padding: 10px 20px;
			background-color: #DDDDDD;
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
    <div style="column-count: 4">
    `);
}

function appendFooterHtml(resultsHtml) {
    resultsHtml.push(`
    </div>
</body>
</html>	
    `);
}

function appendEntryHtml(resultsHtml, prefix, icon) {
    resultsHtml.push(`
<div class="preview" style="font-size: 12px">
	<span class="preview_icon ${prefix} ${prefix}-${icon}"></span>
	<span>${icon}</span>
</div>            
            `)
}

module.exports={
    appendFooterHtml,
    appendHeaderHtml,
    appendEntryHtml
}

