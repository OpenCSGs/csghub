const vuePlugin = require("esbuild-plugin-vue3")
const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ['app/javascript/*.*'],
  bundle: true,
  sourcemap: true,
  minify: true,
  outdir: 'app/assets/builds',
  plugins: [vuePlugin()],
  loader: {
    '.png': 'file'
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
