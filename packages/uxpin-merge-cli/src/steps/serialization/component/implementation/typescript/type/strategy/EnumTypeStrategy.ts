import { isArray, isNull } from 'lodash';
import { PropItem } from 'react-docgen-typescript';
import * as TJS from 'typescript-json-schema';
import { PropertyType } from '../../../ComponentPropertyDefinition';
import { PropertyTypeSerializationStrategy } from './PropertyTypeSerializationStrategy';

// tslint:disable:prefer-function-over-method

export class EnumTypeStrategy implements PropertyTypeSerializationStrategy {

  public isApplicableFor(typeDefinition:TJS.Definition, propItem?:PropItem):boolean {
    return !!typeDefinition.enum;
  }

  public serialize(typeDefinition:TJS.Definition, propItem?:PropItem):PropertyType {
    let elements:PropertyType[] = [];
    if (isPrimitiveTypeUnion(typeDefinition.enum)) {
      elements = typeDefinition.enum.map(mapPrimitiveTypesUnion);
    }
    return { name: 'union', structure: { elements } };
  }
}

function isPrimitiveTypeUnion(
  enumType:TJS.PrimitiveType[] | TJS.Definition[] | undefined,
):enumType is TJS.PrimitiveType[] {
  return isArray(enumType) && (['number', 'boolean', 'string'].includes(typeof enumType[0]) || isNull(enumType[0]));
}

function mapPrimitiveTypesUnion(value:TJS.PrimitiveType):PropertyType {
  if (typeof value === 'string') {
    return {
      name: 'literal',
      structure: { value },
    };
  }
  return { name: 'unsupported', structure: {} };
}
