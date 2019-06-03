import { readFile } from 'fs-extra';
import { parse } from 'react-docgen';
import { ComponentDoc } from 'react-docgen-typescript/lib';

export function getDefaultComponentFrom(filePath:string):Promise<ComponentDoc> {
  return readFile(filePath, { encoding: 'utf8' }).then(parse);
}
