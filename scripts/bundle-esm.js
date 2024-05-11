const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild.build({
  entryPoints: ['node_modules/open/index.js'],
  bundle: true,
  platform: 'node',
  outfile: 'built-esm/open.js',
  plugins: [nodeExternalsPlugin()],
});
