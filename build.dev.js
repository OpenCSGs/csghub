const vuePlugin = require("esbuild-plugin-vue3")
const esbuild = require("esbuild");

async function watch() {
  let ctx = await esbuild.context({
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
      "process.env.NODE_ENV": JSON.stringify("development"),
    },
  });
  await ctx.watch();
  console.log('Watching...');
}
watch();
