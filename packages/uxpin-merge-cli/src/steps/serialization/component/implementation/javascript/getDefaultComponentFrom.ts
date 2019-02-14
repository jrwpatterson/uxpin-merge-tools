import { readFile } from 'fs-extra';
import { defaultHandlers, parse } from 'react-docgen';
import externalProptypesHandler from 'react-docgen-external-proptypes-handler';
import importedProptypesHandler from 'react-docgen-imported-proptype-handler';
import { ComponentDoc } from 'react-docgen-typescript/lib';

export async function getDefaultComponentFrom(filePath:string):Promise<ComponentDoc> {
    const fileContents:string = await readFile(filePath, { encoding: 'utf8' });

    const handlers:any[] = defaultHandlers.concat([
        externalProptypesHandler(filePath),
        importedProptypesHandler(filePath),
    ]);

    return parse(fileContents, null, handlers);
}
