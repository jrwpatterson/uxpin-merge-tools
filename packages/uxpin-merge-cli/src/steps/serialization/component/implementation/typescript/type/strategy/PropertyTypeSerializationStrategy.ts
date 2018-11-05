import { PropItem } from 'react-docgen-typescript';
import * as TJS from 'typescript-json-schema';
import { PropertyType } from '../../../ComponentPropertyDefinition';

export interface PropertyTypeSerializationStrategy {

  isApplicableFor(typeDefinition:TJS.Definition, propItem?:PropItem):boolean;

  serialize(typeDefinition:TJS.Definition, propItem:PropItem | undefined, rootSchema:TJS.Definition):PropertyType;
}
// tslint:disable:prefer-function-over-method

