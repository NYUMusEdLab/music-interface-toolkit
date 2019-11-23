import babel from 'rollup-plugin-babel';

export default {
  plugins: [
    babel({
      presets: ['@babel/preset-env'],
      exclude: 'node_modules/**'
    })
  ],
  input: {
    'events': 'events/index.js',
    'web': 'web/index.js'
  },
  output: {
    dir: '.',
    format: 'esm',
    chunkFileNames: 'shared/[name]-[hash].js'
  }
};
