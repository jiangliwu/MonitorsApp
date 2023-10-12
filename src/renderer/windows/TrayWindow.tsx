import React, { useEffect, useRef, useState } from 'react';
import {
  CircularProgress,
  Divider,
  IconButton,
  ListItemText,
  MenuItem,
  MenuList,
  Slider,
  Stack,
} from '@mui/material';
import {
  VolumeDown,
  VolumeUp,
  Brightness5,
  Brightness7,
} from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ipcService } from '../service/ipc-service';
import { GetDisplayRsp } from '../../common/dto';

import './TrayWindow.scss';
import { getCachedDisplay, saveDisplays } from '../service/local-storage';
import {
  IPC_DEFAULT_CHANNEL,
  KBEvent,
  KBEventName,
  Luminance,
  SpeakerVolume,
} from '../../common/config';

export function TrayWindow() {
  const [displays, setDisplays] = useState<GetDisplayRsp[] | undefined>(
    undefined,
  );
  const timer = useRef<any>(0);

  useEffect(() => {
    refresh(false);
  }, []);

  useEffect(() => {
    return window.electron.ipcRenderer.on(IPC_DEFAULT_CHANNEL, onIpcEvent);
  }, [displays]);

  const refresh = (force: boolean) => {
    setDisplays(undefined);
    ipcService.getDisplay({ force }).then((sDisplays) => {
      const cached = getCachedDisplay();
      sDisplays.forEach((i) => {
        const d = cached.find((j) => j.displayId === i.displayId);
        if (d) {
          i.Luminance = d.Luminance;
          i.SpeakerVolume = d.SpeakerVolume;
          ipcService.updateDisplay({
            displayId: d.displayId,
            key: Luminance,
            value: d.Luminance,
          });
          ipcService.updateDisplay({
            displayId: d.displayId,
            key: SpeakerVolume,
            value: d.SpeakerVolume,
          });
        }
      });
      setDisplays(sDisplays);
    });
  };
  const onIpcEvent = (arg: any) => {
    const [, method, , rsp] = arg;
    if (method === KBEventName)
      switch (rsp.key) {
        case KBEvent.LuminanceUp: {
          updateAllValue('Luminance', Luminance, 1);
          break;
        }
        case KBEvent.LuminanceDown: {
          updateAllValue('Luminance', Luminance, -1);
          break;
        }
        case KBEvent.SpeakerVolumeUp: {
          updateAllValue('SpeakerVolume', SpeakerVolume, 1);
          break;
        }
        case KBEvent.SpeakerVolumeDown: {
          updateAllValue('SpeakerVolume', SpeakerVolume, -1);
          break;
        }
        default:
          console.log('unsupported key event');
      }
  };

  const updateAllValue = (strKey: string, key: number, step: number) => {
    const d2 = displays || [];
    for (let i = 0; i < d2.length; i += 1) {
      const d = d2[i];
      let newV = (d as any)[strKey] + step;
      newV = Math.max(0, newV);
      newV = Math.min(newV, 100);
      updateValue(i, strKey, key, newV, 10);
    }
  };

  const updateValue = (
    index: number,
    strKey: string,
    key: number,
    value: number,
    timeout: number = 100,
  ) => {
    const newDisplays = [...(displays || [])];
    newDisplays[index] = { ...newDisplays[index], [strKey]: value };
    setDisplays(newDisplays);

    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      ipcService
        .updateDisplay({
          displayId: newDisplays[index].displayId,
          key,
          value,
        })
        .then((rsp) => {
          if (rsp.result) {
            saveDisplays(newDisplays);
            console.log('saved displays to disk');
          }
        })
        .catch(console.error);
    }, timeout);
  };

  const renderDisplay = (display: GetDisplayRsp, index: number) => {
    return (
      <div className="display" key={`display-${index}`}>
        <div className="name">{`${display.displayId} (${index})`}</div>
        <Stack spacing={2} direction="row" alignItems="center">
          <Brightness5 fontSize="small" />
          <Slider
            size="small"
            value={display.Luminance}
            onChange={(e) => {
              updateValue(
                index,
                'Luminance',
                Luminance,
                (e.target as any).value,
              );
            }}
          />
          <Brightness7 fontSize="small" />
          <span className="value-txt">{display.Luminance}</span>
        </Stack>
        <Stack spacing={2} direction="row" alignItems="center">
          <VolumeDown fontSize="small" />
          <Slider
            size="small"
            value={display.SpeakerVolume}
            onChange={(e) => {
              updateValue(
                index,
                'SpeakerVolume',
                SpeakerVolume,
                (e.target as any).value,
              );
            }}
          />
          <VolumeUp fontSize="small" />
          <span className="value-txt">{display.SpeakerVolume}</span>
        </Stack>
      </div>
    );
  };

  return (
    <div className="tray-window">
      <div className="refresh">
        <IconButton size="small" onClick={() => refresh(true)}>
          <RefreshIcon fontSize="small" />
        </IconButton>
      </div>
      <div className="content">
        {displays === undefined ? (
          <div className="loading">
            <CircularProgress />
          </div>
        ) : (
          <div className="displays">{displays.map(renderDisplay)}</div>
        )}
      </div>
      <div className="menu-part">
        <Divider />
        <MenuList dense>
          <MenuItem
            onClick={() => {
              ipcService.openSetting().then(console.log).catch(console.error);
            }}
          >
            <SettingsIcon className="menu-icon" fontSize="small" />
            <ListItemText>
              <span className="menu-txt">Preferences</span>
            </ListItemText>
          </MenuItem>
          <MenuItem onClick={() => ipcService.quit()}>
            <CloseIcon className="menu-icon" fontSize="small" />
            <ListItemText>
              <span className="menu-txt">Quit</span>
            </ListItemText>
          </MenuItem>
        </MenuList>
      </div>
    </div>
  );
}
