import { PropItem } from 'react-docgen-typescript';
import * as TJS from 'typescript-json-schema';
import { PropertyType, PropertyTypeName } from '../../../ComponentPropertyDefinition';
import { PropertyTypeSerializationStrategy } from './PropertyTypeSerializationStrategy';

const PLAIN_PROPERTY_TYPES:PropertyTypeName[] = [
  'boolean',
  'number',
  'string',
  'empty',
];

// tslint:disable:prefer-function-over-method

export class PlainTypeStrategy implements PropertyTypeSerializationStrategy {

  public isApplicableFor(schemaDefinition:TJS.Definition, propItem?:PropItem):boolean {
    return isPlainTypeDefinition(schemaDefinition.type);
  }

  public serialize(typeDefinition:TJS.Definition, propItem?:PropItem):PropertyType {
    return { name: typeDefinition.type as PropertyTypeName, structure: {} };
  }
}

function isPlainTypeDefinition(type:TJS.Definition['type']):type is PropertyTypeName {
  return typeof type === 'string' && PLAIN_PROPERTY_TYPES.includes(type as PropertyTypeName);
}
