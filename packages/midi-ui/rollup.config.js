import ts from '@wessberg/rollup-plugin-ts';

export default {
  plugins: [ts({ tsconfig: '../../tsconfig.json', include: ['src/**/*'] })],
  input: {
    
  },
  output: {
    dir: '.',
    format: 'esm',
    entryFileNames: '[name]/index.js',
    chunkFileNames: 'shared/[name]-[hash].js'
  }
};
