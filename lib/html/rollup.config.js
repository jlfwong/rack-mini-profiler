import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';

const plugins = [
  typescript({
    typescript: require('typescript')
  }),
  nodeResolve({
    jsnext: true,
    main: true
  }),
  commonjs({
    include: 'node_modules/**',
    namedExports: {}
  })
]

export default [{
  input: 'mini-profiler.ts',
  output: {
    file: 'dist/mini-profiler.js',
    format: 'iife'
  },
  plugins: plugins
}]