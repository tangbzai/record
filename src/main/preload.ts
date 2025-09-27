import {
  contextBridge,
  clipboard,
  ipcRenderer,
  IpcRendererEvent,
} from 'electron';

export type Channels = 'connect' | 'getIP' | 'winHide';

const IPC = {
  sendMessage<T extends unknown[]>(channel: Channels, args: T) {
    ipcRenderer.send(channel, args);
  },
  on<T extends unknown[]>(channel: Channels, func: (...args: T) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: T) =>
      func(...args);
    ipcRenderer.on(channel, subscription);

    return () => ipcRenderer.removeListener(channel, subscription);
  },
  once<T extends unknown[]>(channel: Channels, func: (...args: T) => void) {
    ipcRenderer.once(channel, (_event, ...args: T) => func(...args));
  },
};

const electronObj = {
  ipcRenderer: IPC,
  clipboard,
};
export type ElectronType = typeof electronObj;
contextBridge.exposeInMainWorld('electron', electronObj);
