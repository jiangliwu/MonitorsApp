import { BrowserWindow } from 'electron';
import { WindowContext } from './window-utils';
import { AppConfig } from '../../common/config';

export const createSettingWindow = async (
  context: WindowContext,
): Promise<BrowserWindow> => {
  const { name } = AppConfig;
  const window = new BrowserWindow({
    width: 420,
    height: 420,
    show: false,
    title: `${name} Preferences`,
    minimizable: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: context.pref,
  });
  await window.loadURL(`${context.indexPath}?#setting-window`);
  return window;
};
