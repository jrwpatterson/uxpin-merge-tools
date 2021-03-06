import { Command } from '../../../src';
import { Environment } from '../../../src/program/env/Environment';
import { nordnetUiKitSummaryStub } from '../../resources/stubs/nordnetUiKit';
import { runUXPinMergeCommand } from '../../utils/command/runUXPinMergeCommand';
import { setTimeoutBeforeAll } from '../../utils/command/setTimeoutBeforeAll';
import { setupStubbyServer } from '../../utils/stubby/setupStubbyServer';

const CURRENT_TIMEOUT:number = 300000;

setTimeoutBeforeAll(CURRENT_TIMEOUT);

describe('summary command integration', () => {
  const { getTlsPort } = setupStubbyServer(nordnetUiKitSummaryStub);

  describe('summary command prints ', () => {
    it('prints the list of components found in nordnet-ui-kit example', () => {
      // when
      return runUXPinMergeCommand({
        cwd: 'resources/repos/nordnet-ui-kit',
        env: {
          UXPIN_API_DOMAIN: `0.0.0.0:${getTlsPort()}`,
          UXPIN_ENV: Environment.TEST,
        },
        params: [
          Command.SUMMARY,
          '--config="../../configs/nordnet-ui-kit-uxpin.config.js"',
        ],
      })
        .then((output) => {
          // then
          expect(output).toContain(
            `Uncategorized

    Alert
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    Animate
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    Avatar
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    Badge
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    Button
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    Dropdown
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    Flag
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    Icon
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    Input
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    LabeledValue
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    Li
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    Logo
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    Pane
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    RadioGroup
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    SegmentedControl
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    Spinner
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    Table
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    Tbody
        📜 documentation: ✘
        💡 examples: ✘
        🎛  presets: ✘

    Td
        📜 documentation: ✘
        💡 examples: ✘
        🎛  presets: ✘

    Tfoot
        📜 documentation: ✘
        💡 examples: ✘
        🎛  presets: ✘

    Th
        📜 documentation: ✘
        💡 examples: ✘
        🎛  presets: ✘

    Thead
        📜 documentation: ✘
        💡 examples: ✘
        🎛  presets: ✘

    Tooltip
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    Tr
        📜 documentation: ✘
        💡 examples: ✘
        🎛  presets: ✘

    Ul
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘`);
        });
    });
  });
});
