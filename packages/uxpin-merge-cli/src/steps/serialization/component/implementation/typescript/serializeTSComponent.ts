import { parse as parsePath } from 'path';
import { ComponentDoc, parse } from 'react-docgen-typescript/lib';
import { ComponentImplementationInfo } from '../../../../discovery/component/ComponentInfo';
import { ImplSerializationResult } from '../ImplSerializationResult';
import { serializeProps } from './serializeProps';

export function serializeTSComponent(component:ComponentImplementationInfo):Promise<ImplSerializationResult> {
  return new Promise((resolve) => {
    const componentDoc:ComponentDoc = getDefaultComponentFrom(component.path);
    resolve({
      result: {
        name: componentDoc.displayName,
        properties: serializeProps(componentDoc, component.path),
      },
      warnings: [],
    });
  });
}

function getDefaultComponentFrom(filePath:string):ComponentDoc {
  let components:ComponentDoc[];
  try {
    components = parse(filePath);
  } catch (e) {
    components = [];
  }
  const expectedComponentName:string = parsePath(filePath).name;
  const nameRegex:RegExp = new RegExp(expectedComponentName, 'i');
  const component:ComponentDoc | undefined = components.find((c) => nameRegex.test(c.displayName));
  if (component) {
    return component;
  }
  throw new Error(`No \`${expectedComponentName}\` component found in ${filePath}`);
}
