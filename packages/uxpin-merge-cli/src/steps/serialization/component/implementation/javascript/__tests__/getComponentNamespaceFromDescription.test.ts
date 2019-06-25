import { getComponentNamespaceFromDescription } from '../getComponentNamespaceFromDescription';

describe('getComponentNamespaceFromDescription', () => {
  const componentName:string = 'ComponentName';

  describe('when description is empty', () => {
    const description:string = '';

    it('returns undefined', () => {
      expect(getComponentNamespaceFromDescription(componentName, description)).toBeUndefined();
    });
  });

  describe('when description does not contain @uxpinnamespace annotation', () => {
    const description:string = 'Description string without annotation';

    it('returns undefined', () => {
      expect(getComponentNamespaceFromDescription(componentName, description)).toBeUndefined();
    });
  });

  describe('when description contains single-line @uxpinnamespace annotation', () => {
    const description:string = '@uxpinnamespace CustomNamespace';

    it('returns namespace name', () => {
      expect(getComponentNamespaceFromDescription(componentName, description)).toMatchObject({
        name: 'CustomNamespace',
      });
    });
  });

  describe('when description contains single-line, multi-level @uxpinnamespace annotation', () => {
    const description:string = '@uxpinnamespace Level1.level2.CustomNamespace';

    it('returns multi-level namespace name', () => {
      expect(getComponentNamespaceFromDescription(componentName, description)).toMatchObject({
        name: 'Level1.level2.CustomNamespace',
      });
    });
  });

  describe('when description contains multi-line @uxpinnamespace annotation', () => {
    const description:string = `Some component description

@uxpinnamespace CustomNamespace
Another description line`;

    it('returns extracted namespace name', () => {
      expect(getComponentNamespaceFromDescription(componentName, description)).toMatchObject({
        name: 'CustomNamespace',
      });
    });
  });
});
