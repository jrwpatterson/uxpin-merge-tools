import { unlink } from 'fs-extra';
import { ProgramArgs } from '../../../../../../program/args/ProgramArgs';
import { ComponentDefinition } from '../../../ComponentDefinition';
import { createBundleSource } from '../bundle/createBundleSource';
import { buildPresetsBundleWithWebpack } from './buildPresetsBundleWithWebpack';

export async function compilePresets(programArgs:ProgramArgs, components:ComponentDefinition[]):Promise<string> {
  const sourcePath:string = await createBundleSource(programArgs, components);
  const bundlePath:string = await buildPresetsBundleWithWebpack(programArgs, components, sourcePath);
  await unlink(sourcePath);

  return bundlePath;
}
