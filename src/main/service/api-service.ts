import {
  Continuous,
  DisplayManager,
  VCPFeatureCode,
  Display,
} from '@ddc-node/ddc-node';
import { app, globalShortcut } from 'electron';
import {
  GetDisplayReq,
  GetDisplayRsp,
  UpdateDisplayReq,
  UpdateDisplayRsp,
  UpdateShortcutReq,
  UpdateShortcutRsp,
} from '../../common/dto';
import { windowHelper } from '../windows/window-helper';
import { IPC_DEFAULT_CHANNEL, KBEventName } from '../../common/config';

let cachedDisplays: GetDisplayRsp[] = [];
let displays: Display[] = [];

export const getDisplay = async (
  req: GetDisplayReq,
): Promise<GetDisplayRsp[]> => {

  if (!req.force && cachedDisplays.length > 0) {
    console.log('returned cached displays');
    return cachedDisplays;
  }
  displays = await new DisplayManager().collect();
  cachedDisplays = [];

  for (const display of displays) {

    if (!display.serialNumber && !display.modelId && !display.modelName) {
      continue;
    }

    try {
      const l = (await display.getVcpFeature(
        VCPFeatureCode.ImageAdjustment.Luminance,
      )) as Continuous;
      const sv = (await display.getVcpFeature(
        VCPFeatureCode.Audio.SpeakerVolume,
      )) as Continuous;

      cachedDisplays.push({
        name: display.modelName || `Display ${display.index}`,
        displayId: display.displayId,
        Luminance: l?.currentValue || 6,
        SpeakerVolume: sv?.currentValue || 30,
        serialNumber: display.serialNumber || `serialNumber ${display.index}`,
      });
    } catch (e) {
      console.error(e);
    }
  }
  windowHelper.updateTrayWindowHeight(cachedDisplays.length);
  return cachedDisplays;
};

export const updateDisplay = async (
  req: UpdateDisplayReq,
): Promise<UpdateDisplayRsp> => {
  const display = displays.find((i) => i.displayId === req.displayId);
  if (!display) {
    throw new Error('no such display found');
  }
  console.log('updateDisplay', req);
  await display.setVcpFeature(req.key, req.value);
  return { result: true };
};

export const sendKBEventToWindow = async (shortcut: string, key: string) => {
  windowHelper.trayWindow?.webContents.send(IPC_DEFAULT_CHANNEL, [
    KBEventName,
    KBEventName,
    1,
    { shortcut, key },
  ]);
  windowHelper.showTrayWindowByKB();
};

export const updateGlobalShortcut = async (
  req: UpdateShortcutReq,
): Promise<UpdateShortcutRsp> => {
  globalShortcut.unregisterAll();

  const createCallback = (shortcut: string, key: string) => {
    return () => {
      sendKBEventToWindow(shortcut, key);
    };
  };
  req.items.forEach((i) => {
    const k = i.key;
    const s = i.shortcut;
    console.log('globalShortcut.register', s, k);
    globalShortcut.register(i.shortcut, createCallback(s, k));
  });

  return { result: true };
};

export const quitApp = async () => {
  app.quit();
};
export const openSetting = async () => {
  await windowHelper.openSetting();
};
