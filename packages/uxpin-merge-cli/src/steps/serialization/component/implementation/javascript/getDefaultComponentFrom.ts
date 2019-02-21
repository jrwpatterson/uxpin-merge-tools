import { readFile } from 'fs-extra';
import { defaultHandlers, Handler, parse } from 'react-docgen';
import reactDocgenImportedProptypeHandler from 'react-docgen-imported-proptype-handler';
import { ComponentDoc } from 'react-docgen-typescript/lib';

export async function getDefaultComponentFrom(filePath:string):Promise<ComponentDoc> {
  const fileContents:string = await readFile(filePath, { encoding: 'utf8' });

  const handlers:Handler[] = [
    ...defaultHandlers,
    reactDocgenImportedProptypeHandler(filePath),
  ];

  return parse(fileContents, undefined, handlers);
}
