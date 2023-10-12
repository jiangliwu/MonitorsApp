import { URL } from 'url';

import { resolve } from 'path';
import { platform } from 'os';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export const isWindows = ()=> platform() === 'win32';
export const isMac = ()=> platform() === 'darwin';