const purgeCss = require('@fullhuman/postcss-purgecss')
const autoprefixer = require('autoprefixer')
const postcssNested = require('postcss-nested')
const postcssPresetEnv = require('postcss-preset-env')
const cssnano = require('cssnano')

const purgeConfig = {
  css: ['./src/styles/main.css'],
  content: ['./src/index.html', './src/**/*.svelte'],
  whitelistPatterns: [/svelte-/, /menubar/, /menuitem/, /ProseMirror/]
}

const plugins =
  process.env.NODE_ENV === 'production'
    ? [postcssNested, autoprefixer, postcssPresetEnv, purgeCss(purgeConfig), cssnano()]
    : [postcssNested, autoprefixer, postcssPresetEnv]

module.exports = { plugins }
