import path from 'path';
import { app, WebPreferences } from 'electron';
import { resolveHtmlPath } from './util';
import { WindowContext } from './windows/window-utils';
import { windowHelper } from './windows/window-helper';
import './service/ipc-service';

app.dock.hide();
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')({ showDevTools: false });
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const webPref: WebPreferences = {
    preload: app.isPackaged
      ? path.join(__dirname, 'preload.js')
      : path.join(__dirname, '../../.erb/dll/preload.js'),
  };

  const context: WindowContext = {
    getRes: getAssetPath,
    indexPath: resolveHtmlPath('index.html'),
    pref: webPref,
  };
  await windowHelper.init(context);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  await createWindow();
});
