import { PathLike, readFile, writeFile } from 'fs';
import { join, parse } from 'path';
import { promisify } from 'util';

const writeFileAsync:((path:PathLike, data:string) => Promise<void>) = promisify(writeFile);
const readFileAsync:((path:PathLike, encoding:string) => Promise<string>) = promisify(readFile);

const fileHead:string = '/* @jsx __uxpinParsePreset */';

const fileTail:string = `
  function __uxpinParsePreset(type, props, ...children) {
    const displayName = typeof type === 'function'
          ? type.displayName || type.name || 'Unknown'
          : type;

    return {
      name: displayName,
      props: JSON.parse(JSON.stringify(props)),
      children: children,
    };
  }
`;

export async function decorateReactPresetFile(tmpDir:string, presetPath:string):Promise<string> {
  const { dir, name, ext } = parse(presetPath);
  const decoratedFileName:string = `${name}.__uxpin__${ext}`;
  const decoratedFilePath:string = join(dir, decoratedFileName);

  const filePresetContent:string = await getFileContent(presetPath);
  await writeFileAsync(decoratedFilePath, `${fileHead}

${filePresetContent}

${fileTail}`);

  return decoratedFilePath;
}

function getFileContent(path:string):Promise<string> {
  return readFileAsync(path, 'utf8');
}
