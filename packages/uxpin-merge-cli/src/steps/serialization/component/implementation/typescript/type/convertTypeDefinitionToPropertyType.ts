import { PropItem } from 'react-docgen-typescript';
import * as TJS from 'typescript-json-schema';
import { PropertyType } from '../../ComponentPropertyDefinition';
import { AnyTypeStrategy } from './strategy/AnyTypeStrategy';
import { EnumTypeStrategy } from './strategy/EnumTypeStrategy';
import { PlainTypeStrategy } from './strategy/PlainTypeStrategy';
import { PropertyTypeSerializationStrategy } from './strategy/PropertyTypeSerializationStrategy';
import { ShapeTypeStrategy } from './strategy/ShapeTypeStrategy';
import { TypeReferenceStrategy } from './strategy/TypeReferenceStrategy';
import { UnsupportedTypeStrategy } from './strategy/UnsupportedTypeStrategy';

const STRATEGIES:PropertyTypeSerializationStrategy[] = [
  new EnumTypeStrategy(),
  new PlainTypeStrategy(),
  new ShapeTypeStrategy(),
  new TypeReferenceStrategy(),
  new AnyTypeStrategy(),
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
