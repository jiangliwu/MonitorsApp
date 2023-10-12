export interface GetDisplayReq {
  force?: boolean;
}

export interface GetDisplayRsp {
  name: string;
  serialNumber: string;
  displayId: string;
  Luminance: number;
  SpeakerVolume: number;
}

export interface UpdateDisplayReq {
  displayId: string;
  key: number;
  value: number;
}

export interface UpdateDisplayRsp {
  result: boolean;
}

export interface UpdateShortcutReq {
  items: {
    key: string;
    shortcut: string;
  }[];
}

export interface UpdateShortcutRsp {
  result: boolean;
}
