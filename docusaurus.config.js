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
        customCss: require.resolve('./docs-shared/css/custom.css'),
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
          items: [{ label: 'Piano', to: 'piano-ui/' }],
        },
        {
          href: 'https://github.com/NYUMusEdLab/music-interface-toolkit/',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    sidebarCollapsible: false,
  },
  plugins: [
    [
      '@docusaurus/plugin-content-pages',
      {
        path: 'docs-shared/pages',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        path: 'packages/piano-ui/docs',
        routeBasePath: 'piano-ui',
        homePageId: 'piano',
        sidebarPath: 'packages/piano-ui/docs/sidebar.js',
        editUrl:
          'https://github.com/NYUMusEdLab/music-interface-toolkit/edit/master/packages/piano-ui/',
      },
    ],
  ],
};
