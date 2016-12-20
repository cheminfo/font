
function appendHeaderCss(resultsCss, prefix) {
    resultsCss.push(`
.${prefix} {
        width: 1em;
        height: 1em;
}
    `);
}

function appendEntryCss(resultsCss,dataUrl, prefix, icon) {
    resultsCss.push(`
.${prefix}-${icon} {
        content: url('${dataUrl}');
}
     `)
}

module.exports={
    appendHeaderCss,
    appendEntryCss
};