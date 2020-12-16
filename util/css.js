function appendHeaderCss(resultsCss, prefix) {
  resultsCss.push(`
.${prefix} {
    width: 1em;
    height: 1em;
    background-size: 1em 1em;
    display: inline-block;
}`);
}

function appendEntryCss(resultsCss, dataUrl, prefix, icon) {
  resultsCss.push(`
.${prefix}-${icon} {
    background-image: url('${dataUrl}');
}`);
}

module.exports = {
  appendHeaderCss,
  appendEntryCss,
};
