import { BrowserWindow, Tray } from 'electron';
import { WindowContext } from './window-utils';
import { BASE_HEIGHT, createTrayWindow, ITEM_HEIGHT } from './tray-window';
import { createSettingWindow } from './setting-window';

class WindowHelper {
  trayWindow: BrowserWindow | undefined;

  settingWindow: BrowserWindow | undefined;

  tray: Tray | undefined;

  kbTipTimeout: any = 0;

  context: WindowContext | undefined = undefined;

  init = async (context: WindowContext) => {
    this.trayWindow = await createTrayWindow(context);
    this.settingWindow = await createSettingWindow(context);
    this.context = context;

    this.tray = new Tray(context.getRes('tray/trayTemplate.png'));
    this.tray.on('right-click', this.toggleTrayWindow);
    this.tray.on('double-click', this.toggleTrayWindow);
    this.tray.on('click', (event) => {
      this.toggleTrayWindow();
      if (this.trayWindow?.isVisible() && process.defaultApp && event.metaKey) {
        this.trayWindow?.webContents.openDevTools({ mode: 'detach' });
      }
    });
  };

  toggleTrayWindow = () => {
    if (this.trayWindow?.isVisible()) {
      this.trayWindow?.hide();
    } else {
      this.clearTrayAction();
      this.showTrayWindow();
    }
  };

  getTrayWindowPosition = () => {
    const windowBounds = this.trayWindow?.getBounds();
    if (!windowBounds) {
      return { x: 0, y: 0 };
    }
    const trayBounds = this.tray?.getBounds();

    if (!trayBounds) {
      return { x: 0, y: 0 };
    }
    // Center window horizontally below the tray icon
    const x = Math.round(
      trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2,
    );
    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4);
    return { x, y };
  };

  showTrayWindow = () => {
    const position = this.getTrayWindowPosition();
    this.trayWindow?.setPosition(position.x, position.y, false);
    this.trayWindow?.show();
    this.trayWindow?.focus();
  };

  updateTrayWindowHeight = (count: number) => {
    const t = this.trayWindow;
    if (!t) {
      return;
    }
    const [w] = t.getSize();
    if (count <= 1) {
      t.setSize(w, BASE_HEIGHT, true);
    } else {
      t.setSize(w, BASE_HEIGHT + (count - 1) * ITEM_HEIGHT, true);
    }
  };

  clearTrayAction = () => {
    clearTimeout(this.kbTipTimeout);
  };

  showTrayWindowByKB = () => {
    this.clearTrayAction();
    this.showTrayWindow();
    this.kbTipTimeout = setTimeout(() => {
      this.trayWindow?.hide();
    }, 2000);
  };

  openSetting = async () => {
    if (!this.settingWindow || !this.context) {
      return;
    }
    if (this.settingWindow.isDestroyed()) {
      this.settingWindow = await createSettingWindow(this.context);
    }
    this.settingWindow?.show();
    this.settingWindow?.focus();
  };
}

export const windowHelper = new WindowHelper();
