import { PropItem } from 'react-docgen-typescript';
import * as TJS from 'typescript-json-schema';
import { PropertyType } from '../../../ComponentPropertyDefinition';
import { PropertyTypeSerializationStrategy } from './PropertyTypeSerializationStrategy';

// tslint:disable:prefer-function-over-method

export class ArrayTypeStrategy implements PropertyTypeSerializationStrategy {
  public isApplicableFor(typeDefinition:TJS.Definition, propItem?:PropItem):boolean {
    return typeDefinition.type === 'array';
  }

  public serialize(
    typeDefinition:TJS.Definition,
    propItem:PropItem | undefined,
    rootSchema:TJS.Definition,
  ):PropertyType {
    return { name: 'array', structure: {} };
  }
}
