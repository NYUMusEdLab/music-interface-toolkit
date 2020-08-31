module.exports = {
  title: 'Music Interface Toolkit',
  url: 'https://nyumusedlab.github.io',
  baseUrl: '/music-interface-toolkit/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  themes: [
    [
      '@docusaurus/theme-classic',
      {
        customCss: require.resolve('./docs/css/custom.css'),
      },
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Music Interface Toolkit',
      items: [
        {
          label: 'Packages',
          position: 'left',
          items: [
            { label: 'Toolkit', to: 'toolkit/' },
            { label: 'Piano', to: 'piano-ui/' },
            { label: 'Symbols', to: 'symbols/' },
          ],
        },
        {
          href: 'https://github.com/NYUMusEdLab/music-interface-toolkit/',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    sidebarCollapsible: false,
    prism: {
      defaultLanguage: 'jsx',
      theme: require('prism-react-renderer/themes/nightOwlLight'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
  },
  plugins: [
    [
      '@docusaurus/plugin-content-pages',
      {
        path: 'docs/pages',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'toolkit-docs',
        path: 'packages/toolkit/docs',
        routeBasePath: 'toolkit',
        sidebarPath: 'packages/toolkit/docs/sidebar.js',
        versions: {
          current: {
            label: require('./packages/toolkit/package.json').version,
          },
        },
        editUrl:
          'https://github.com/NYUMusEdLab/music-interface-toolkit/edit/master/packages/toolkit/',
      },
    ],

    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'symbols-docs',
        path: 'packages/symbols/docs',
        routeBasePath: 'symbols',
        sidebarPath: 'packages/symbols/docs/sidebar.json',
        versions: {
          current: {
            label: require('./packages/symbols/package.json').version,
          },
        },
        editUrl:
          'https://github.com/NYUMusEdLab/music-interface-toolkit/edit/master/packages/symbols/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'piano-ui-docs',
        path: 'packages/piano-ui/docs',
        routeBasePath: 'piano-ui',
        sidebarPath: 'packages/piano-ui/docs/sidebar.js',
        versions: {
          current: {
            label: require('./packages/piano-ui/package.json').version,
          },
        },
        editUrl:
          'https://github.com/NYUMusEdLab/music-interface-toolkit/edit/master/packages/piano-ui/',
      },
    ],
  ],
};
