import {
  contextBridge,
  clipboard,
  ipcRenderer,
  IpcRendererEvent,
} from 'electron';

export type Channels = 'connect' | 'getIP' | 'winHide';

const IPC = {
  sendMessage(channel: Channels, args: unknown[]) {
    ipcRenderer.send(channel, args);
  },
  on(channel: Channels, func: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      func(...args);
    ipcRenderer.on(channel, subscription);

    return () => ipcRenderer.removeListener(channel, subscription);
  },
  once<T extends unknown[]>(channel: Channels, func: (...args: T) => void) {
    ipcRenderer.once(channel, (_event, ...args) => func(...(args as T)));
  },
};

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: IPC,
  clipboard,
});
