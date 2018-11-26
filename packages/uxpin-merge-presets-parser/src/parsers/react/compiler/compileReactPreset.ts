import { unlink } from 'fs';
import { join, parse } from 'path';
import * as webpack from 'webpack';
import { ParseOptions } from '../ParseOptions';
import { decorateReactPresetFile } from './decorateReactPresetFile';
import { getWebpackConfig } from './getWebpackConfig';

export async function compileReactPreset(options:ParseOptions):Promise<any> {
  const decoratedPresetPath:string = await decorateReactPresetFile(options.tempDir, options.presetPath);

  return new Promise((resolve, reject) => {
    const { base } = parse(options.presetPath);
    const bundlePath:string = join(options.tempDir, `__bundle__${base}`);

    const webpackConfig:webpack.Configuration = getWebpackConfig(decoratedPresetPath, bundlePath, options.webpackConfigPath);
    const compiler:webpack.Compiler = webpack(webpackConfig);
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      if (stats.hasErrors()) {
        return reject(new Error(stats.toString({ errors: true })));
      }

      unlink(decoratedPresetPath, err1 => {
        console.log(err1);
      });

      resolve(bundlePath);
    });
  });
}
