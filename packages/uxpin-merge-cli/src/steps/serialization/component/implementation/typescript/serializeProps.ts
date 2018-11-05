import { toPairs } from 'lodash';
import { ComponentDoc, PropItem } from 'react-docgen-typescript';
import * as TJS from 'typescript-json-schema';
import { ComponentPropertyDefinition } from '../ComponentPropertyDefinition';
import { convertTypeDefinitionToPropertyType } from './type/convertTypeDefinitionToPropertyType';

export function serializeProps(componentDoc:ComponentDoc, propsSchema?:TJS.Definition):ComponentPropertyDefinition[] {
  if (!propsSchema || !propsSchema.properties) {
    return [];
  }
  const properties:Array<[string, TJS.Definition]> = toPairs(propsSchema.properties);
  return properties.map<ComponentPropertyDefinition>(([propName, propType]) => {
    const propItem:PropItem | undefined = componentDoc.props[propName];
    return {
      ...getDefaultPropValue(propItem),
      description: propType.description || '',
      isRequired: !!(propItem && propItem.required),
      name: propName,
      type: convertTypeDefinitionToPropertyType(propType, propsSchema, propItem),
    };
  });
}

function getDefaultPropValue(propItem:PropItem | undefined):Pick<ComponentPropertyDefinition, 'defaultValue'> {
  return propItem && propItem.defaultValue ? { defaultValue: propItem.defaultValue } : {};
}
