import babel from 'rollup-plugin-babel';

export default {
  plugins: [
    babel({
      presets: ['@babel/preset-env'],
      exclude: 'node_modules/**'
    })
  ],
  input: {
    'events': 'src/events/index.js',
    'web': 'src/web/index.js'
  },
  output: {
    dir: '.',
    format: 'esm',
    chunkFileNames: 'shared/[name]-[hash].js'
  }
};
