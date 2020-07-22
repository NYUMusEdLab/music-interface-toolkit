module.exports = {
  permalink: ({ page: { filePathStem } }) => toPermalink(filePathStem),
  eleventyNavigation: async (data) => {
    let {
      page: { filePathStem },
    } = data;
    let { package, version, suffix } = await getPackageInfo(filePathStem);

    // In case we have any navigation properties already set
    let nav = data.eleventyNavigation || {};

    if (package) {
      if (suffix === 'README') {
        return { ...nav, key: package, title: `${package} (${version})` };
      } else {
        return { ...nav, key: data.title || suffix, parent: package };
      }
    } else {
      // For now, exclude from navigation...
    }
  },
};

const ignored = new Set(['packages', 'src', 'README']);

function toPermalink(filePath) {
  return filePath
    .split('/')
    .filter((p) => !ignored.has(p))
    .concat(['index.html'])
    .join('/');
}

const { readFile } = require('fs').promises;

let loadedPackageInfo = new Map();

async function getPackageInfo(filePath) {
  try {
    let [, slug, suffix] = filePath.match(
      /^\/packages\/([A-Za-z0-9-]+)\/(.*)$/
    );

    // If we haven't already tried loading this package.json file, set up
    // an async function to load and parse it
    if (!loadedPackageInfo.has(slug)) {
      loadedPackageInfo.set(
        slug,
        readFile(`./packages/${slug}/package.json`, 'utf8').then((file) => {
          let { name, version } = JSON.parse(file);
          return { name, version };
        })
      );
    }

    // Now wait for loader to actually finish
    let { name, version } = await loadedPackageInfo.get(slug);

    return { package: name, version, suffix };
  } catch (e) {
    // Something went wrong, probably because this file isn't in
    // a package
    return { package: null };
  }
}
