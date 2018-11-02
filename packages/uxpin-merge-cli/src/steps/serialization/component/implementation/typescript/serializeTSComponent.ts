import { get, isNull, reduce, toPairs, values } from 'lodash';
import { parse as parsePath } from 'path';
import { ComponentDoc, parse, PropItem, Props } from 'react-docgen-typescript/lib';
import * as ts from 'typescript';
import * as TJS from 'typescript-json-schema';
import { ComponentImplementationInfo } from '../../../../discovery/component/ComponentInfo';
import {
  ComponentPropertyDefinition,
  PropertyType,
  PropertyTypeName,
  ShapeTypeStructure,
} from '../ComponentPropertyDefinition';
import { ImplSerializationResult } from '../ImplSerializationResult';

export function serializeTSComponent(component:ComponentImplementationInfo):Promise<ImplSerializationResult> {
  return new Promise((resolve) => {
    const componentDoc:ComponentDoc = getDefaultComponentFrom(component.path);
    resolve({
      result: {
        name: componentDoc.displayName,
        properties: serializeProps(componentDoc, component.path),
      },
      warnings: [],
    });
  });
}

function serializeProps(componentDoc:ComponentDoc, componentPath:string):ComponentPropertyDefinition[] {
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
      type: convertTypeDefinitionToPropertyType(propType, propsSchema),
    };
  });
}

function getDefaultPropValue(propItem:PropItem | undefined):Pick<ComponentPropertyDefinition, 'defaultValue'> {
  return propItem && propItem.defaultValue ? { defaultValue: propItem.defaultValue } : {};
}

const PLAIN_PROPERTY_TYPES:PropertyTypeName[] = [
  'any',
  'array',
  'boolean',
  'custom',
  'element',
  'node',
  'number',
  'object',
  'string',
  'symbol',
  'empty',
];

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

function serializeComplexType(propType:PropItem, componentFilePath:string):PropertyType | undefined {
  if (!propType.parent) {
    return;
  }
  const rootSchema:TJS.Definition | null = getSchema(componentFilePath, propType.parent.name);
  if (!rootSchema || !rootSchema.properties || !rootSchema.properties[propType.name]) {
    return;
  }
  const typeDefinition:TJS.Definition = rootSchema.properties[propType.name];
  return convertTypeDefinitionToPropertyType(typeDefinition, rootSchema);
}

function isPlainTypeDefinition(type:TJS.Definition['type']):type is PropertyTypeName {
  return typeof type === 'string' && PLAIN_PROPERTY_TYPES.includes(type as PropertyTypeName);
}

function convertTypeDefinitionToPropertyType(typeDefinition:TJS.Definition, rootSchema:TJS.Definition):PropertyType {
  if (typeDefinition.enum) {
    let elements:PropertyType[] = [];
    if (isPrimitiveTypeUnion(typeDefinition.enum)) {
      elements = typeDefinition.enum.map(mapPrimitiveTypesUnion);
    }
    return { name: 'union', structure: { elements } };
  }
  if (typeDefinition.$ref) {
    const nestedDefinition:TJS.Definition = get(rootSchema, schemaPathToLodashPath(typeDefinition.$ref));
    return convertTypeDefinitionToPropertyType(nestedDefinition, rootSchema);
  }
  if (typeDefinition.properties) {
    return {
      name: 'shape',
      structure: reduce<TJS.Definition, ShapeTypeStructure>(typeDefinition.properties,
        (structure, propertyDefinition, propertyName) => {
          structure[propertyName] = convertTypeDefinitionToPropertyType(propertyDefinition, rootSchema);
          return structure;
        }, {}),
    };
  }
  if (isPlainTypeDefinition(typeDefinition.type)) {
    return { name: typeDefinition.type, structure: {} };
  }
  return { name: 'unsupported', structure: { raw: JSON.stringify(typeDefinition) } };
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

function getDefaultComponentFrom(filePath:string):ComponentDoc {
  let components:ComponentDoc[];
  try {
    components = parse(filePath);
  } catch (e) {
    components = [];
  }
  const expectedComponentName:string = parsePath(filePath).name;
  const nameRegex:RegExp = new RegExp(expectedComponentName, 'i');
  const component:ComponentDoc | undefined = components.find((c) => nameRegex.test(c.displayName));
  if (component) {
    return component;
  }
  throw new Error(`No \`${expectedComponentName}\` component found in ${filePath}`);
}

function isPrimitiveTypeUnion(enumType:TJS.PrimitiveType[] | TJS.Definition[]):enumType is TJS.PrimitiveType[] {
  return ['number', 'boolean', 'string'].includes(typeof enumType[0]) || isNull(enumType[0]);
}

function schemaPathToLodashPath(schemaPath:string):string {
  const [, ...segments] = schemaPath.split('/');
  return segments.join('.');
}

function getNameOfTypeOfPropertiesObject(props:Props):string | undefined {
  const itemWithParentDefinition:PropItem | undefined = values(props).find((item) => !!item.parent);
  if (!itemWithParentDefinition) {
    return;
  }
  return itemWithParentDefinition.parent!.name;
}
