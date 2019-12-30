import ts from 'rollup-plugin-ts';

export default {
  plugins: [ts()],
  input: {
    'message/index': 'src/message/index.js',
    'message/statuses': 'src/message/statuses.ts',
    'web/index': 'src/web/index.js'
  },
  output: {
    dir: '.',
    format: 'esm',
    chunkFileNames: 'shared/[name]-[hash].js'
  }
};
