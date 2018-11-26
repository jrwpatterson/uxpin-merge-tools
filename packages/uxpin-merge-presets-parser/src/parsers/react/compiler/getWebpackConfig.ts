import { parse } from 'path';
import { Configuration } from 'webpack';

export function getWebpackConfig(presetPath:string, bundlePath:string, webpackConfigPath:string):Configuration {
  const { base, dir } = parse(bundlePath);
  const config:Configuration = {
    entry: presetPath,
    mode: 'production',
    optimization: {
      runtimeChunk: false,
      splitChunks: false,
    },
    output: {
      filename: base,
      libraryTarget: 'commonjs',
      path: dir,
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/env', {
                targets: {
                  browsers: ['last 1 version'],
                  // modules: 'commonjs',
                },
              }],
              '@babel/react',
              '@babel/preset-flow',
            ],
            plugins: [
              'flow-react-proptypes',
              'transform-class-properties',
            ],
          },
        },
      ],
    },
  };

  if (webpackConfigPath) {
    const userWebpackConfig:Configuration = require(webpackConfigPath);
    return {
      ...config,
      mode: userWebpackConfig.mode,
      // module: userWebpackConfig.module,
    };
  }

  return config;

}
