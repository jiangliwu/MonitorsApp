import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Button, TextField } from '@mui/material';
import icon from '../../../assets/icon.png';
import './SettingWindow.scss';
import { ipcService } from '../service/ipc-service';
import { getSettings, saveSettings } from '../service/local-storage';
import { AppConfig, KBAcceleratorLabel } from '../../common/config';
import { UpdateShortcutReq } from '../../common/dto';

export function SettingWindow() {
  const [value, setValue] = React.useState(0);
  const [pkg, setPkg] = useState<any>(undefined);
  const [setting, setSettings] = useState<any>(undefined);
  const [updating, setUpdating] = useState(false);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    setPkg(AppConfig);
    const values = getSettings();
    setSettings(values);
    flushToServer(values);
  }, []);

  const updateShortCut = (k: string, v: any) => {
    const newValues = { ...setting };
    newValues[k] = v;
    setSettings(newValues);
  };

  const renderSettingRow = (k: string, i: number) => {
    const label = (KBAcceleratorLabel as any)[k] || k;
    return (
      <div key={`row-${i}`} className="row">
        <TextField
          fullWidth
          size="small"
          label={label}
          variant="outlined"
          onChange={(e) => updateShortCut(k, e.target.value)}
          value={setting[k] || ''}
        />
      </div>
    );
  };
  const renderShortcut = () => {
    if (!setting) {
      return <div />;
    }

    return (
      <div className="shortcut">
        {Object.keys(setting).map(renderSettingRow)}
        <Button
          disabled={updating}
          variant="contained"
          onClick={() => flushToServer(setting)}
        >
          Save
        </Button>
      </div>
    );
  };

  const flushToServer = (values: any) => {
    setUpdating(true);
    const req: UpdateShortcutReq = {
      items: Object.keys(values)
        .filter((i) => i.indexOf('Up') > 0 || i.indexOf('Down') > 0)
        .map((i) => ({
          key: i,
          shortcut: values[i],
        })),
    };

    ipcService
      .updateSettings(req)
      .then((rsp) => {
        if (rsp.result) {
          saveSettings(values);
        }
      })
      .finally(() => setUpdating(false));
  };

  const renderAbout = () => {
    return (
      <div className="about-root">
        <img alt="logo" src={icon} />
        {pkg && (
          <>
            <div>{pkg.name}</div>
            <div>{pkg.version}</div>
            <div>{pkg.email}</div>
          </>
        )}
      </div>
    );
  };
  return (
    <div className="setting-window">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Shortcut Setting" />
          <Tab label="About" />
        </Tabs>
      </Box>

      {value === 0 && renderShortcut()}
      {value === 1 && renderAbout()}
    </div>
  );
}
