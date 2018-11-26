import { resolve } from 'path';

export function getMineralUIPath(path:string = ''):string {
  return resolve(__dirname, '../resources/repos/mineral-ui/', path);
}
