// tslint:disable-next-line:import-name
import HappyPack = require('happypack');
import { join } from 'path';
import { Configuration } from 'webpack';
import { smart } from 'webpack-merge';

export const TEMP_DIR_PATH:string = './.uxpin-temp';
export const LIBRARY_INPUT_PATH:string = `${TEMP_DIR_PATH}/components.js`;
export const LIBRARY_OUTPUT_PATH:string = `${TEMP_DIR_PATH}/designsystemlibrary.js`;

export function getConfig(projectRoot:string, webpackConfigPath?:string):Configuration {
  const config:Configuration = {
    entry: LIBRARY_INPUT_PATH,
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /.jsx?$/,
          use: 'happypack/loader',
        },
      ],
    },
    output: {
      filename: LIBRARY_OUTPUT_PATH,
      libraryTarget: 'commonjs',
    },
    plugins: [
      new HappyPack({
        loaders: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                'transform-class-properties',
                'transform-object-rest-spread',
              ],
              presets: [
                ['env', {
                  targets: {
                    browsers: ['last 2 versions'],
                    node: 'current',
                  },
                }],
                'react',
              ],
            },
          },
        ],
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
    },
  };

  if (webpackConfigPath) {
    const userWebpackConfig:Configuration = require(join(projectRoot, webpackConfigPath));
    return smart(userWebpackConfig, config);
  }
  return config;
}
