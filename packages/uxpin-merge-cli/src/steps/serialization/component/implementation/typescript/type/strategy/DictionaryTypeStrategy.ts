import { PropItem } from 'react-docgen-typescript';
import * as TJS from 'typescript-json-schema';
import { PropertyType } from '../../../ComponentPropertyDefinition';
import { convertTypeDefinitionToPropertyType } from '../convertTypeDefinitionToPropertyType';
import { PropertyTypeSerializationStrategy } from './PropertyTypeSerializationStrategy';

// tslint:disable:prefer-function-over-method

export class DictionaryTypeStrategy implements PropertyTypeSerializationStrategy {
  public isApplicableFor(typeDefinition:TJS.Definition, propItem?:PropItem):boolean {
    return typeDefinition.type === 'object'
      && typeof typeDefinition.additionalProperties === 'object';
  }

  public serialize(
    typeDefinition:TJS.Definition,
    propItem:PropItem | undefined,
    rootSchema:TJS.Definition,
  ):PropertyType {
    const valueSchema:TJS.Definition = typeDefinition.additionalProperties as TJS.Definition;
    return {
      name: 'dictionary',
      structure: { valueType: convertTypeDefinitionToPropertyType(valueSchema, rootSchema) },
    };
  }
}
