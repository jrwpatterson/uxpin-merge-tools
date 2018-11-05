import { values } from 'lodash';
import { ComponentDoc, PropItem, Props } from 'react-docgen-typescript';
import * as ts from 'typescript';
import * as TJS from 'typescript-json-schema';

const compilerOptions:any = {
  jsx: 'react',
  lib: ['es2016', 'dom'],
  module: 'commonjs',
  moduleResolution: 'node',
  skipLibCheck: true,
};

export function getJSONSchemaForProps(
  componentDoc:ComponentDoc,
  componentPath:string,
):TJS.Definition | undefined {
  const propertiesTypeName:string | undefined = getNameOfTypeOfPropertiesObject(componentDoc.props);
  if (!propertiesTypeName) {
    return;
  }
  const propsSchema:TJS.Definition | null = getSchema(componentPath, propertiesTypeName);
  if (!propsSchema) {
    return;
  }
  return propsSchema;
}

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
