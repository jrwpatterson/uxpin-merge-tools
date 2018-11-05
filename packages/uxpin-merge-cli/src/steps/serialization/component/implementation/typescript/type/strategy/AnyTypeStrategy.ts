import { isEmpty } from 'lodash';
import * as TJS from 'typescript-json-schema';
import { PropertyType } from '../../../ComponentPropertyDefinition';
import { PropertyTypeSerializationStrategy } from './PropertyTypeSerializationStrategy';

// tslint:disable:prefer-function-over-method

export class AnyTypeStrategy implements PropertyTypeSerializationStrategy {
  public isApplicableFor(typeDefinition:TJS.Definition):boolean {
    return isEmpty(typeDefinition);
  }

  public serialize():PropertyType {
    return { name: 'any', structure: {} };
  }
}
