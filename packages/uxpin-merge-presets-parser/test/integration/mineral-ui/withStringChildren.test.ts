import { join } from 'path';
import { parseReactPresets } from '../../../src/parsers/react';
import { getMineralUIPath } from '../../utils/getMineralUIPath';

describe('With string children', () => {
  const webpackConfigPath:string = getMineralUIPath('./webpack.config.js');
  const presetPath:string = getMineralUIPath('./src/library/Button/presets/1-simple.js');
  const tempDir:string = join(__dirname, './temp');

  it('should proper convert presets to json', async () => {
    // given
    const expectedPresets:object = {
      'rootId': '1526ABF05067F99EF65F83152E26DA39',
      'elements': {
        '1526ABF05067F99EF65F83152E26DA39': {
          'name': 'Button',
          'props': {
            'children': 'Default',
            'fullWidth': true,
            'primary': true,
          },
        },
      },
    };

    // when
    const presets:object = await parseReactPresets({
      tempDir,
      presetPath,
      webpackConfigPath,
    });

    // then
    expect(presets).toEqual(expectedPresets);
  });
});
