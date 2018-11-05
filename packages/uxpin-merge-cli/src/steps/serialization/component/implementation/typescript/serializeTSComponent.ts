import { ComponentDoc } from 'react-docgen-typescript/lib';
import * as TJS from 'typescript-json-schema';
import { ComponentImplementationInfo } from '../../../../discovery/component/ComponentInfo';
import { ImplSerializationResult } from '../ImplSerializationResult';
import { getJSONSchemaForProps } from './getJSONSchemaForProps';
import { getReactDocGenMetadataForComponent } from './getReactDocGenMetadataForComponent';
import { serializeProps } from './serializeProps';

export function serializeTSComponent(component:ComponentImplementationInfo):Promise<ImplSerializationResult> {
  return new Promise((resolve) => {
    const componentDoc:ComponentDoc = getReactDocGenMetadataForComponent(component.path);
    const propsSchema:TJS.Definition | undefined = getJSONSchemaForProps(componentDoc, component.path);
    resolve({
      result: {
        name: componentDoc.displayName,
        properties: serializeProps(componentDoc, propsSchema),
      },
      warnings: [],
    });
  });
}
