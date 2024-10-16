'use strict';

const path = require('path');

module.exports = function indexTemplate(filePaths) {
  const exportEntries = filePaths.map(({ path: filePath }) => {
    const basename = path.basename(filePath, path.extname(filePath));
    const dirname = path.dirname(filePath);
    const dirs = path
      .relative(`${__dirname}/lib-react-tsx`, dirname)
      .split(path.sep)
      .map((elem) => `${elem[0].toUpperCase()}${elem.slice(1)}`)
      .join('');
    const exportName = `Svg${dirs}${basename}`;
    return `export { default as ${exportName} } from './${basename}.js'`;
  });
  return exportEntries.join('\n');
};
