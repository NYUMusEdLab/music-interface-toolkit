import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import babel from 'rollup-plugin-babel';

export default {
  external: ['react', '@tonaljs/tonal'],
  plugins: [
    resolve(),
    postcss({
      extensions: ['.css'],
    }),
    babel({
      presets: ['@babel/preset-env', '@babel/preset-react'],
      exclude: 'node_modules/**',
    }),
  ],
  input: {
    'radial-layout': 'src/radial-layout/index.js',
    'scale-wheel': 'src/scale-wheel/index.js',
  },
  output: {
    dir: '.',
    format: 'esm',
    chunkFileNames: 'shared/[name]-[hash].js',
  },
};
