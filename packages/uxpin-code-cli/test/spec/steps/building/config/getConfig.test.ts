import { Configuration } from 'webpack';
import { getConfig } from '../../../../../src/steps/building/config/getConfig';

describe('getConfig', () => {
  describe('returns webpack config merged with user config and enriched with happy pack config', () => {
    describe('when there is user wepback config and project uses babel with plugins', () => {
      it('returns correctly merged config', () => {
        // when
        const result:Configuration = getConfig();

        // then
        expect(result).toMatchSnapshot();
      });
    });
  });
});
