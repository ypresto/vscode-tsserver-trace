const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['node_modules/open/index.js'],
  bundle: true,
  platform: 'node',
  outfile: 'built-esm/open.js',
  define: {
    "import.meta.url": 'import_meta_url'
  },
  inject: ['scripts/importMetaUrlShim.js'],
});
