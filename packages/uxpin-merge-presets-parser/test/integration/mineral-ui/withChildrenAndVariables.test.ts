import { join, resolve } from 'path';
import { parseReactPresets } from '../../../src/parsers/react';
import { getMineralUIPath } from '../../utils/getMineralUIPath';

describe('With children and variables', () => {
  const webpackConfigPath:string = getMineralUIPath('./webpack.config.js');
  const presetPath:string = getMineralUIPath('./src/library/Card/Card/presets/1-jsx.js');
  const tempDir:string = join(__dirname, './temp');

  it('should proper convert presets to json', async () => {
    // given
    const expectedPresets:object = {
      'rootId': 'OFOK2ZKES405DYHFSHQ28OM9WSKA8APM',
      'elements': {
        'OFOK2ZKES405DYHFSHQ28OM9WSKA8APM': {
          'name': 'Card',
          'props': {
            'children': [
              { uxpinPresetElementId: 'UY8QB4P8Y2TXG5170CH1K8IXALSB8VG0' },
              { uxpinPresetElementId: '2d9577421c3542b4b42ac0127712e117' },
              { uxpinPresetElementId: '77XCO8EASMVIM7H8KF7OY57YU0Q90EMH' },
            ],
          },
        },
        'UY8QB4P8Y2TXG5170CH1K8IXALSB8VG0': {
          name: 'CardBlock',
          props: {
            children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. ' +
              'Aliquam erat volutpat. Nulla facilisi.',
          },
        },
        '2d9577421c3542b4b42ac0127712e117': {
          name: 'CardDivider',
          props: {},
        },
        '77XCO8EASMVIM7H8KF7OY57YU0Q90EMH': {
          name: 'CardActions',
          props: {
            children: [
              { uxpinPresetElementId: '9XI3KDGOF0H05837DAG2M9EUUUQIMAO3' },
              { uxpinPresetElementId: '83a41d7331ef425581849864eaffb170' },
            ],
          },
        },
        '9XI3KDGOF0H05837DAG2M9EUUUQIMAO3': {
          name: 'Link',
          props: {
            variant: 'danger',
            href: 'http://example.com',
            children: 'Read more',
          },
        },
        '83a41d7331ef425581849864eaffb170': {
          name: 'Button',
          props: {
            variant: 'regular',
            children: 'Elo 320',
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
