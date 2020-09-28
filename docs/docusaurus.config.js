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
        customCss: require.resolve('./css/custom.css'),
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
        path: 'pages',
      },
    ],
    // List of packages to be documented
    ...['toolkit', 'symbols', 'piano-ui'].map((name) => [
      '@docusaurus/plugin-content-docs',
      {
        id: `${name}-docs`,
        path: `../packages/${name}/docs`,
        routeBasePath: name,
        sidebarPath: `../packages/${name}/docs/sidebar.json`,
        versions: {
          current: {
            label: require(`../packages/${name}/package.json`).version,
          },
        },
        editUrl:
          'https://github.com/NYUMusEdLab/music-interface-toolkit/edit/master/packages/',
      },
    ]),
  ],
};
