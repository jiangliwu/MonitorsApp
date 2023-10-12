import { GetDisplayRsp } from '../../common/dto';
import {
  DefaultKBAcceleratorMac,
  DefaultKBAcceleratorWin,
} from '../../common/config';

export const getCachedDisplay = (): GetDisplayRsp[] => {
  const str = window.localStorage.getItem('cached-display');
  try {
    return JSON.parse(str || '[]');
  } catch (e) {
    return [];
  }
};

export const saveDisplays = (displays: GetDisplayRsp[]) => {
  window.localStorage.setItem('cached-display', JSON.stringify(displays));
};

export const getOS = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i;
  const windowsPlatforms = /(win32|win64|windows|wince)/i;
  const iosPlatforms = /(iphone|ipad|ipod)/i;
  let os = null;

  if (macosPlatforms.test(userAgent)) {
    os = 'macos';
  } else if (iosPlatforms.test(userAgent)) {
    os = 'ios';
  } else if (windowsPlatforms.test(userAgent)) {
    os = 'windows';
  } else if (/android/.test(userAgent)) {
    os = 'android';
  } else if (/linux/.test(userAgent)) {
    os = 'linux';
  }

  return os;
};

export const getSettings = (): Record<string, any> => {
  const str = window.localStorage.getItem('setting-display');
  const plat = getOS();
  try {
    return JSON.parse(str || '');
  } catch (e) {
    return plat === 'macos' ? DefaultKBAcceleratorMac : DefaultKBAcceleratorWin;
  }
};

export const saveSettings = (setting: any) => {
  window.localStorage.setItem('setting-display', JSON.stringify(setting));
};
