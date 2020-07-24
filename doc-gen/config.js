/**
 * Configuration for Eleventy, which is used to build the documentation site.
 */
const eleventyNavigation = require('@11ty/eleventy-navigation');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigation);
  eleventyConfig.addPlugin(syntaxHighlight);

  // Copy css files from /doc-gen/templates/css to docs/css
  eleventyConfig.addPassthroughCopy({ 'doc-gen/templates/css': 'css' });

  eleventyConfig.setFrontMatterParsingOptions({
    delimiters: ['<!---', '--->'],
  });

  return {
    dir: {
      output: 'docs',
      includes: 'doc-gen/templates',
      data: 'doc-gen/data',
    },
  };
};
