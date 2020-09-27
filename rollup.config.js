import commonjs from '@rollup/plugin-commonjs'
import html from 'rollup-plugin-html2'
import livereload from 'rollup-plugin-livereload'
import postcss from 'rollup-plugin-postcss'
import preprocess from 'svelte-preprocess'
import resolve from '@rollup/plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import replace from '@rollup/plugin-replace'
import copy from 'rollup-plugin-copy'
import path from 'path'

const isDev = process.env.NODE_ENV === 'development'

const plugins = [
  svelte({
    dev: isDev,
    extensions: ['.svelte'],
    preprocess: preprocess({ postcss: true }),
    emitCss: true
  }),
  postcss({
    sourceMap: isDev,
    extract: path.resolve('./dist/bundle.css')
  }),
  resolve({
    browser: true,
    dedupe: ['svelte'],
    preferBuiltins: false
  }),
  commonjs(),
  nodePolyfills(),
  replace({
    'process.env.NODE_ENV': isDev ? '"development"' : '"production"'
  }),
  copy({
    targets: [
      { src: 'src/styles/fonts/*', dest: 'dist/fonts' },
      { src: 'src/images/*', dest: 'dist/images' },
      { src: 'src/manifest.webmanifest', dest: 'dist/' }
    ]
  }),
  html({
    template: 'src/index.html',
    fileName: 'index.html'
  })
]

if (isDev) {
  plugins.push(
    serve({
      contentBase: './dist',
      historyApiFallback: true,
      port: 5000
    }),
    livereload({ watch: './dist' })
  )
} else {
  plugins.push(terser({ sourcemap: isDev }))
}

module.exports = {
  input: 'src/index.js',
  output: {
    name: 'bundle',
    file: 'dist/bundle.js',
    sourcemap: isDev,
    format: 'iife'
  },
  inlineDynamicImports: true,
  plugins
}
