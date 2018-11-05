import { toPairs, values } from 'lodash';
import { ComponentDoc, PropItem, Props } from 'react-docgen-typescript';
import * as ts from 'typescript';
import * as TJS from 'typescript-json-schema';
import { ComponentPropertyDefinition } from '../ComponentPropertyDefinition';
import { convertTypeDefinitionToPropertyType } from './type/convertTypeDefinitionToPropertyType';

export function serializeProps(componentDoc:ComponentDoc, componentPath:string):ComponentPropertyDefinition[] {
  const propertiesTypeName:string | undefined = getNameOfTypeOfPropertiesObject(componentDoc.props);
  if (!propertiesTypeName) {
    return [];
  }
  const propsSchema:TJS.Definition | null = getSchema(componentPath, propertiesTypeName);
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

const compilerOptions:any = {
  jsx: 'react',
  lib: ['es2016', 'dom'],
  module: 'commonjs',
  moduleResolution: 'node',
  skipLibCheck: true,
};

function getSchema(componentFilePath:string, typeName:string):TJS.Definition | null {
  const program:ts.Program = TJS.getProgramFromFiles([componentFilePath], compilerOptions);
  return TJS.generateSchema(program, typeName);
}

function getNameOfTypeOfPropertiesObject(props:Props):string | undefined {
  const itemWithParentDefinition:PropItem | undefined = values(props).find((item) => !!item.parent);
  if (!itemWithParentDefinition) {
    return;
  }
  return itemWithParentDefinition.parent!.name;
}
