module.exports = {
  title: 'piano-ui',
  url: 'https://nyumusedlab.github.io',
  baseUrl: '/music-interface-toolkit/piano-ui/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '@musedlab/piano-ui',
      items: [
        {
          href:
            'https://github.com/NYUMusEdLab/music-interface-toolkit/tree/master/packages/piano-ui',
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
          homePageId: 'piano',
          sidebarPath: require.resolve('./docs/sidebar.js'),
          editUrl:
            'https://github.com/NYUMusEdLab/music-interface-toolkit/edit/master/packages/piano-ui/',
        },
        theme: {
          customCss: require.resolve('../../docs-shared/css/custom.css'),
        },
      },
    ],
  ],
};
