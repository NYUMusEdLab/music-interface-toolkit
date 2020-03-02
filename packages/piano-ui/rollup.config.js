import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import ts from '@wessberg/rollup-plugin-ts';
import babel from 'rollup-plugin-babel';

export default {
  external: ['react'],
  plugins: [
    ts(),
    resolve(),
    postcss({
      extensions: ['.css']
    }),
    babel({
      presets: ['@babel/preset-env', '@babel/preset-react'],
      exclude: 'node_modules/**'
    })
  ],
  input: {
    'piano/index': 'src/index.tsx'
  },
  output: {
    dir: '.',
    format: 'esm',
    chunkFileNames: 'shared/[name]-[hash].js'
  }
};
