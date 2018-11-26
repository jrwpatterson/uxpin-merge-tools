import { compileReactPreset } from './compiler/compileReactPreset';
import { ParseOptions } from './ParseOptions';

export async function parseReactPresets(options:ParseOptions):Promise<object> {
  const bundlePath:string = await compileReactPreset(options);
  const presets:any = require(bundlePath).default;

  return {
    rootId: presets.props.key,
    elements: parsePresets(presets, {}),
  };
}

function parsePresets(element:any, elements:any) {
  if (typeof element === 'string') {
    return;
  }

  const children:any = mapChildren(element) || {};
  const { key, ...props } = element.props;
  elements[key] = {
    name: element.name,
    props: {
      ...props,
      ...children,
    },
  };

  element.children.forEach((child) => parsePresets(child, elements));

  return elements;
}

function mapChildren(element) {
  const { children } = element;
  if (!children || !children.length) {
    return {};
  }

  if (children.length === 1 && typeof children[0] === 'string') {
    return { children: children[0] };
  }

  return {
    children: children.map(child => ({ uxpinPresetElementId: child.props.key })),
  };
}
