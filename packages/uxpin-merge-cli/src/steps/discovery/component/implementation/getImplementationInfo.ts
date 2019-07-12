import { extname } from 'path';
import { ComponentImplementationInfo } from '../ComponentInfo';

export function getImplementationInfo(path:string):ComponentImplementationInfo | null {
  const info:Pick<ComponentImplementationInfo, 'path'> = {
    path,
  };
  const extension:string = extname(path);

  if (['.vue'].includes(extension)) {
    return { ...info, framework: 'vue', lang: 'javascript' };
  }

  if (['.ts', '.tsx'].includes(extension)) {
    return { ...info, framework: 'reactjs', lang: 'typescript' };
  }

  if (['.js', '.jsx'].includes(extension)) {
    return { ...info, framework: 'reactjs', lang: 'javascript' };
  }

  return null;
}
