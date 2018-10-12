import pMapSeries = require('p-map-series');
import { getComponentCategoryInfos } from '../steps/discovery/component/category/getComponentCategoryInfos';
import { getDesignSystemMetadata } from '../steps/serialization/getDesignSystemMetadata';
import { tapPromise } from '../utils/promise/tapPromise';
import { getSteps } from './command/getSteps';
import { Step } from './command/Step';
import { DSMetadata } from './DSMeta';
import { getProgramArgs } from './getProgramArgs';
import { getProjectPaths } from './getProjectPaths';
import { ProgramArgs, RawProgramArgs } from './ProgramArgs';

export function runProgram(program:RawProgramArgs):Promise<any> {
  const programArgs:ProgramArgs = getProgramArgs(program);

  const steps:Step[] = getSteps(programArgs);
  const stepFunctions:StepExecutor[] = steps.filter((step) => step.shouldRun).map((step) => tapPromise(step.exec));

  return getComponentCategoryInfos(getProjectPaths(programArgs))
    .then(getDesignSystemMetadata)
    .then((designSystem:DSMetadata) => pMapSeries(stepFunctions, (step) => step(designSystem)))
    .catch(logError);

}

function logError(errorMessage:string):void {
  console.log('ERROR:', errorMessage);
}

type StepExecutor = (designSystem:DSMetadata) => Promise<DSMetadata>;
