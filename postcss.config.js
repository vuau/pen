// const purgeCss = require('@fullhuman/postcss-purgecss')
const autoprefixer = require('autoprefixer')
const postcssNested = require('postcss-nested')
const postcssPresetEnv = require('postcss-preset-env')

// const purgeConfig = {
//   content: ['./src/index.html', './src/**/*.svelte'],
//   whitelistPatterns: [/svelte-/],
//   defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
// }

const plugins =
  process.env.NODE_ENV === 'production'
    ? [postcssNested, autoprefixer, postcssPresetEnv]
    : [postcssNested, autoprefixer, postcssPresetEnv]

module.exports = { plugins }
