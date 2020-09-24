const purgeCss = require('@fullhuman/postcss-purgecss')
const autoprefixer = require('autoprefixer')
const postcssNested = require('postcss-nested')
const postcssPresetEnv = require('postcss-preset-env')

const purgeConfig = {
  css: ['./src/styles/main.css', './src/styles/water.css'],
  content: ['./src/index.html', './src/**/*.svelte'],
  whitelistPatterns: [/svelte-/, /menubar/, /menuitem/, /ProseMirror/]
}

const plugins =
  process.env.NODE_ENV === 'production'
    ? [postcssNested, autoprefixer, postcssPresetEnv, purgeCss(purgeConfig)]
    : [postcssNested, autoprefixer, postcssPresetEnv]

module.exports = { plugins }
