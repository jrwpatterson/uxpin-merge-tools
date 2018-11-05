import * as TJS from 'typescript-json-schema';
import { PropertyType } from '../../../ComponentPropertyDefinition';
import { PropertyTypeSerializationStrategy } from './PropertyTypeSerializationStrategy';

// tslint:disable:prefer-function-over-method

export class UnsupportedTypeStrategy implements PropertyTypeSerializationStrategy {
  public isApplicableFor():boolean {
    return true;
  }

  public serialize(typeDefinition:TJS.Definition):PropertyType {
    return { name: 'unsupported', structure: { raw: JSON.stringify(typeDefinition) } };
  }
}
