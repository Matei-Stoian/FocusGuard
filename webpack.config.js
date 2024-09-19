const path = require('path');

module.exports = {
  mode: 'development', // Change to 'production' for production builds
  entry: {
    background: './src/background.ts',
    popup: './src/popup.ts',
    options: './src/options.ts',
  },
  output: {
    filename: '[name].js', // Output files named based on the entry points
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve TypeScript and JavaScript files
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Apply this rule to .ts files
        use: 'ts-loader', // Use ts-loader to transpile TypeScript
        exclude: /node_modules/, // Exclude node_modules from processing
      },
    ],
  },
  devtool: 'source-map', // Enable source maps for easier debugging
};
