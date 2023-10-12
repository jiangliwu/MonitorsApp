import { BrowserWindow } from 'electron';
import { WindowContext } from './window-utils';

export const BASE_HEIGHT = 180;
export const ITEM_HEIGHT = 85;

export const createTrayWindow = async (
  context: WindowContext,
): Promise<BrowserWindow> => {
  const window = new BrowserWindow({
    width: 220,
    height: BASE_HEIGHT,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: { ...context.pref, backgroundThrottling: false },
  });
  await window.loadURL(`${context.indexPath}?#tray-window`);

  // Hide the window when it loses focus
  window.on('blur', () => {
    window.hide();
  });
  return window;
};
