import { PropItem } from 'react-docgen-typescript';
import * as TJS from 'typescript-json-schema';
import { PropertyType } from '../../../ComponentPropertyDefinition';
import { PropertyTypeSerializationStrategy } from './PropertyTypeSerializationStrategy';

const FUNCTION_TYPE_REGEX:RegExp = /\([\w:\s]*\) => /;

// tslint:disable:prefer-function-over-method

export class FunctionTypeStrategy implements PropertyTypeSerializationStrategy {
  public isApplicableFor(typeDefinition:TJS.Definition, propItem?:PropItem):boolean {
    return typeDefinition.type === 'object' && !!propItem
      && FUNCTION_TYPE_REGEX.test(propItem.type.name);
  }

  public serialize(typeDefinition:TJS.Definition, propItem:PropItem | undefined):PropertyType {
    return { name: 'func', structure: {} };
  }
}
