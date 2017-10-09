import { join } from 'path';
import { Configuration } from 'webpack';
import { getConfig } from '../../../../../src/steps/building/config/getConfig';
import { testDirPath } from '../../../../utils/resources/testDirPath';

describe('getConfig', () => {
  describe('returns webpack config merged with user config and enriched with happy pack config', () => {
    describe('when there is user wepback config', () => {
      it('returns correctly merged config', () => {
        // given
        const useConfigPath:string = join(testDirPath, '/resources/repos/arui-feather/webpack.gemini.config.js');

        // when
        const result:Configuration = getConfig(useConfigPath);

        // then
        expect(result).toEqual({});
      });
    });
  });
});
