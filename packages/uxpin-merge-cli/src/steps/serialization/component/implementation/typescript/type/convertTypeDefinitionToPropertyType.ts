import { PropItem } from 'react-docgen-typescript';
import * as TJS from 'typescript-json-schema';
import { PropertyType } from '../../ComponentPropertyDefinition';
import { AnyTypeStrategy } from './strategy/AnyTypeStrategy';
import { DictionaryTypeStrategy } from './strategy/DictionaryTypeStrategy';
import { EnumTypeStrategy } from './strategy/EnumTypeStrategy';
import { FunctionTypeStrategy } from './strategy/FunctionTypeStrategy';
import { NodeTypeStrategy } from './strategy/NodeTypeStrategy';
import { PlainTypeStrategy } from './strategy/PlainTypeStrategy';
import { PropertyTypeSerializationStrategy } from './strategy/PropertyTypeSerializationStrategy';
import { ReactElementTypeStrategy } from './strategy/ReactElementTypeStrategy';
import { ShapeTypeStrategy } from './strategy/ShapeTypeStrategy';
import { ArrayTypeStrategy } from './strategy/TypedArrayTypeStrategy';
import { TypeReferenceStrategy } from './strategy/TypeReferenceStrategy';
import { UnsupportedTypeStrategy } from './strategy/UnsupportedTypeStrategy';

const STRATEGIES:PropertyTypeSerializationStrategy[] = [
  new ReactElementTypeStrategy(),
  new NodeTypeStrategy(),
  new FunctionTypeStrategy(),
  new EnumTypeStrategy(),
  new PlainTypeStrategy(),
  new DictionaryTypeStrategy(),
  new ShapeTypeStrategy(),
  new TypeReferenceStrategy(),
  new AnyTypeStrategy(),
  new ArrayTypeStrategy(),
];

export function convertTypeDefinitionToPropertyType(
  typeDefinition:TJS.Definition,
  rootSchema:TJS.Definition,
  propItem?:PropItem,
):PropertyType {
  const serializationStrategy:PropertyTypeSerializationStrategy =
    findStrategy(typeDefinition, propItem) || new UnsupportedTypeStrategy();
  return serializationStrategy.serialize(typeDefinition, propItem, rootSchema);
}

function findStrategy(typeDefinition:TJS.Definition, propItem?:PropItem):PropertyTypeSerializationStrategy | undefined {
  return STRATEGIES.find((strategy) => strategy.isApplicableFor(typeDefinition, propItem));
}
