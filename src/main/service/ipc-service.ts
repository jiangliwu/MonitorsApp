import { ipcMain } from 'electron';
import { IPC_DEFAULT_CHANNEL } from '../../common/config';
import {
  getDisplay,
  openSetting,
  quitApp,
  updateDisplay,
  updateGlobalShortcut,
} from './api-service';

export const Apis = {
  'get-display': getDisplay,
  'update-display': updateDisplay,
  'update-shortcut': updateGlobalShortcut,
  quit: quitApp,
  'open-setting': openSetting,
} as any;

ipcMain.on(IPC_DEFAULT_CHANNEL, async (event, args) => {
  const [id, method, req] = args;
  const api = Apis[method];
  if (!api) {
    event.reply(IPC_DEFAULT_CHANNEL, [
      id,
      method,
      0,
      { message: 'no such method' },
    ]);
    return;
  }
  try {
    console.log(id, method, req);
    const rsp = await api(req);
    event.reply(IPC_DEFAULT_CHANNEL, [id, method, 1, rsp]);
  } catch (e) {
    event.reply(IPC_DEFAULT_CHANNEL, [id, method, 0, { message: e }]);
  }
});
