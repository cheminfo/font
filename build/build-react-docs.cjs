'use strict';

require('esbuild')
  .build({
    entryPoints: [__dirname + '/react-docs.tsx'],
    bundle: true,
    outfile: 'docs/react.js',
    define: {
      'process.env.NODE_ENV': '"development"',
    },
  })
  .catch(() => process.exit(1));
