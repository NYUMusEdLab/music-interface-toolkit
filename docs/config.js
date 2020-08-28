module.exports = (package, homepage) => ({
  title: package,
  url: 'https://nyumusedlab.github.io',
  baseUrl: `/music-interface-toolkit/${package}/`,
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: `@musedlab/${package}`,
      items: [
        {
          href: `https://github.com/NYUMusEdLab/music-interface-toolkit/tree/master/packages/${package}`,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    sidebarCollapsible: false,
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          homePageId: homepage,
          sidebarPath: require.resolve(
            `../packages/${package}/docs/sidebar.js`
          ),
          editUrl: `https://github.com/NYUMusEdLab/music-interface-toolkit/edit/master/packages/${package}/`,
        },
        theme: {
          customCss: require.resolve('./css/custom.css'),
        },
      },
    ],
  ],
});
