import { every, isArray } from 'lodash';
import { PropItem } from 'react-docgen-typescript';
import * as TJS from 'typescript-json-schema';
import { PropertyType } from '../../../ComponentPropertyDefinition';
import { PropertyTypeSerializationStrategy } from './PropertyTypeSerializationStrategy';
import { REACT_ELEMENT_REF_REGEX } from './ReactElementTypeStrategy';

const REACT_NODE_REGEX:RegExp = /ReactNode/;

// tslint:disable:prefer-function-over-method
export class NodeTypeStrategy implements PropertyTypeSerializationStrategy {
  public isApplicableFor(typeDefinition:TJS.Definition, propItem?:PropItem):boolean {
    return isNodeTypeDefinedWithPropItem(propItem) || isNodeTypeDefinedWithSchema(typeDefinition);
  }

  public serialize(typeDefinition:TJS.Definition, propItem:PropItem | undefined):PropertyType {
    return { name: 'node', structure: {} };
  }
}

function isNodeTypeDefinedWithPropItem(propItem?:PropItem):boolean {
  return !!propItem && REACT_NODE_REGEX.test(propItem.type.name);
}

const REACT_NODE_CONDITIONS:Array<(type:TJS.Definition) => boolean> = [
  acceptsReactElement,
  acceptsArrayOfReactElements,
  acceptsString,
  acceptsNumber,
];

function isNodeTypeDefinedWithSchema(typeDefinition:TJS.Definition):boolean {
  return every(REACT_NODE_CONDITIONS, (condition) => condition(typeDefinition));
}

function acceptsReactElement(type:TJS.Definition):boolean {
  return isTypeOrUnionContaining(type, (item) => !!item.$ref && REACT_ELEMENT_REF_REGEX.test(item.$ref));
}

function acceptsArrayOfReactElements(type:TJS.Definition):boolean {
  return isTypeOrUnionContaining(type, (item) => {
    return item.type === 'array' && !!item.items && isTypeOrUnionContaining(item.items, acceptsReactElement);
  });
}

function acceptsString(type:TJS.Definition):boolean {
  return isTypeOrUnionContaining(type, (item) => {
    return item.type === 'sting' || (isArray(item.type) && item.type.includes('string'));
  });
}

function acceptsNumber(type:TJS.Definition):boolean {
  return isTypeOrUnionContaining(type, (item) => {
    return item.type === 'number' || (isArray(item.type) && item.type.includes('number'));
  });
}

function isTypeOrUnionContaining(
  type:TJS.Definition | TJS.Definition[],
  unionItemPredicate:(item:TJS.Definition) => boolean,
):boolean {
  if (isArray(type)) {
    return !!type.find(unionItemPredicate);
  }
  return unionItemPredicate(type) || (!!type.anyOf && !!type.anyOf.find(unionItemPredicate));
}
