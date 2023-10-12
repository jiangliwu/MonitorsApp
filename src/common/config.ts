export const IPC_DEFAULT_CHANNEL = 'monitors-app';
export const Luminance = 16;
export const SpeakerVolume = 98;

export const KBEvent = {
  LuminanceUp: 'LuminanceUp',
  LuminanceDown: 'LuminanceDown',
  SpeakerVolumeUp: 'SpeakerVolumeUp',
  SpeakerVolumeDown: 'SpeakerVolumeDown',
};

export const KBEventName = 'keyboard-event';

export const KBAcceleratorLabel = {
  LuminanceUp: 'Brightness Up',
  LuminanceDown: 'Brightness Down',
  SpeakerVolumeUp: 'SpeakerVolume Up',
  SpeakerVolumeDown: 'SpeakerVolume Down',
};

export const DefaultKBAcceleratorMac = {
  LuminanceUp: 'Command+Option+Right',
  LuminanceDown: 'Command+Option+Left',
  SpeakerVolumeUp: 'Command+Option+Up',
  SpeakerVolumeDown: 'Command+Option+Down',
};

export const DefaultKBAcceleratorWin = {
  LuminanceUp: 'Ctrl+Alt+Right',
  LuminanceDown: 'Ctrl+Alt+Left',
  SpeakerVolumeUp: 'Ctrl+Alt+Up',
  SpeakerVolumeDown: 'Ctrl+Alt+Down',
};

export const AppConfig = {
  name: 'MonitorsApp',
  version: '1.0.1',
  email: 'jiangliwu.ipple@gmail.com',
};
