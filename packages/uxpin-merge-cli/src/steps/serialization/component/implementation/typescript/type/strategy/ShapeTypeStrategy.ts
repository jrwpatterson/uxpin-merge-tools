import { reduce } from 'lodash';
import { PropItem } from 'react-docgen-typescript';
import * as TJS from 'typescript-json-schema';
import { PropertyType, ShapeTypeStructure } from '../../../ComponentPropertyDefinition';
import { convertTypeDefinitionToPropertyType } from '../convertTypeDefinitionToPropertyType';
import { PropertyTypeSerializationStrategy } from './PropertyTypeSerializationStrategy';

// tslint:disable:prefer-function-over-method

export class ShapeTypeStrategy implements PropertyTypeSerializationStrategy {

  public isApplicableFor(typeDefinition:TJS.Definition, propItem?:PropItem):boolean {
    return !!typeDefinition.properties;
  }

  public serialize(
    typeDefinition:TJS.Definition,
    propItem:PropItem | undefined,
    rootSchema:TJS.Definition,
  ):PropertyType {
    return {
      name: 'shape',
      structure: reduce<TJS.Definition, ShapeTypeStructure>(typeDefinition.properties,
        (structure, propertyDefinition, propertyName) => {
          structure[propertyName] = convertTypeDefinitionToPropertyType(propertyDefinition, rootSchema);
          return structure;
        }, {}),
    };
  }
}
