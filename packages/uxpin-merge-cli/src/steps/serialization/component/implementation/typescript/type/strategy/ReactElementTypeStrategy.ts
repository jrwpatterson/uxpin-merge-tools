import { PropItem } from 'react-docgen-typescript';
import * as TJS from 'typescript-json-schema';
import { PropertyType } from '../../../ComponentPropertyDefinition';
import { PropertyTypeSerializationStrategy } from './PropertyTypeSerializationStrategy';

// tslint:disable:prefer-function-over-method

export const REACT_ELEMENT_REF_REGEX:RegExp = /ReactElement/;

export class ReactElementTypeStrategy implements PropertyTypeSerializationStrategy {
  public isApplicableFor(typeDefinition:TJS.Definition, propItem?:PropItem):boolean {
    return isReactElementType(typeDefinition);
  }

  public serialize(typeDefinition:TJS.Definition, propItem:PropItem | undefined):PropertyType {
    return { name: 'element', structure: {} };
  }
}

function isReactElementType(typeDefinition:TJS.Definition):boolean {
  return !!typeDefinition.$ref && REACT_ELEMENT_REF_REGEX.test(typeDefinition.$ref);
}
