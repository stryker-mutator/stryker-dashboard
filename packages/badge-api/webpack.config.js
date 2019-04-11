const path = require('path');

module.exports = {
  entry: './badge/index.ts',
  mode: 'development',
  context: __dirname,
  output: {
    path: path.resolve(__dirname, 'dist', 'badge'),
    filename: 'azure-function.bundle.js',
    devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]', // map to source with absolute file path not webpack:// protocol
    library: 'index',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts']
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /data-access/]
      }
    ]
  },
  devtool: 'source-map'
};
