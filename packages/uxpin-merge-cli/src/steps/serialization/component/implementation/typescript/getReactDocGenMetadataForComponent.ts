import { parse as parsePath } from 'path';
import { ComponentDoc, parse } from 'react-docgen-typescript';

export function getReactDocGenMetadataForComponent(filePath:string):ComponentDoc {
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
