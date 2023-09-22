const vuePlugin = require("esbuild-plugin-vue3")
const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ['app/javascript/*.*'],
  bundle: true,
  sourcemap: true,
  outdir: 'app/assets/builds',
  plugins: [vuePlugin()],
  define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
  },
});
