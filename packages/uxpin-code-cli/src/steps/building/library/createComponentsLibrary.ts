import { writeFile } from 'fs';
import { mkdir } from '../../../utils/fs/mkdir';
import { ComponentInfo } from '../../discovery/component/ComponentInfo';
import { LIBRARY_INPUT_PATH, TEMP_DIR_PATH } from '../config/getConfig';
import { getFileString } from './getFileString';

export function createComponentsLibrary(componentInfos:ComponentInfo[], wrapperPath?:string):Promise<string> {
  return new Promise((resolve, reject) => {
    mkdir(TEMP_DIR_PATH)
      .then(() => writeFile(LIBRARY_INPUT_PATH, getFileString(componentInfos, wrapperPath), 'utf8', (error) => {
        if (error) {
          return reject(error.message);
        }

        resolve(LIBRARY_INPUT_PATH);
      }));
  });
}