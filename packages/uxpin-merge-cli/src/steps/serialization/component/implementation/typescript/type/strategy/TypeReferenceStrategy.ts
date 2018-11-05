import { get } from 'lodash';
import { PropItem } from 'react-docgen-typescript';
import * as TJS from 'typescript-json-schema';
import { PropertyType } from '../../../ComponentPropertyDefinition';
import { convertTypeDefinitionToPropertyType } from '../convertTypeDefinitionToPropertyType';
import { PropertyTypeSerializationStrategy } from './PropertyTypeSerializationStrategy';

// tslint:disable:prefer-function-over-method
export class TypeReferenceStrategy implements PropertyTypeSerializationStrategy {
  public isApplicableFor(typeDefinition:TJS.Definition, propItem?:PropItem):boolean {
    return !!typeDefinition.$ref;
  }

  public serialize(
    typeDefinition:TJS.Definition,
    propItem:PropItem | undefined,
    rootSchema:TJS.Definition,
  ):PropertyType {
    const nestedDefinition:TJS.Definition = get(rootSchema, schemaPathToLodashPath(typeDefinition.$ref!));
    return convertTypeDefinitionToPropertyType(nestedDefinition, rootSchema);
  }
}

function schemaPathToLodashPath(schemaPath:string):string[] {
  const [, ...segments] = schemaPath.split('/');
  return segments;
}
