import { isNull, toPairs } from 'lodash';
import { parse as parsePath } from 'path';
import { ComponentDoc, parse, PropItem } from 'react-docgen-typescript/lib';
import * as ts from 'typescript';
import * as TJS from 'typescript-json-schema';
import { ComponentImplementationInfo } from '../../../../discovery/component/ComponentInfo';
import { ComponentPropertyDefinition, PropertyType, PropertyTypeName } from '../ComponentPropertyDefinition';
import { ImplSerializationResult } from '../ImplSerializationResult';
import { convertTypeName } from './type/convertTypeName';

export function serializeTSComponent(component:ComponentImplementationInfo):Promise<ImplSerializationResult> {
  return new Promise((resolve) => {
    const componentDoc:ComponentDoc = getDefaultComponentFrom(component.path);
    const result:ComponentPropertyDefinition[] = toPairs(componentDoc.props)
      .map(([propName, propType]) => propItemToPropDefinition(component.path, propName, propType));
    resolve({
      result: {
        name: componentDoc.displayName,
        properties: result,
      },
      warnings: [],
    });
  });
}

function propItemToPropDefinition(fileLocation:string, propName:string, propType:PropItem):ComponentPropertyDefinition {
  return {
    description: propType.description,
    isRequired: propType.required,
    name: propName,
    type: getPropType(propType, fileLocation),
  };
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
  if (propType.parent) {
    const parentSchema:TJS.Definition | null = getSchema(componentFilePath, propType.parent.name);
    const propertyTypeSchema:TJS.Definition = parentSchema!.properties![propType.name];
    if (propertyTypeSchema.enum) {
      let elements:PropertyType[] = [];
      if (isPrimitiveTypeUnion(propertyTypeSchema.enum)) {
        elements = propertyTypeSchema.enum.map(mapPrimitiveTypesUnion);
      }
      return { name: 'union', structure: { elements } };
    }
  }
  return;
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

function getPropType(propType:PropItem, componentFilePath:string):PropertyType {
  const convertedTypeName:PropertyTypeName = convertTypeName(propType.type.name);
  if (PLAIN_PROPERTY_TYPES.includes(convertedTypeName)) {
    return { name: convertedTypeName, structure: {} };
  }
  const serializedComplexType:PropertyType | undefined = serializeComplexType(propType, componentFilePath);
  if (serializedComplexType) {
    return serializedComplexType;
  }
  return { name: 'unsupported', structure: { raw: propType.type.name } };
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
