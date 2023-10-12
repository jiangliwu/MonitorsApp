import { IPC_DEFAULT_CHANNEL } from '../../common/config';
import { DeferredPromise } from '../../common/deferred-promise';
import {
  GetDisplayReq,
  GetDisplayRsp,
  UpdateDisplayReq,
  UpdateDisplayRsp,
  UpdateShortcutReq,
  UpdateShortcutRsp,
} from '../../common/dto';

class IpcService {
  reqs: Record<string, DeferredPromise<any>> = {};

  response = (arg: any[]) => {
    const [reqId, , status, rsp] = arg;
    const promise = this.reqs[reqId];
    if (!promise) {
      console.log(`ignore response for req = ${reqId}`);
      return;
    }
    try {
      if (status) {
        promise.resolve(rsp);
      } else {
        promise.reject(rsp);
      }
    } catch (e) {
      console.error(e);
    }
  };

  makeCall = async (method: string, req: any): Promise<any> => {
    const id = method + Date.now() + Math.random();
    window.electron.ipcRenderer.sendMessage(IPC_DEFAULT_CHANNEL, [
      id,
      method,
      req,
    ]);
    const promise = new DeferredPromise();
    this.reqs[id] = promise;
    return promise;
  };

  getDisplay = async (req: GetDisplayReq): Promise<GetDisplayRsp[]> => {
    return this.makeCall('get-display', req);
  };

  updateDisplay = async (req: UpdateDisplayReq): Promise<UpdateDisplayRsp> => {
    return this.makeCall('update-display', req);
  };

  updateSettings = async (
    req: UpdateShortcutReq,
  ): Promise<UpdateShortcutRsp> => {
    return this.makeCall('update-shortcut', req);
  };

  quit = async () => {
    await this.makeCall('quit', {});
  };

  openSetting = async () => {
    await this.makeCall('open-setting', {});
  };
}

export const ipcService = new IpcService();

window.electron.ipcRenderer.on(IPC_DEFAULT_CHANNEL, (arg) => {
  console.log('window.electron.ipcRenderer.on', arg);
  ipcService.response(arg as any);
});
