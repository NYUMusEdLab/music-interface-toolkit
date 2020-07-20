/**
 * Configuration for Eleventy, which is used to build the documentation site.
 */
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.setFrontMatterParsingOptions({
    delimiters: ['<!---', '--->'],
  });

  return {
    dir: {
      output: 'docs',
      includes: 'doc-gen/includes',
      data: 'doc-gen/data',
    },
  };
};
