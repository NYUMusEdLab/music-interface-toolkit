import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import url from 'postcss-url';
import babel from 'rollup-plugin-babel';

export default {
  external: ['react', '@tonaljs/tonal'],
  plugins: [
    resolve(),
    postcss({
      extract: true,
      extensions: ['.css'],
      plugins: [url({ url: 'inline' })],
    }),
    babel({
      presets: ['@babel/preset-env', '@babel/preset-react'],
      exclude: 'node_modules/**',
    }),
  ],
  input: {
    labels: 'src/labels/index.js',
    'radial-layout': 'src/radial-layout/index.js',
    'scale-wheel': 'src/scale-wheel/index.js',
  },
  output: {
    dir: '.',
    format: 'esm',
    chunkFileNames: 'shared/[name]-[hash].js',
  },
};
